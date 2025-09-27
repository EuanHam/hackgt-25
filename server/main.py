from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from gmail import get_gmail_emails
import groupme

app = FastAPI()

origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173"   # optional, just in case
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      # allow all HTTP methods
    allow_headers=["*"],      # allow all headers including Authorization
)

@app.get("/")
def root():
    return {"message": "Hello, World!"}

@app.get("/emails")
def get_emails(
    authorization: str = Header(...),
    start_date: str = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(None, description="End date (YYYY-MM-DD)"),
    max_results: int = Query(10, description="Max number of emails to fetch")
):
    """
    Expects: Authorization: Bearer <access_token>
    Optional query params: start_date, end_date, max_results
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    token = authorization.split(" ")[1]

    try:
        emails = get_gmail_emails(token, max_results=max_results, start_date=start_date, end_date=end_date)
        return {"emails": emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/groups")
def groups():
    return groupme.get_groups()

@app.get("/groups/{group_id}/messages")
def messages(group_id: str, limit: int = 10):
    return groupme.get_all_groups_messages(group_id, limit)

if __name__ == "__main__":
    # Example: fetch groups  when you run "python main.py"
    groups = groupme.get_groups()
    unread_messages = groupme.get_all_groups_messages(limit=5)
