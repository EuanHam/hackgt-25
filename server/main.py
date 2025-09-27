from fastapi import FastAPI, Header, HTTPException, Query
from gmail import get_gmail_emails

app = FastAPI()

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