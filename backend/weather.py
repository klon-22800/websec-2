from fastapi import APIRouter
import requests

router = APIRouter()


@router.get("/weather_hourly")
def get_weather_hourly(lat: float, lon: float):
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&hourly=temperature_2m,precipitation,windspeed_10m,weathercode"
        "&timezone=auto"
    )

    res = requests.get(url)
    data = res.json()
    hourly = data.get("hourly", {})

    return {
        "time": hourly.get("time", []),
        "temperature": hourly.get("temperature_2m", []),
        "precipitation": hourly.get("precipitation", []),
        "wind": hourly.get("windspeed_10m", []),
        "weathercode": hourly.get("weathercode", [])
    }