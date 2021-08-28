import * as cheerio from 'cheerio';
import isRelativeUrl = require('is-relative-url');
import * as puppeteer from 'puppeteer';

export const getArguments = () => {
  return process.argv.slice(2);
};

export const getContents = async (url: string) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    return {
      title: await page.title(),
      html: await page.content(),
    };
  } catch (error) {
    return { title: '', html: '' };
  }
};

export const getElements = (html: string, selector: string) => {
  const $ = cheerio.load(html);
  return $(selector)
    .toArray()
    .map((element) => $(element));
};

export const convertAbsoluteUrls = (src: string, url: URL) => {
  const { origin, pathname } = url;
  if (!isRelativeUrl(src)) {
    return src;
  }

  if (src[0] === '/') {
    return origin + src;
  }

  const path = pathname.split('/').slice(0, -1).join('/');
  if (src.slice(0, 2) === './') {
    return `${origin}${path}${src.slice(1)}`;
  }

  return `${origin}${path}/${src}`;
};

export const getFilename = (url: string) => {
  return String(url.split('/').slice(-1));
};

export const getTime = (coupler = '-') => {
  const date = new Date();
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ].join(coupler);
};

export class ZeroPad {
  private size = 0;
  number = 0;

  constructor(formatted: string, keyword = '$') {
    this.size = formatted.length;
    this.number = Number(formatted.replaceAll(keyword, '0'));
  }

  get(num: number): string {
    let numString = num.toString();
    while (numString.length < this.size) numString = '0' + numString;
    return numString;
  }
}
