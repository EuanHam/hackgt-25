from utils import get_outlook_emails

from fastapi import FastAPI
app = FastAPI()

items = []

@app.get("/")
def root():
    return {"message": "Hello, World!"}

# curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:8000/items?item=apple'
@app.post("/items")
def create_item(item: str):
    items.append(item)
    return items

# curl -X GET -H "Content-Type: application/json" 'http://127.0.0.1:8000/items?item=apple'
@app.get("/items/{item_id}")
def get_item(item_id: int):
    if 0 <= item_id < len(items):
        return {"item": items[item_id]}
    return {"error": "Item not found"}

@app.get("/emails")
def get_item():
    emails = get_outlook_emails()
    return {"emails": emails}