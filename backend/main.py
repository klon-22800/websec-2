from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from settlements import router as settlements_router
from weather import router as weather_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(settlements_router)
app.include_router(weather_router)

@app.get("/")
def root():
    return {"status": "ok"}