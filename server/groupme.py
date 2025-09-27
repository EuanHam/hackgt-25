import os
import requests
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

ACCESS_TOKEN = os.getenv("GROUPME_ACCESS_TOKEN")
if not ACCESS_TOKEN:
    raise RuntimeError("GROUPME_ACCESS_TOKEN not set in .env file")

BASE_URL = "https://api.groupme.com/v3"


# return a list of groups with their IDs and names
def get_groups():
    url = f"{BASE_URL}/groups"
    params = {"token": ACCESS_TOKEN, "per_page": 50}
    resp = requests.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    groups = resp.json()["response"]
    return [{"id": g["id"], "name": g["name"], "imageURL": g["image_url"]} for g in groups]


# return unread messages for a group since last seen
def get_unread_messages(group_id: str, limit: int = 10):
    url = f"{BASE_URL}/groups/{group_id}/messages"
    params = {"token": ACCESS_TOKEN, "limit": limit}


    resp = requests.get(url, params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    messages = resp.json()["response"]["messages"]


    return {
        "group_id": group_id,
        "messages": [
            {
                "id": m["id"],
                "sender": m["name"],
                "text": m["text"]
            } for m in messages
        ]
    }