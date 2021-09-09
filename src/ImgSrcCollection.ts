import isRelativeUrl = require('is-relative-url');
import * as cheerio from 'cheerio';

export default class ImgSrcCollection {
  private static convertAbsoluteUrls(src: string, url: URL) {
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
  }

  srcs: string[];

  constructor(url: URL, html: string, selector: string) {
    const $ = cheerio.load(html);

    const elements = $(selector)
      .toArray()
      .map((element) => $(element));

    if (!elements.length) {
      throw new Error(
        '엘리먼트를 찾지 못했습니다. selector를 다시 확인해주세요.'
      );
    }

    this.srcs = elements
      .map((element) => element.attr('src'))
      .map((src) => ImgSrcCollection.convertAbsoluteUrls(src, url));
  }
}
