import ZeroPad from '../src/ZeroPad';

describe('0 붙은 숫자 만들어주는 모듈', () => {
  const num = 11;
  const zeroPad = new ZeroPad(`##${num}`);

  test('숫자 정보', () => {
    expect(zeroPad.NUMBER).toEqual(num);
  });

  test('1 -> 0001', () => {
    expect(zeroPad.get(1)).toEqual('0001');
  });

  test('21 -> 0021', () => {
    expect(zeroPad.get(21)).toEqual('0021');
  });

  test('99999 -> 99999', () => {
    expect(zeroPad.get(99999)).toEqual('99999');
  });
});
