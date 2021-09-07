import { getFilename, getTime, makeDirectory } from './util';
import * as fs from 'fs';
import axios from 'axios';
import Argument from './Argument';
import Traveler from './Traveler';
import Range from './Range';
import ImgSrcCollection from './ImgSrcCollection';

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

  let rootDirectory = '';
  for (let { isFirst, index, zeroPaddedIndex, url } of range) {
    const { title, html } = await traveler.goto(url);

    if (isFirst) {
      rootDirectory = `./${title}-${getTime()}`;
      makeDirectory(rootDirectory);
    }

    let directory = rootDirectory;
    if (IS_NESTED_DIRECTORY) {
      directory += `/${zeroPaddedIndex}`;
      makeDirectory(directory);
    }

    const imgSrcCollection = new ImgSrcCollection(url, html, QUERY);

    await Promise.all(
      imgSrcCollection.map(async (src, imgIndex) => {
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
