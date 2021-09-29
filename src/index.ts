import Argument from './Argument';
import Traveler from './Traveler';
import Range from './Range';
import ImgCollection from './ImgCollection';
import DirectoryStack from './DirectoryStack';

(async () => {
  const { QUERY, ...argument } = new Argument();

  const range = new Range(
    argument.URL,
    argument.RANGE,
    argument.SINGLE_DIRECTORY
  );
  const { IS_NESTED_DIRECTORY } = range;

  const traveler = new Traveler();
  await traveler.launch();

  const directoryStack = new DirectoryStack();
  for (let { isFirst, current, zeroPaddedIndex, url } of range) {
    try {
      const { title, html } = await traveler.goto(url);

      if (isFirst) {
        directoryStack.push(title, true);
      }

      if (IS_NESTED_DIRECTORY) {
        directoryStack.push(String(zeroPaddedIndex));
      }

      const imgCollection = new ImgCollection(new URL(url), html, QUERY);
      for await (let { index, filename, data } of imgCollection) {
        directoryStack.write(`${current}-${index + 1}-${filename}`, data);
      }

      if (IS_NESTED_DIRECTORY) {
        directoryStack.pop();
      }
    } catch {}
  }
})()
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
