import os
import requests
from bs4 import BeautifulSoup
import time
from supabase import create_client
from dotenv import load_dotenv
import xml.etree.ElementTree as ET
load_dotenv()

SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)


def get_letterboxd_data(username: str) -> dict:
    all_reviews = []
    page_num = 1

    RATING_MAP = {
        "1": 0.5, "2": 1.0, "3": 1.5, "4": 2.0, "5": 2.5,
        "6": 3.0, "7": 3.5, "8": 4.0, "9": 4.5, "10": 5.0,
    }

    while True:
        # Fetch the page through ScraperAPI
        url = f"https://letterboxd.com/{username}/reviews/films/page/{page_num}/"
        res = requests.get(f"http://api.scraperapi.com?api_key={SCRAPER_API_KEY}&url={url}", timeout=60)
        soup = BeautifulSoup(res.text, "html.parser")

        # Get all review cards on this page
        items = soup.select(".listitem.js-listitem")
        if not items:
            break

        for item in items:
            # Get title
            title = item.select_one(".react-component.figure")["data-item-name"]

            # Get star rating
            stars = None
            rating_el = item.select_one(".rating[class]")
            if rating_el:
                rated = next((c for c in rating_el["class"] if c.startswith("rated-")), None)
                if rated:
                    stars = RATING_MAP.get(rated.replace("rated-", ""))

            # Get review text and date
            review_el = item.select_one(".js-review-body p")
            date_el = item.select_one("time.timestamp")

            all_reviews.append({
                "title": title,
                "stars": stars,
                "review_text": review_el.text.strip() if review_el else "",
                "watch_date": date_el["datetime"] if date_el else "",
            })

        # Stop if no next page
        if not soup.select_one(".paginate-nextprev .next"):
            break

        page_num += 1
        time.sleep(2)

    return {"platform": "letterboxd", "username": username, "reviews": all_reviews}


def get_scorasong_data(username: str) -> dict:
    # Look up the user's UUID from their username in scora_users
    user = supabase.table("scora_users").select("id").eq("username", username).single().execute()

    if not user.data:
        return {"platform": "scorasong", "username": username, "data": {"albums": [], "songs": []}}

    user_id = user.data["id"]

    albums = supabase.table("album_ratings").select("*").eq("user_id", user_id).execute()
    songs = supabase.table("song_ratings").select("*").eq("user_id", user_id).execute()

    return {
        "platform": "scorasong",
        "username": username,
        "data": {
            "albums": albums.data,
            "songs": songs.data,
        }
    }

def get_backloggd_data(username: str) -> dict:
    all_reviews = []
    page_num = 1

    while True:
        url = f"https://backloggd.com/u/{username}/reviews?page={page_num}"
        res = requests.get(f"http://api.scraperapi.com?api_key={SCRAPER_API_KEY}&url={url}", timeout=60)
        soup = BeautifulSoup(res.text, "html.parser")

        # Each review is a .review-card, paired with a .game-name above it
        cards = soup.select(".review-card")
        if not cards:
            break

        for card in cards:
            # Title is in the .game-name div just before this card
            game_name_el = card.find_previous(".game-name")
            title = game_name_el.select_one("h3").text.strip() if game_name_el else ""

            # Rating: stars-top width is a percentage out of 100
            # 100% = 5 stars, so we divide by 20 to get star value
            # e.g. width:70% -> 70/20 = 3.5 stars
            stars = None
            stars_el = card.select_one(".stars-top")
            if stars_el:
                width = stars_el.get("style", "")  # e.g. "width:70%"
                percent = width.replace("width:", "").replace("%", "").strip()
                if percent:
                    stars = float(percent) / 20

            # Review text and date
            review_el = card.select_one(".card-text")
            date_el = card.select_one("time.local-time-tooltip")

            all_reviews.append({
                "title": title,
                "stars": stars,
                "review_text": review_el.text.strip() if review_el else "",
                "play_date": date_el["datetime"] if date_el else "",
            })

        # Stop if there's no next page link
        if not soup.select_one("nav.pagy a[aria-label='Next']"):
            break

        page_num += 1
        time.sleep(2)

    return {"platform": "backloggd", "username": username, "reviews": all_reviews}


def get_final_analysis(letterboxd_data: dict, scorasong_data: dict, backloggd_data: dict, goodreads_data: dict) -> dict:
    # use Claude Private Mode via Langchain to analyze the data and return insights
    pass
    