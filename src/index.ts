import { getArguments, getElements, getHtml } from './util';

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

  const html = await getHtml(url);
  if (!html.length) {
    console.error('응답받은 컨텐츠가 없습니다. url을 다시 확인해주세요.');
    return;
  }

  const elements = getElements(html, selector);
  if (!elements.length) {
    console.error('엘리먼트를 찾지 못했습니다. selector를 다시 확인해주세요.');
    return;
  }
})().finally(() => {
  process.exit();
});
