from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time
import random
import os

IS_RAILWAY = os.getenv("RAILWAY_ENVIRONMENT") is not None

def make_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1280,800')
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')

    if IS_RAILWAY:
        options.binary_location = "/root/.nix-profile/bin/chromium"
        return webdriver.Chrome(service=Service("/root/.nix-profile/bin/chromedriver"), options=options)
    else:
        return webdriver.Chrome(options=options)


def get_letterboxd_data(username: str) -> dict:
    RATING_MAP = {
        "1": 0.5, "2": 1.0, "3": 1.5, "4": 2.0, "5": 2.5,
        "6": 3.0, "7": 3.5, "8": 4.0, "9": 4.5, "10": 5.0,
    }

    driver = make_driver()
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    wait = WebDriverWait(driver, 20)
    all_reviews = []

    try:
        base_url = f"https://letterboxd.com/{username}/reviews/films/"
        driver.get(base_url)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "viewing-list")))

        try:
            page_items = driver.find_elements(By.CSS_SELECTOR, ".paginate-pages .paginate-page")
            last_page = int(page_items[-1].text.strip()) if page_items else 1
        except:
            last_page = 1

        print(f"Found {last_page} page(s) for {username}")

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
                    figure = item.find_element(By.CSS_SELECTOR, ".react-component.figure")
                    title = figure.get_attribute("data-item-name")

                    try:
                        rating_el = item.find_element(By.CSS_SELECTOR, ".rating[class*='rated-']")
                        classes = rating_el.get_attribute("class").split()
                        rated_class = next((c for c in classes if c.startswith("rated-")), None)
                        raw_num = rated_class.replace("rated-", "") if rated_class else None
                        stars = RATING_MAP.get(raw_num)
                    except:
                        stars = None

                    try:
                        review_text = item.find_element(By.CSS_SELECTOR, ".js-review-body p").text.strip()
                    except:
                        review_text = ""

                    try:
                        watch_date = item.find_element(By.CSS_SELECTOR, "time.timestamp").get_attribute("datetime")
                    except:
                        watch_date = ""

                    all_reviews.append({
                        "title": title,
                        "stars": stars,
                        "review_text": review_text,
                        "watch_date": watch_date,
                    })

                except Exception as e:
                    print(f"  Skipped item: {e}")
                    continue

            if page_num < last_page:
                time.sleep(random.uniform(1.5, 3.0))

    finally:
        driver.quit()

    print(f"Total reviews scraped: {len(all_reviews)}")
    return {"platform": "letterboxd", "username": username, "reviews": all_reviews}


def get_scorasong_data(username: str) -> dict:
    return {"platform": "scorasong", "username": username, "data": "Scorasong data here"}

def get_backloggd_data(username: str) -> dict:
    return {"platform": "backloggd", "username": username, "data": "Backloggd data here"}

def get_goodreads_data(username: str) -> dict:
    return {"platform": "goodreads", "username": username, "data": "Goodreads data here"}