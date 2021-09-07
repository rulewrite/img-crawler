import * as puppeteer from 'puppeteer';

export default class Traveler {
  private page: puppeteer.Page;

  constructor() {}

  async launch() {
    const browser = await puppeteer.launch();
    this.page = await browser.newPage();
  }

  async goto(url: string) {
    try {
      const { page } = this;
      const response = await page.goto(url);
      const isOk = response.ok();

      if (!isOk) {
        throw new Error();
      }

      return {
        title: await page.title(),
        html: await page.content(),
      };
    } catch {
      return { title: '', html: '' };
    }
  }
}
