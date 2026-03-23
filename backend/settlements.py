from fastapi import APIRouter
import json

router = APIRouter()

with open("settlements.json", "r", encoding="utf-8") as f:
    settlements = json.load(f)

@router.get("/settlements")
def get_settlements():
    return settlements