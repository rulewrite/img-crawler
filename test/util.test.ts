import { getFilename, getTime } from '../src/util';

test('파일명 가져오는 모듈', () => {
  const filename = 'file.name.jpg';
  const url = `https://dummy.dumb/path/path/${filename}`;

  expect(getFilename(url)).toEqual(filename);
});

test('시간 정보 가져오는 모듈', () => {
  getTime('!')
    .split('!')
    .map((time) => Number(time))
    .forEach((time) => expect(Number.isInteger(time)).toEqual(true));
});
