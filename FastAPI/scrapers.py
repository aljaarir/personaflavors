import os
import requests
from bs4 import BeautifulSoup
import time
from dotenv import load_dotenv
load_dotenv()

SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")

def get_letterboxd_data(username: str) -> dict:
    RATING_MAP = {
        "1": 0.5, "2": 1.0, "3": 1.5, "4": 2.0, "5": 2.5,
        "6": 3.0, "7": 3.5, "8": 4.0, "9": 4.5, "10": 5.0,
    }

    all_reviews = []
    page_num = 1

    while True:
        url = f"https://letterboxd.com/{username}/reviews/films/page/{page_num}/"
        print(f"Scraping page {page_num}: {url}")

        res = requests.get(
            f"http://api.scraperapi.com?api_key={SCRAPER_API_KEY}&url={url}",
            timeout=60
        )
        soup = BeautifulSoup(res.text, "html.parser")
        items = soup.select(".listitem.js-listitem")
        print(f"  Found {len(items)} items")

        if not items:
            break

        for item in items:
            try:
                title = item.select_one(".react-component.figure")["data-item-name"]

                rating_el = item.select_one(".rating[class]")
                stars = None
                if rating_el:
                    rated = next((c for c in rating_el["class"] if c.startswith("rated-")), None)
                    if rated:
                        stars = RATING_MAP.get(rated.replace("rated-", ""))

                review_el = item.select_one(".js-review-body p")
                review_text = review_el.text.strip() if review_el else ""

                date_el = item.select_one("time.timestamp")
                watch_date = date_el["datetime"] if date_el else ""

                all_reviews.append({
                    "title": title,
                    "stars": stars,
                    "review_text": review_text,
                    "watch_date": watch_date,
                })
            except Exception as e:
                print(f"  Skipped: {e}")
                continue

        if not soup.select_one(".paginate-nextprev .next"):
            break

        page_num += 1
        time.sleep(2)

    print(f"Total reviews scraped: {len(all_reviews)}")
    return {"platform": "letterboxd", "username": username, "reviews": all_reviews}


def get_scorasong_data(username: str) -> dict:
    return {"platform": "scorasong", "username": username, "data": "Scorasong data here"}

def get_backloggd_data(username: str) -> dict:
    return {"platform": "backloggd", "username": username, "data": "Backloggd data here"}

def get_goodreads_data(username: str) -> dict:
    return {"platform": "goodreads", "username": username, "data": "Goodreads data here"}