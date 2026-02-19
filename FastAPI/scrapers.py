import os
import requests
from bs4 import BeautifulSoup
import time
from dotenv import load_dotenv
load_dotenv()

SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")

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
    return {"platform": "scorasong", "username": username, "data": "Scorasong data here"}

def get_backloggd_data(username: str) -> dict:
    return {"platform": "backloggd", "username": username, "data": "Backloggd data here"}

def get_goodreads_data(username: str) -> dict:
    return {"platform": "goodreads", "username": username, "data": "Goodreads data here"}