from IPython.core.interactiveshell import InteractiveShell
InteractiveShell.ast_node_interactivity = "all"

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import undetected_chromedriver as uc
import time
import pandas as pd
import bs4
from datetime import datetime
import os

# Set up Chrome options
chrome_options = uc.ChromeOptions()
prefs = {"profile.default_content_setting_values.geolocation": 1}  # Allow location
chrome_options.add_experimental_option("prefs", prefs)
driver = uc.Chrome(options=chrome_options)

# Open the website
driver.get("https://app.prizepicks.com/")
time.sleep(5)

# Handle CAPTCHA manually
try:
    captcha_frame = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, "//iframe[contains(@src, 'recaptcha')]"))
    )
    print("CAPTCHA detected. Please solve the CAPTCHA manually.")
    WebDriverWait(driver, 300).until(
        EC.invisibility_of_element(captcha_frame)
    )
    print("CAPTCHA solved.")
except Exception:
    print("No CAPTCHA found or already solved.")

# Close the popup if it appears
try:
    close_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "close"))
    )
    close_button.click()
    print("Popup closed successfully.")
except Exception:
    print("No popup found or already closed.")

# Click on NBA category
try:
    nba_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'league-old')]//img[@alt='NBA']"))
    )
    # Use JavaScript to click the NBA button if direct click is intercepted
    driver.execute_script("arguments[0].click();", nba_button)
    print("NBA button clicked successfully.")
except Exception as e:
    print("Could not find or click the NBA button:", e)

time.sleep(5)

# List of stat categories to scrape
stat_categories = ["Points", "Pts+Rebs+Asts", "Rebounds", "Assists", "3-PT Made", "Free Throws Made", "FG Attempted", "Blocked Shots", "Steals", "Blks+Stls", "Turnovers"]

ppPlayers = []

for category in stat_categories:
    # Click on the stat category
    try:
        stat_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, f"//button[contains(@class, 'stat') and contains(text(), '{category}')]"))
        )
        # Use JavaScript to click the stat category button if direct click is intercepted
        driver.execute_script("arguments[0].click();", stat_button)
        print(f"Clicked '{category}' category.")
    except Exception as e:
        print(f"Could not find or click '{category}' category:", e)
        continue

    time.sleep(5)

    # Extract player projections for the current category
    try:
        projectionsPP = WebDriverWait(driver, 5).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "li.border-soFresh-130"))
        )

        for projections in projectionsPP:
            # Get the page source and parse it
            html = projections.get_attribute('outerHTML')
            soup = bs4.BeautifulSoup(html, 'html.parser')

            # Find player name
            name_element = soup.find(id="test-player-name")
            if name_element:
                names = name_element.text
            else:
                names = 'N/A'

            # Find player value
            value_element = soup.find(class_="heading-md")
            if value_element:
                value = value_element.text
            else:
                value = 'N/A'

            # Find projection type
            proj_type_element = soup.find("div", {"class": "text-soClean-140 max-w-[100px] self-center text-left text-xs leading-[14px]"})
            if proj_type_element:
                proj_type = proj_type_element.text.strip()
            else:
                proj_type = 'N/A'

            # Try getting demon/goblin projection
            try:
                payout = soup.find('div', {'class': 'absolute -right-4 left-1/2 top-12'}).find('img').get('alt')
            except AttributeError:
                payout = 'Standard'

            # Extract the matchup information
            matchup_element = soup.find("time", {"class": "text-soClean-140 body-sm"})
            if matchup_element:
                matchup = matchup_element.text
            else:
                matchup = 'N/A'

            players = {
                'Category': category,
                'Name': names,
                'Value': value,
                'Matchup': matchup,
                'Payout': payout
            }
            ppPlayers.append(players)
    except Exception as e:
        print(f"Could not extract player projections for '{category}' category:", e)

# Convert results to a DataFrame
dfProps = pd.DataFrame(ppPlayers)

# Add a timestamp column
dfProps['Timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Get the current working directory and create the CSV file path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
csv_file_path = os.path.join(project_root, 'prizepicks_propsv2.csv')

# Save DataFrame to CSV file, overwriting the existing file
dfProps.to_csv(csv_file_path, index=False)

print(f"All categories have been scraped and saved to '{csv_file_path}'.")

# Close the browser
driver.quit()