URL = "https://www.laforet.com/ville/location-appartement-paris-75000#presentation"

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://news.ycombinator.com"
USERNAME = ""
PASSWORD = ""

s = requests.Session()

r = requests.get(URL)
# print(r.text)

soup = BeautifulSoup(r.text, "html.parser")

links = soup.findAll("div", class_="apartment-card h-100")

formatted_links = []

for link in links:
    print(link)
    data = {
        "href": link.find("a")["href"],
        "price": link.find("span", class_="apartment__price"),
        # "id": link["id"],
        # "title": link.find_all("td")[2].a.text,
        # "url": link.find_all("td")[2].a["href"],
        # "rank": int(link.find_all("td")[0].span.text.replace(".", "")),
    }
    formatted_links.append(data)
    break

print(formatted_links)
