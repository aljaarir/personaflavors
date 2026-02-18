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
from scrapers import get_letterboxd_data



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
async def get_user_data(letterboxd_username: str, scorasong_username: str, backloggd_username: str, goodreads_username: str):
    # Placeholder for actual data fetching logic

	letterbox_data = get_letterboxd_data(letterboxd_username)
	# scorasong_data = get_scorasong_data(scorasong_username)
	# backloggd_data = get_backloggd_data(backloggd_username)
	# goodreads_data = get_goodreads_data(goodreads_username)

	return {
		"letterboxd": {"username": letterboxd_username, "data": letterbox_data},
		"scorasong": {"username": scorasong_username, "data": "Scorasong data here"},
		"backloggd": {"username": backloggd_username, "data": "Backloggd data here"},
		"goodreads": {"username": goodreads_username, "data": "Goodreads data here"}
	}

app.get("/user/data/analysis")
async def analyze_user_data(letterboxd_data: dict, scorasong_data: dict, backloggd_data: dict, goodreads_data: dict):
	# Placeholder for actual analysis logic

	return {
		"letterboxd_analysis": "Analysis of Letterboxd data here",
		"scorasong_analysis": "Analysis of Scorasong data here",
		"backloggd_analysis": "Analysis of Backloggd data here",
		"goodreads_analysis": "Analysis of Goodreads data here"
	}





