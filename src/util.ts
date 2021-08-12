import axios from 'axios';

export const getArguments = () => {
  return process.argv.slice(2);
};

export const getHtml = async (url: string) => {
  try {
    return (await axios.get<string>(url)).data;
  } catch (error) {
    return '';
  }
};
