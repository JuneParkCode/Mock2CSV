import fs, { WriteStream } from "fs";
import { Schema } from "./schema";

export interface CSVOptions {
  header?: boolean;
  delimiter?: string;
  quote?: string;
  escape?: string;
  newLine?: string;
}

/**
 * CSVOptions
 * @param header: boolean - whether to include header to csv file (default: true)
 * @param delimiter: string - column delimiter (default: `,`)
 * @param quote: string - Column data quote (default: `"`)
 * @param escape: string -  Column data escape (default: `"`)
 * @param newLine: string - New line character (default: `\n`)
 *
 * @example `'column1','column2','column3'\n` = {header: true, delimiter: ',', quote: '\'', escape: '\'', newLine: '\n'}
 */
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
 * @param schema: Schema - schema to generate records
 * @param fileName: string - output file name (default: `output.csv`)
 * @param recordNum: number - number of records to generate (default: 1e3)
 * @param csvOptions: CSVOptions - options for csv file
 */
export class Mock2CSV {
  private csvOptions: CSVOptions;

  constructor(csvOptions: CSVOptions = new DefaultOptions()) {
    this.csvOptions = csvOptions;
  }

  /**
   * generate csv files with given schema and options
   */
  public generate(
    schema: Schema,
    recordNum: number,
    filePath: string = "output.csv"
  ) {
    const stream = fs.createWriteStream(filePath);
    const startTime = new Date().getTime();

    console.log(`Generating ${recordNum} records...`);
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
    console.log(`\nWriting file... to ${filePath}`);
    // file write end
    stream.on("finish", () => {
      this.logEndMessage(startTime, filePath);
    });
  }

  private writeProgress(current: number = 0, recordNum: number) {
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

    console.log("========================================");
    console.log(`File saved to ${filePath}`);
    console.log(`\nExecution time: ${this.getTimeString(startTime, endTime)}`);
    console.log(`File size: ${fileSize.toFixed(2)}MB`);
    console.log("Done!");
    console.log("========================================");
  }

  private getTimeString(startTime: number, endTime: number) {
    // 1 분 이상일 경우 분 : 초 로 표시
    if (endTime - startTime > 60000) {
      return `${((endTime - startTime) / 60000).toFixed(0)}m ${
        ((endTime - startTime) % 60000) / 1000
      }s`;
    }
    return `${((endTime - startTime) / 1000).toFixed(2)}s`;
  }
}
