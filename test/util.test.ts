import { getFilename } from '../src/util';

test('파일명 가져오는 모듈', () => {
  const filename = 'file.name.jpg';
  const url = `https://dummy.dumb/path/path/${filename}`;

  expect(getFilename(url)).toEqual(filename);
});
