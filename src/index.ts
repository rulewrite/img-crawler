import {
  getArguments,
  getElements,
  getContents,
  convertAbsoluteUrls,
  getFilename,
} from './util';
import * as fs from 'node:fs';
import axios from 'axios';

(async () => {
  const [url, selector] = getArguments();
  if (!url) {
    console.error('url이 없습니다.');
    return;
  }

  if (!selector) {
    console.error('selector가 없습니다.');
    return;
  }

  const { title, html } = await getContents(url);
  if (!html.length) {
    console.error('응답받은 컨텐츠가 없습니다. url을 다시 확인해주세요.');
    return;
  }

  const elements = getElements(html, selector);
  if (!elements.length) {
    console.error('엘리먼트를 찾지 못했습니다. selector를 다시 확인해주세요.');
    return;
  }

  const urlInstance = new URL(url);
  const srcs = elements
    .map((element) => element.attr('src'))
    .map((src) => convertAbsoluteUrls(src, urlInstance));

  const directory = `./${title}`;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  await Promise.all(
    srcs.map(async (src, index) => {
      const response = await axios.get(src, {
        responseType: 'arraybuffer',
      });

      fs.writeFileSync(
        `${directory}/${index + 1}-${getFilename(src)}`,
        response.data
      );
    })
  );
})().finally(() => {
  process.exit();
});
