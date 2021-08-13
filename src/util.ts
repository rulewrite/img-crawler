import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

export const getArguments = () => {
  return process.argv.slice(2);
};

export const getHtml = async (url: string) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    return await page.content();
  } catch (error) {
    return '';
  }
};

export const getElements = (html: string, selector: string) => {
  const $ = cheerio.load(html);
  return $(selector)
    .toArray()
    .map((element) => $(element));
};
