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
    print(f"DEBUG: Starting to filter {len(emails)} emails")
    
    # Prepare the text we'll send to GPT
    email_texts = "\n\n".join(
        f"Email {i+1}:\nFrom: {e['from']}\nSubject: {e['subject']}\nDate: {e['date']}\nBody: {e['body'][:500]}..."  # Limit body to 500 chars
        for i, e in enumerate(emails)
    )

    prompt = f"""
You are an assistant that classifies emails. 
Determine which emails are relevant to **school, employment, internships, job applications, career opportunities, interviews, or professional development**. 
Be INCLUSIVE rather than exclusive - if there's any doubt, include the email.

Keywords to look for: interview, job, career, internship, application, offer, position, employment, school, university, college, academic, Nike, company names, HR, recruiting, etc.

Return ONLY a JSON array of the relevant emails (from the list below) with their fields intact.
If none are relevant, return an empty JSON array [].

Here are the emails:
{email_texts}
    """

    print(f"DEBUG: Sending prompt to OpenAI with {len(email_texts)} characters")

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # cheaper model for classification
        messages=[
            {"role": "system", "content": "You are a helpful assistant that filters emails for students and job seekers. Be inclusive when classifying emails."},
            {"role": "user", "content": prompt}
        ],
        temperature=0  # deterministic classification
    )

    # GPT returns text; parse JSON from it
    import json
    import re

    raw_output = response.choices[0].message.content.strip()
    print(f"DEBUG: OpenAI response: {raw_output[:200]}...")

    try:
        relevant_emails = json.loads(raw_output)
        print(f"DEBUG: Successfully parsed {len(relevant_emails)} relevant emails")
    except json.JSONDecodeError:
        print("DEBUG: JSON decode failed, trying regex extraction")
        # Fallback: extract the JSON array/object from the string
        match = re.search(r"(\[.*\]|\{.*\})", raw_output, re.DOTALL)
        if match:
            relevant_emails = json.loads(match.group(0))
            print(f"DEBUG: Regex extraction successful, got {len(relevant_emails)} relevant emails")
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

def get_gmail_emails(access_token: str, max_results: int = 10, start_date: str = None, end_date: str = None, use_ai_filter: bool = True):
    """
    Fetch Gmail unread emails in a given date range (if provided).
    Dates should be strings in 'YYYY-MM-DD' format.
    use_ai_filter: If False, returns all emails without OpenAI filtering
    """
    try:
        creds = Credentials(token=access_token, scopes=SCOPES)
        service = build("gmail", "v1", credentials=creds)

        # Build Gmail search query - include both read and unread emails
        query = ""  # Start with no restrictions to get all emails
        if start_date:
            start_timestamp = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp())
            query += f"after:{start_timestamp}"
        if end_date:
            end_timestamp = int(datetime.strptime(end_date, "%Y-%m-%d").timestamp())
            if query:
                query += f" before:{end_timestamp}"
            else:
                query += f"before:{end_timestamp}"

        print(f"DEBUG: Gmail search query: {query}")
        
        results = service.users().messages().list(
            userId="me",
            maxResults=max_results,
            q=query
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

        print(f"DEBUG: Fetched {len(emails)} total emails")
        for i, email in enumerate(emails):
            print(f"DEBUG: Email {i+1} - From: {email['from']}, Subject: {email['subject']}")

        if use_ai_filter and len(emails) > 0:
            print("DEBUG: Using OpenAI filtering")
            filtered_emails = chatgpt_filter(emails)
            filtered_out = len(emails) - len(filtered_emails)
        else:
            print("DEBUG: Skipping OpenAI filtering")
            filtered_emails = emails
            filtered_out = 0
        
        print(f"DEBUG: After filtering: {len(filtered_emails)} relevant, {filtered_out} filtered out")

        return filtered_emails, filtered_out

    except HttpError as error:
        raise Exception(f"Gmail API error: {error}")
