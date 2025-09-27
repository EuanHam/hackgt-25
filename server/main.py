from fastapi import FastAPI, HTTPException
import requests
from dotenv import load_dotenv
import os


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, World!"}

load_dotenv()

ACCESS_TOKEN = os.getenv("GROUPME_ACCESS_TOKEN")
if not ACCESS_TOKEN:
    raise RuntimeError("GROUPME_ACCESS_TOKEN not set in .env file")
BASE_URL = "https://api.groupme.com/v3"

# In-memory tracker for last seen messages per group
last_seen = {}

@app.get("/groups")
def get_groups():
    url = f"{BASE_URL}/groups"
    params = {"token": ACCESS_TOKEN, "per_page": 50}
    resp = requests.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    groups = resp.json()["response"]
    return [{"id": g["id"], "name": g["name"]} for g in groups]


@app.get("/groups/{group_id}/unread")
def get_unread_messages(group_id: str, limit: int = 20):
    url = f"{BASE_URL}/groups/{group_id}/messages"
    params = {"token": ACCESS_TOKEN, "limit": limit}

    # If we have a last_seen_id, fetch only newer messages
    if group_id in last_seen:
        params["since_id"] = last_seen[group_id]

    resp = requests.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    messages = resp.json()["response"]["messages"]

    if messages:
        # Update last_seen to the newest message
        last_seen[group_id] = messages[0]["id"]

    return {
        "unread_count": len(messages),
        "messages": [
            {
                "id": m["id"],
                "sender": m["name"],
                "text": m["text"]
            } for m in messages
        ]
    }