import * as puppeteer from 'puppeteer';

export default class Traveler {
  private browser: puppeteer.Browser;
  private page: puppeteer.Page;

  constructor() {}

  async launch() {
    this.close();

    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
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

  async close() {
    await this.browser?.close();
  }
}
