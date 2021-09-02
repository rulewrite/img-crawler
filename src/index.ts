import {
  getArguments,
  getElements,
  getContents,
  convertAbsoluteUrls,
  getFilename,
  getTime,
  ZeroPad,
  makeDirectory,
} from './util';
import * as fs from 'fs';
import axios from 'axios';

const urlReplaceKeyword = '{%}';

(async () => {
  const [
    url,
    selector,
    start = '1',
    end = 'Infinity',
    isEachDirectoryString = 'true',
  ] = getArguments();

  if (!url) {
    console.error('url이 없습니다.');
    return;
  }

  if (!selector) {
    console.error('selector가 없습니다.');
    return;
  }

  const isLoop = url.includes(urlReplaceKeyword);
  const isEachDirectory = isLoop && isEachDirectoryString === 'true';

  const zeroPad = new ZeroPad(isLoop ? start : '1');
  const startNumber = zeroPad.NUMBER;
  const endNumber = new ZeroPad(isLoop ? end : '1').NUMBER;

  if (Number.isNaN(endNumber) || Number.isNaN(startNumber)) {
    console.error('페이지 번호가 올바르지 않습니다.');
    return;
  }

  if (endNumber < startNumber) {
    console.error('종료 번호가 시작 번호보다 작을 수 없습니다.');
    return;
  }

  let rootDirectory = '';
  for (let index = startNumber; index <= endNumber; index++) {
    const zeroPaddedIndex = zeroPad.get(index);
    const currentUrl = url.replaceAll(urlReplaceKeyword, zeroPaddedIndex);
    const { title, html } = await getContents(currentUrl);

    if (!html.length) {
      console.error('응답받은 컨텐츠가 없습니다. url을 다시 확인해주세요.');
      return;
    }

    const elements = getElements(html, selector);
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
    if (isEachDirectory) {
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
})().finally(() => {
  process.exit();
});
