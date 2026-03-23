from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/weather")
def get_weather(lat: float, lon: float):
    days = 5

    dates = []
    temp = []
    precipitation = []
    wind = []

    for i in range(days):
        dates.append((datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"))
        temp.append(random.randint(-5, 15))
        precipitation.append(random.randint(0, 10))
        wind.append(random.randint(1, 10))

    return {
        "dates": dates,
        "temperature": temp,
        "precipitation": precipitation,
        "wind": wind
    }