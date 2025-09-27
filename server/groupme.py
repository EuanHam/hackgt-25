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

# retrieve messages for all groups
def get_all_groups_messages(limit: int) -> list[dict[str, any]]:
    """
    Get last 10 messages for each group (sequential approach)
    """
    groups = get_groups()
    all_messages = []
    
    for group in groups:
        try:
            messages = get_messages_for_group(group["id"], limit)
            all_messages.append(messages)
        except HTTPException as e:
            # Skip groups that fail, but log the error
            print(f"Error fetching messages for group {group['name']}: {e}")
            continue
    
    return all_messages

# Helper function to get group name (optional)
def get_group_name(group_id: str) -> str:
    """Get the name of a group by ID"""
    groups = get_groups()
    for group in groups:
        if group["id"] == group_id:
            return group["name"]
    return "Unknown Group"


# Get messages for a single group
def get_messages_for_group(group_id: str, limit: int = 10) -> dict[str, any]:
    """
    Get messages for a single group
    """
    url = f"{BASE_URL}/groups/{group_id}/messages"
    params = {"token": ACCESS_TOKEN, "limit": limit}
    
    resp = requests.get(url, params=params)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    
    messages_data = resp.json()["response"]["messages"]
    
    return {
        "group_id": group_id,
        "group_name": get_group_name(group_id),  # Optional: get group name
        "message_count": len(messages_data),
        "messages": [
            {
                "id": m["id"],
                "sender": m["name"],
                "text": m.get("text", ""),
                "timestamp": m.get("created_at", 0),
                "attachments": m.get("attachments", [])
            } for m in messages_data
        ]
    }

