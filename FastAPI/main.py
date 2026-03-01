from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncpg
from dotenv import load_dotenv
from pydantic import BaseModel
import requests
from functools import wraps

# Custom modules
from scrapers import get_backloggd_data, get_final_analysis, get_letterboxd_data, get_scorasong_data, validate_scorasong_username



app = FastAPI()

# Enable CORS for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {"message": "FastAPI is running!"}

@app.get("/user/data")
async def get_user_data(letterboxd_username: str, scorasong_username: str, backloggd_username: str):
    if not scorasong_username:
        raise HTTPException(status_code=403, detail="scorasong_missing")

    if not await validate_scorasong_username(scorasong_username):
        raise HTTPException(status_code=403, detail="scorasong_invalid")
    
    letterboxd_data = get_letterboxd_data(letterboxd_username)
    scorasong_data = await get_scorasong_data(scorasong_username)
    backloggd_data = get_backloggd_data(backloggd_username)

    total_count = (
        len(letterboxd_data.get("reviews", [])) +
        len(scorasong_data.get("data", {}).get("songs", [])) +
        len(scorasong_data.get("data", {}).get("albums", [])) +
        len(backloggd_data.get("reviews", []))
    )

    analysis = get_final_analysis(letterboxd_data, scorasong_data, backloggd_data)

    return {
        "letterboxd": letterboxd_data,
        "scorasong": scorasong_data,
        "backloggd": backloggd_data,
        "analysis": analysis,
        "total_count": total_count
    }





