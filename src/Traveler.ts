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
      this.throwError();
    }

    const html = await page.content();
    if (!html.length) {
      this.throwError();
    }

    return {
      title: await page.title(),
      html,
    };
  }

  async close() {
    await this.browser?.close();
  }

  private throwError() {
    throw new Error('응답받은 컨텐츠가 없습니다. url을 다시 확인해주세요.');
  }
}
