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
    const { page } = this;
    const response = await page.goto(url);
    const isOk = response.ok();

    if (!isOk) {
      throw new Error('url 접속에 실패했습니다.');
    }

    const html = await page.content();
    if (!html.length) {
      throw new Error('컨텐츠가 없습니다.');
    }

    return {
      title: await page.title(),
      html,
    };
  }

  async close() {
    await this.browser?.close();
  }
}
