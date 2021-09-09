import DirectoryStack from '../src/DirectoryStack';

test('시간 정보 가져오는 모듈', () => {
  (DirectoryStack as any)
    .getTime(new Date())
    .split('-')
    .map((time) => Number(time))
    .forEach((time) => expect(Number.isInteger(time)).toEqual(true));
});
