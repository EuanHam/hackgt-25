from datetime import datetime
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from openai import OpenAI
from dotenv import load_dotenv
import os
import base64

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAPI_API_KEY"))

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

def chatgpt_filter(emails):
    """
    Filters emails using ChatGPT to decide which are relevant to school or employment.
    Returns only the relevant emails.
    """
    # Prepare the text we’ll send to GPT
    email_texts = "\n\n".join(
        f"From: {e['from']}\nSubject: {e['subject']}\nDate: {e['date']}\nBody: {e['body']}"
        for e in emails
    )

    prompt = f"""
You are an assistant that classifies emails. 
Determine which emails are relevant to **school or employment**. 
Return ONLY a JSON array of the relevant emails (from the list below) with their fields intact.
If none are relevant, return an empty JSON array [].

Here are the emails:
{email_texts}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # cheaper model for classification
        messages=[
            {"role": "system", "content": "You are a helpful assistant that filters emails."},
            {"role": "user", "content": prompt}
        ],
        temperature=0  # deterministic classification
    )

    # GPT returns text; parse JSON from it
    import json
    import re

    raw_output = response.choices[0].message.content.strip()

    try:
        relevant_emails = json.loads(raw_output)
    except json.JSONDecodeError:
        # Fallback: extract the JSON array/object from the string
        match = re.search(r"(\[.*\]|\{.*\})", raw_output, re.DOTALL)
        if match:
            relevant_emails = json.loads(match.group(0))
        else:
            print("Could not parse GPT output:", raw_output)
            relevant_emails = []

    return relevant_emails


def get_email_body(payload):
    """Extract plain text email body from Gmail message payload without cleaning."""
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] == 'text/plain':
                data = part['body'].get('data')
                if data:
                    decoded = base64.urlsafe_b64decode(data).decode('utf-8')
                    return decoded  # raw body
    elif payload.get('body', {}).get('data'):
        data = payload['body']['data']
        decoded = base64.urlsafe_b64decode(data).decode('utf-8')
        return decoded  # raw body
    return "(No body found)"

def get_gmail_emails(access_token: str, max_results: int = 10, start_date: str = None, end_date: str = None):
    """
    Fetch Gmail emails in a given date range (if provided).
    Dates should be strings in 'YYYY-MM-DD' format.
    """
    try:
        creds = Credentials(token=access_token, scopes=SCOPES)
        service = build("gmail", "v1", credentials=creds)

        # Build Gmail search query
        query = ""
        if start_date:
            start_timestamp = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp())
            query += f" after:{start_timestamp}"
        if end_date:
            end_timestamp = int(datetime.strptime(end_date, "%Y-%m-%d").timestamp())
            query += f" before:{end_timestamp}"

        results = service.users().messages().list(
            userId="me",
            maxResults=max_results,
            q=query.strip()
        ).execute()

        messages = results.get("messages", [])
        emails = []

        for msg in messages:
            msg_detail = service.users().messages().get(userId="me", id=msg["id"]).execute()
            headers = msg_detail.get("payload", {}).get("headers", [])

            subject = next((h["value"] for h in headers if h["name"] == "Subject"), "(No Subject)")
            sender = next((h["value"] for h in headers if h["name"] == "From"), "(Unknown Sender)")
            date_sent = next((h["value"] for h in headers if h["name"] == "Date"), "(Unknown Date)")
            body = get_email_body(msg_detail.get("payload", {}))

            emails.append({
                "from": sender,
                "subject": subject,
                "date": date_sent,
                "body": body
            })

        print(emails)

        filtered_emails = chatgpt_filter(emails)
        filtered_out = len(emails) - len(filtered_emails)

        return filtered_emails, filtered_out

    except HttpError as error:
        raise Exception(f"Gmail API error: {error}")
