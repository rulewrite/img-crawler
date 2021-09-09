export const getFilename = (url: string) => {
  return String(url.split('/').slice(-1));
};
