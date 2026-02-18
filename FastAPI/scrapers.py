import csv 
import pickle
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import random
import os


def get_letterboxd_data(username: str) -> dict:
    opts = Options()
    opts.add_argument('--headless')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--disable-blink-features=AutomationControlled')
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    opts.add_experimental_option('useAutomationExtension', False)
    opts.add_argument(f'--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')

    driver = webdriver.Chrome(options=opts)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    wait = WebDriverWait(driver, 10)

    # ── Rating class → star value map ─────────────────────
    RATING_MAP = {
        "1":  0.5,
        "2":  1.0,
        "3":  1.5,
        "4":  2.0, 
        "5":  2.5,
        "6":  3.0,
        "7":  3.5,
        "8":  4.0,
        "9":  4.5,
        "10": 5.0,
    }

    all_reviews = []

    # ── Step 1: find total pages ───────────────────────────
    base_url = f"https://letterboxd.com/{username}/reviews/films/"
    driver.get(base_url)
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "viewing-list")))

    try:
        page_items = driver.find_elements(By.CSS_SELECTOR, ".paginate-pages .paginate-page")
        # last page item has the highest number
        last_page = int(page_items[-1].text.strip()) if page_items else 1
    except:
        last_page = 1

    print(f"Found {last_page} page(s) for {username}")

    # ── Step 2: loop every page ────────────────────────────
    for page_num in range(1, last_page + 1):
        url = f"https://letterboxd.com/{username}/reviews/films/page/{page_num}/"
        print(f"Scraping page {page_num}/{last_page} — {url}")
        driver.get(url)

        try:
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "viewing-list")))
        except:
            print(f"  Timed out on page {page_num}, skipping")
            continue

        items = driver.find_elements(By.CSS_SELECTOR, ".listitem.js-listitem")
        print(f"  Found {len(items)} reviews")

        for item in items:
            try:
                # Title — from data-item-name on the figure div
                figure = item.find_element(By.CSS_SELECTOR, ".react-component.figure")
                title = figure.get_attribute("data-item-name")  # e.g. "Christine (1983)"

                # Rating — find the span with class like "rated-8"
                try:
                    rating_el = item.find_element(By.CSS_SELECTOR, ".rating[class*='rated-']")
                    classes = rating_el.get_attribute("class").split()
                    rated_class = next((c for c in classes if c.startswith("rated-")), None)
                    raw_num = rated_class.replace("rated-", "") if rated_class else None
                    stars = RATING_MAP.get(raw_num, None)
                except:
                    stars = None  # film logged but not rated

                # Review text
                try:
                    review_text = item.find_element(
                        By.CSS_SELECTOR, ".js-review-body p"
                    ).text.strip()
                except:
                    review_text = ""

                # Watch date
                try:
                    watch_date = item.find_element(
                        By.CSS_SELECTOR, "time.timestamp"
                    ).get_attribute("datetime")
                except:
                    watch_date = ""

                all_reviews.append({
                    "title":       title,
                    "stars":       stars,
                    "review_text": review_text,
                    "watch_date":  watch_date,
                })

            except Exception as e:
                print(f"  Skipped item: {e}")
                continue

        # Polite delay between pages — avoid rate limiting
        if page_num < last_page:
            time.sleep(random.uniform(1.5, 3.0))

    driver.quit()
    print(f"Total reviews scraped: {len(all_reviews)}")
    return {"platform": "letterboxd", "username": username, "reviews": all_reviews}


def get_scorasong_data(username: str) -> dict:
    # Placeholder for actual scraping logic
    return {"platform": "scorasong", "username": username, "data": "Scorasong data here"}

def get_backloggd_data(username: str) -> dict:
    # Placeholder for actual scraping logic
    return {"platform": "backloggd", "username": username, "data": "Backloggd data here"}

def get_goodreads_data(username: str) -> dict:
    # Placeholder for actual scraping logic
    return {"platform": "goodreads", "username": username, "data": "Goodreads data here"}