import requests
from bs4 import BeautifulSoup
import time
import random

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
}

RATING_MAP = {
    "1": 0.5, "2": 1.0, "3": 1.5, "4": 2.0, "5": 2.5,
    "6": 3.0, "7": 3.5, "8": 4.0, "9": 4.5, "10": 5.0,
}

def get_letterboxd_data(username: str) -> dict:
    all_reviews = []
    page_num = 1

    while True:
        url = f"https://letterboxd.com/{username}/reviews/films/page/{page_num}/"
        res = requests.get(url, headers=HEADERS)

        if res.status_code != 200:
            break

        soup = BeautifulSoup(res.text, "html.parser")

        items = soup.select(".listitem.js-listitem")
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
                print(f"Skipped item: {e}")
                continue

        # Check if there's a next page
        if not soup.select_one(".paginate-nextprev .next"):
            break

        page_num += 1
        time.sleep(random.uniform(1.0, 2.0))

    print(f"Total reviews scraped: {len(all_reviews)}")
    return {"platform": "letterboxd", "username": username, "reviews": all_reviews}