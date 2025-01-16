import argparse
import json
import os
from time import sleep
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import BaseWebDriver


def load_page(driver: BaseWebDriver, timeout_s: int) -> None:
    driver.get("https://web.whatsapp.com")
    WebDriverWait(driver, timeout_s).until(
        EC.presence_of_element_located((By.XPATH, "//*[@title='Chats']"))
    )


def send_message(driver: BaseWebDriver, to: str, message: str) -> None:
    load_page(driver, 30)

    driver.find_element(By.XPATH, f"//*[@title='{to}']").click()

    elements = driver.find_elements(By.CLASS_NAME, "lexical-rich-text-input")
    elements[1].click()
    sleep(1)
    message_field = driver.switch_to.active_element
    message_field.send_keys(message)
    sleep(1)
    message_field.send_keys(Keys.ENTER)

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, f"//span[.='{message}']"))
    )
    # sleep(5)


def create_options(
    user_data_dir: str, is_headless: bool, binary_location: str
) -> webdriver.ChromeOptions:
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280x1696")
    options.add_argument("--single-process")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-dev-tools")
    options.add_argument("--no-zygote")
    options.add_argument(
        "user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36"
    )
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument(f"--user-data-dir={user_data_dir}")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument("profile-directory=Default")

    if is_headless:
        options.add_argument("--headless=new")

    options.binary_location = binary_location

    return options


def handler(event=None, context=None):
    data = json.loads(event["body"])
    if "to" not in data or "message" not in data:
        return {
            "statusCode": 400,
            "body": json.dumps(
                {"message": "Missing 'to' or 'message' in request body"}
            ),
        }

    options = create_options("/opt/data/gh-data", True, "/opt/chrome/chrome")
    service = webdriver.ChromeService("/opt/chromedriver")
    driver = webdriver.Chrome(service=service, options=options)
    send_message(driver, data["to"], data["message"])

    return {"statusCode": 200}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--user-data-dir",
        type=str,
        default=os.path.join(os.path.dirname(__file__), "gh-data"),
    )
    parser.add_argument("--only-login", type=bool, default=True)
    parser.add_argument(
        "--chrome-bin-location", type=str, default="/usr/bin/google-chrome"
    )
    parser.add_argument("--to", type=str, default="Marcin Kolny")
    parser.add_argument("--message", type=str, default="Hello from AWS Local Lambda!")

    args = parser.parse_args()

    options = create_options(args.user_data_dir, False, args.chrome_bin_location)
    driver = webdriver.Chrome(options=options)

    if args.only_login:
        load_page(driver, 120)
    else:
        send_message(driver, args.to, args.message)
