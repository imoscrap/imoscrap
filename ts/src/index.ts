import puppeteer from "puppeteer";

const URL =
    "https://www.laforet.com/ville/location-appartement-paris-75000#presentation";
const SELECTOR =
    "#main > div.main__content.h-full.py-5 > section > div > div > div > div.row";

function split_price(price: string) {
    const tmp = price.replaceAll(" ", "");
    const match = tmp.match(/([\d.,]+)\s*([€$£])\/([^\s]+)/); // Regular expression to match the format
    const amount = match[1].replace(",", ""); // Remove any thousand separators
    const currency = match[2];
    const time = match[3];

    return { amount, currency, time };
}

async function run() {
    let browser: puppeteer.Browser;

    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        await page.goto(URL);
        // Extract data
        const apartmentData = await page.evaluate(() => {
            // Select all apartment card elements
            const apartmentCards = Array.from(
                document.querySelectorAll(".apartment-card")
            );

            // Extract data from each card
            const data = apartmentCards.map((card) => {
                // Extract page link
                const pageLink = card
                    .querySelector(".apartment-card__link")
                    .getAttribute("href");

                // Extract price
                const tmp = card
                    .querySelector(".apartment__price")
                    .textContent.trim()
                    .replaceAll(" ", "");
                const match = tmp.match(/([\d.,]+)\s*([€$£])\/([^\s]+)/); // Regular expression to match the format
                const amount = tmp.match(/\d+/g).join("");
                const currency = match[2];
                const time = match[3];

                const unique_id = pageLink.split("-").pop();
                return {
                    pageLink,
                    price: { src: tmp, amount, currency, time },
                    unique_id,
                };
            });

            return data;
        });

        console.log(apartmentData);
        return;
    } catch (e) {
        console.error("scrape failed", e);
    } finally {
        await browser?.close();
    }
}

await run();
