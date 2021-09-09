import * as fs from 'fs';

export default class DirectoryStack {
  public static getUrlFilename(url: string) {
    return String(url.split('/').slice(-1));
  }

  private static getTime(date: Date) {
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ].join('-');
  }

  private stack: string[] = ['.'];

  private get paths(): string {
    return this.stack.join('/');
  }

  constructor() {}

  push(path: string, withTime = false) {
    if (withTime) {
      path = `${path}-${DirectoryStack.getTime(new Date())}`;
    }

    this.stack.push(path);
    this.makeDirectory();
  }

  pop() {
    this.stack.pop();
  }

  private makeDirectory() {
    const { paths } = this;

    if (fs.existsSync(paths)) {
      return;
    }

    fs.mkdirSync(paths, { recursive: true });
  }

  write(filename: string, data: string | NodeJS.ArrayBufferView) {
    const { paths } = this;

    fs.writeFileSync(`${paths}/${filename}`, data);
  }
}
