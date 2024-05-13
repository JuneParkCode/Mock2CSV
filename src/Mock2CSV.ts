import fs, { WriteStream } from "fs";
import { Schema } from "./schema";

/**
 * CSVOptions
 * @description Options for csv file
 *
 * @param header: boolean - whether to include header to csv file (default: true)
 * @param delimiter: string - column delimiter (default: `,`)
 * @param quote: string - Column data quote (default: `"`)
 * @param escape: string -  Column data escape (default: `"`)
 *
 * @example
 * For example, if you want to generate csv file with options below:
 * 'columnName1','columnName2','columnName3'\n
 * 'column1','column2','column3'\n
 * ...
 *
 * Set options like below:
 * {header: true, delimiter: ',', quote: '\'', escape: '\'', newLine: '\n'}
 */
export interface CSVOptions {
  header?: boolean;
  delimiter?: string;
  quote?: string;
  escape?: string;
  newLine?: string;
}

class DefaultOptions implements CSVOptions {
  header?: boolean = true;
  delimiter?: string = ",";
  quote?: string = '"';
  escape?: string = '"';
  newLine?: string = "\n";
}

/**
 * Mock2CSV
 * @description Generate csv file with given schema and options.
 *
 * @param csvOptions: CSVOptions - options for csv file
 *
 * @example
 * const m2c = new Mock2CSV();
 * m2c.generate(User, 1000, 'output.csv');
 */
export class Mock2CSV {
  private csvOptions: CSVOptions;
  private logging: boolean;

  /**
   * Create Mock2CSV instance
   *
   * @param logging boolean - whether to log progress (default: true)
   * @param csvOptions {@link CSVOptions} - options for csv file
   * @example
   * const m2c = new Mock2CSV(false);
   *
   * const m2c = new Mock2CSV(true, {header: false});
   *
   * const m2c = new Mock2CSV(true, {header: false, delimiter: ';', quote: '"', escape: '"', newLine: '\n'});
   */
  constructor(logging: boolean = true, csvOptions?: CSVOptions) {
    this.csvOptions = { ...new DefaultOptions(), ...csvOptions };
    this.logging = logging;
  }

  /**
   * generate csv files with given schema and options
   *
   * @param schema {@link Schema} - schema to generate records
   * @param recordNum number - number of records to generate
   * @param filePath string - file path to save csv file (default: 'output.csv')
   * @example
   * mock2csv.generate(User, 1000, 'output.csv');
   * mock2csv.generate(User, 1e6);
   */
  public generate(
    schema: Schema,
    recordNum: number,
    filePath: string = "output.csv"
  ) {
    const stream = fs.createWriteStream(filePath);
    const startTime = new Date().getTime();

    this.log(`Generating ${recordNum} records...`);
    if (this.csvOptions.header) {
      this.writeLine(this.getHeaderLine(schema), stream);
    }
    for (let i = 0; i < recordNum; i++) {
      this.writeLine(this.getRecordLine(schema), stream);
      if (i % 10000 === 0) {
        this.writeProgress(i, recordNum);
      }
    }
    stream.end();
    // log
    this.writeProgress(recordNum, recordNum);
    this.log(`\nWriting file... to ${filePath}`);
    // file write end
    stream.on("finish", () => {
      this.logEndMessage(startTime, filePath);
    });
  }

  /**
   * write generated csv records to stream
   *
   * @description write generated csv records to stream
   *
   * @param schema {@link Schema} - schema to generate records
   * @param recordNum number - number of records to generate
   * @param stream WriteStream - stream to write csv records
   * @example
   * const stream = fs.createWriteStream('output.csv');
   * mock2csv.generateToStream(User, 1000, stream);
   * stream.end();
   */
  public generateToStream(
    schema: Schema,
    recordNum: number,
    stream: WriteStream
  ) {
    this.log(`Generating ${recordNum} records...`);
    if (this.csvOptions.header) {
      this.writeLine(this.getHeaderLine(schema), stream);
    }
    for (let i = 0; i < recordNum; i++) {
      this.writeLine(this.getRecordLine(schema), stream);
      if (i % 10000 === 0) {
        this.writeProgress(i, recordNum);
      }
    }
    this.log(`\nWriting file to stream...`);
  }

  // private methods

  private writeProgress(current: number = 0, recordNum: number) {
    if (!this.logging) return;
    const progress = (current / recordNum) * 100;
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Progress: ${progress.toFixed(2)}%`);
  }

  private writeLine(line: string, stream: WriteStream) {
    stream.write(line);
  }

  private getLineString(values: string[]): string {
    let line: string = "";
    values.forEach((value) => {
      line += `${this.csvOptions.quote}${value}${this.csvOptions.quote}${this.csvOptions.delimiter}`;
    });
    line = line.slice(0, -1);
    line += this.csvOptions.newLine;
    return line;
  }

  private getHeaderLine(schema: Schema) {
    return this.getLineString(Object.keys(schema));
  }

  private getRecordLine(schema: Schema) {
    let values: string[] = [];
    for (const key in schema) {
      values.push(schema[key]());
    }
    return this.getLineString(values);
  }

  private logEndMessage(startTime: number, filePath: string) {
    const endTime = new Date().getTime();
    const stats = fs.statSync(filePath);
    const fileSize = stats.size / 1e6;

    this.log("========================================");
    this.log(`File saved to ${filePath}`);
    this.log(`\nExecution time: ${this.getTimeString(startTime, endTime)}`);
    this.log(`File size: ${fileSize.toFixed(2)}MB`);
    this.log("Done!");
    this.log("========================================");
  }

  private getTimeString(startTime: number, endTime: number) {
    if (endTime - startTime > 60000) {
      return `${((endTime - startTime) / 60000).toFixed(0)}m ${
        ((endTime - startTime) % 60000) / 1000
      }s`;
    }
    return `${((endTime - startTime) / 1000).toFixed(2)}s`;
  }

  private log(message: string) {
    if (this.logging) console.log(message);
  }
}
