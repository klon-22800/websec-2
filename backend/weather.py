from fastapi import APIRouter
import requests

router = APIRouter()

@router.get("/weather")
def get_weather(lat: float, lon: float):
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max"
        "&timezone=auto"
    )

    res = requests.get(url)
    data = res.json()

    daily = data.get("daily", {})

    return {
        "dates": daily.get("time", []),
        "temperature": daily.get("temperature_2m_max", []),
        "precipitation": daily.get("precipitation_sum", []),
        "wind": daily.get("windspeed_10m_max", [])
    }