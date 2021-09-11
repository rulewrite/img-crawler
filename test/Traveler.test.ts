import Traveler from '../src/Traveler';

let traveler: Traveler;
beforeAll(async () => {
  traveler = new Traveler();
  await traveler.launch();
});

const validUrl = 'https://google.com';

describe('성공', () => {
  test('구글 html 로드', async () => {
    const { title } = await traveler.goto(validUrl);
    expect(Boolean(title.length)).toEqual(true);
  });
});

describe('실패', () => {
  const notValidUrlSegment = `dummy-${Date.now()}`;

  test('존재하지 않는 사이트', async () => {
    await expect(
      traveler.goto(`https://${notValidUrlSegment}.com`)
    ).rejects.toThrow();
  });

  test('존재하지 않는 페이지', async () => {
    await expect(
      traveler.goto(`${validUrl}/${notValidUrlSegment}`)
    ).rejects.toThrow();
  });
});

afterAll(async () => {
  await traveler.close();
});
