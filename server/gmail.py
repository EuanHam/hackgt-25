from datetime import datetime
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
import base64

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

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

        return emails

    except HttpError as error:
        raise Exception(f"Gmail API error: {error}")
