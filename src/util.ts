import * as cheerio from 'cheerio';
import isRelativeUrl = require('is-relative-url');
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

export const convertAbsoluteUrls = (src: string, { origin }: URL) => {
  if (!isRelativeUrl(src)) {
    return src;
  }

  if (src[0] === '/') {
    return origin + src;
  }

  if (src.slice(0, 2) === './') {
    return origin + src.slice(1);
  }

  return `${origin}/${src}`;
};
