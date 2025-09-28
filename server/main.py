from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from gmail import get_gmail_emails
import groupme
from dotenv import load_dotenv

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
        emails, filtered_out = get_gmail_emails(token, max_results=max_results, start_date=start_date, end_date=end_date)

        return {
            "emails": emails,
            "filtered_out": filtered_out
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# GroupMe endpoints
@app.get("/groups")
def get_all_groups():
    """Get all GroupMe groups"""
    try:
        return groupme.get_groups()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/groups/messages")
def get_messages_for_all_groups(limit: int):
    """Get messages for all groups"""
    try:
        return groupme.get_all_groups_messages(limit=5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/groups/{group_id}/messages")
def get_messages_for_specific_group(group_id: str, limit: int):
    """Get messages for a specific group"""
    try:
        return groupme.get_messages_for_group(group_id, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/groups/{group_id}/info")
def get_group_info(group_id: str):
    """Get information about a specific group"""
    try:
        return groupme.get_group_info(group_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# # for testing purposes
# if __name__ == "__main__":
#     # Example: fetch groups  when you run "python main.py"
#     groups = groupme.get_groups()
#     print(groups)
#     specific_messages = groupme.get_messages_for_group(groups[0]["id"], limit=5)
#     print(specific_messages)
#     group_name = groupme.get_group_name(groups[0]["id"])
#     print(f"Group name: {group_name}")