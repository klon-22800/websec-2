import os 
import json

from fastapi import APIRouter, Query


router = APIRouter()
BASE_DIR = os.path.dirname(__file__)
SETTLEMENTS_FILE = os.path.join(BASE_DIR, "settlements.json")

with open(SETTLEMENTS_FILE, "r", encoding="utf-8") as f:
    settlements = json.load(f)

@router.get("/settlements")
def get_settlements():
    return settlements

@router.get("/search")
def search_city(q: str = Query(..., min_length=1)):
    q_lower = q.lower()
    matches = [s for s in settlements if q_lower in s["name"].lower()]
    return matches[:10]