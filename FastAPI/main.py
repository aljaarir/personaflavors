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
from scrapers import get_backloggd_data, get_final_analysis, get_letterboxd_data, get_scorasong_data



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
    # Placeholder for actual data fetching logic

	letterbox_data = get_letterboxd_data(letterboxd_username)
	scorasong_data = await get_scorasong_data(scorasong_username)
	backloggd_data = get_backloggd_data(backloggd_username)

	return {
		"letterboxd": {"username": letterboxd_username, "data": letterbox_data},
		"scorasong": {"username": scorasong_username, "data": scorasong_data},
		"backloggd": {"username": backloggd_username, "data": backloggd_data},
		"analysis": {"data": get_final_analysis(letterbox_data, scorasong_data, backloggd_data, None)}
	}





