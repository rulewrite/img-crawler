import {
  getElements,
  convertAbsoluteUrls,
  getFilename,
  getTime,
  makeDirectory,
  urlReplaceKeyword,
} from './util';
import * as fs from 'fs';
import axios from 'axios';
import Argument from './Argument';
import Traveler from './Traveler';

(async () => {
  const { URL: url, QUERY, START, END, IS_NESTED_DIRECTORY } = new Argument();
  const startNumber = START.NUMBER;

  const traveler = new Traveler();
  await traveler.launch();

  let rootDirectory = '';
  for (let index = startNumber; index <= END; index++) {
    const zeroPaddedIndex = START.get(index);
    const currentUrl = url.replaceAll(urlReplaceKeyword, zeroPaddedIndex);
    const { title, html } = await traveler.goto(currentUrl);

    if (!html.length) {
      console.error('응답받은 컨텐츠가 없습니다. url을 다시 확인해주세요.');
      return;
    }

    const elements = getElements(html, QUERY);
    if (!elements.length) {
      console.error(
        '엘리먼트를 찾지 못했습니다. selector를 다시 확인해주세요.'
      );
      return;
    }

    const urlInstance = new URL(currentUrl);
    const srcs = elements
      .map((element) => element.attr('src'))
      .map((src) => convertAbsoluteUrls(src, urlInstance));

    if (index === startNumber) {
      rootDirectory = `./${title}-${getTime()}`;
      makeDirectory(rootDirectory);
    }

    let directory = rootDirectory;
    if (IS_NESTED_DIRECTORY) {
      directory += `/${zeroPaddedIndex}`;
      makeDirectory(directory);
    }

    await Promise.all(
      srcs.map(async (src, imgIndex) => {
        const response = await axios.get(src, {
          responseType: 'arraybuffer',
        });

        fs.writeFileSync(
          `${directory}/${index}-${imgIndex + 1}-${getFilename(src)}`,
          response.data
        );
      })
    );
  }
})()
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
