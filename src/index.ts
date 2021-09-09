import axios from 'axios';
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
  for (let { isFirst, index, zeroPaddedIndex, url } of range) {
    const { title, html } = await traveler.goto(url);

    if (isFirst) {
      directoryStack.push(title, true);
    }

    if (IS_NESTED_DIRECTORY) {
      directoryStack.push(String(zeroPaddedIndex));
    }

    const imgCollection = new ImgCollection(new URL(url), html, QUERY);
    await Promise.all(
      imgCollection.imgs.map(async ({ src, filename }, imgIndex) => {
        const response = await axios.get(src, {
          responseType: 'arraybuffer',
        });

        directoryStack.write(
          `${index}-${imgIndex + 1}-${filename}`,
          response.data
        );
      })
    );

    if (IS_NESTED_DIRECTORY) {
      directoryStack.pop();
    }
  }
})()
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
