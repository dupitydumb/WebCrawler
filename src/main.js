// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from "crawlee";

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
  // Use the requestHandler to process each of the crawled pages.
  async requestHandler({ request, page, log, pushData }) {
    var movieDetail = {
      title: "",
      year: "",
      director: "",
      imglink: [],
    };

    movieDetail.title = await page.locator("h1.entry-title").textContent();
    //Get year
    movieDetail.year = await page
      .locator("div.entry-content")
      .locator("p")
      .nth(4)
      .locator("a")
      .textContent();
    //Get director
    movieDetail.director = await page
      .locator("div.entry-content")
      .locator("p")
      .nth(0)
      .locator("a")
      .textContent();

    log.info(`Movie: ${movieDetail.title}`);

    const imgContainer = await page.locator("div.bwg-item");
    //Get img link from imgContainer
    const imgLink = await imgContainer.locator("a.bwg-a ").elementHandles();
    for (const link of imgLink) {
      const imgSrc = await link.getAttribute("href");
      movieDetail.imglink.push(imgSrc);
    }

    //save to json
    pushData(movieDetail);
  },
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 20,
  // Uncomment this option to see the browser window.
  // headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(["https://film-grab.com/2024/01/01/saltburn/"]);
