import * as fs from 'fs';

export const getFilename = (url: string) => {
  return String(url.split('/').slice(-1));
};

export const getTime = (coupler = '-') => {
  const date = new Date();
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ].join(coupler);
};

export const makeDirectory = (path: string) => {
  if (fs.existsSync(path)) {
    return;
  }

  fs.mkdirSync(path, { recursive: true });
};
