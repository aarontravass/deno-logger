import { ensureFileSync, existsSync } from '../depts.ts';

export class FileLogger {
  readonly #filename: string;
  #writableStream!: Deno.FsFile;
  constructor(filename: string) {
    this.#filename = filename;
    this.#_stat();
    this.#_createWritableStream();
    this.#_endStream();
  }

  #fsAccess(filename: string, isFile: boolean) {
    return existsSync(filename, { isReadable: true, isFile });
  }

  #_stat() {
    //check if file exists
    if (!this.#fsAccess(this.#filename, true)) {
      // check if directory exists
      // create the file and write an empty string to it
      ensureFileSync(this.#filename);
      return;
    }
  }

  async #_createWritableStream() {
    this.#writableStream = await Deno.open(this.#filename, { append: true });
  }

  async toFile(stringToLog: string) {
    await this.#writableStream.write(new TextEncoder().encode(stringToLog));
  }

  #_endStream() {
    globalThis.addEventListener('unload', () => {
      Deno.close(this.#writableStream.rid + 1);
      this.#writableStream.close();
    });
  }
}
