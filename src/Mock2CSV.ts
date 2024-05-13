import fs, { WriteStream } from "fs";
import { Schema } from "./schema";

/**
 * options
 * @description Options for csv file
 *
 * @param header: boolean - whether to include header to csv file (default: true)
 * @param delimiter: string - column delimiter (default: `,`)
 * @param quote: string - Column data quote (default: `"`)
 * @param escape: string -  Column data escape (default: `""`)
 * @param newLine: string - new line character (default: `\n`)
 * @param logging: boolean - whether to log messages (default: false)
 *
 * @example
 * For example, if you want to generate csv file with options below:
 * 'columnName1','columnName2','columnName3'\n
 * 'column1','column2','column3'\n
 * ...
 *
 * Set options like below:
 * {header: true, delimiter: ',', quote: '"', escape: '"', newLine: '\n'}
 */
export interface Options {
  header: boolean;
  delimiter: string;
  quote: string;
  escape: string;
  newLine: string;
  logging: boolean;
}

class DefaultOptions implements Options {
  header: boolean = true;
  delimiter: string = ",";
  quote: string = '"';
  escape: string = '"';
  newLine: string = "\n";
  logging: boolean = false;
}

/**
 * Mock2CSV
 * @description Generate csv file with given schema and options.
 *
 * @param options: options - options for csv file
 *
 * @example
 * const m2c = new Mock2CSV();
 * m2c.generate(User, 1000, 'output.csv');
 */
export class Mock2CSV {
  private options: Options;

  /**
   * Create Mock2CSV instance
   *
   * @param options {@link Options} - options for csv file
   * @default
   * {
   *    header: true
   *    delimiter: ','
   *    quote: '"'
   *    escape: '"'
   *    newLine: '\n'
   *    logging: false
   * }
   * @example
   * const m2c = new Mock2CSV();
   * const m2c = new Mock2CSV({header: false, delimiter: ';', quote: "'", escape: "'", newLine: '\n'});
   * const m2c = new Mock2CSV({header: false, logging: true});
   **/
  constructor(options?: Options | Object) {
    this.options = { ...new DefaultOptions(), ...options };
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
  ): void {
    const stream = fs.createWriteStream(filePath, { autoClose: true });
    const startTime = new Date().getTime();

    stream.on("finish", () => {
      this.logEndMessage(startTime, filePath);
    });

    this.log(`Generating ${recordNum} records...`);
    this.writeRecordsToStream(schema, recordNum, stream).end();
  }

  /**
   * generate csv files with given schema and options asynchronously
   * @description generate csv files with given schema and options asynchronously
   * @param schema {@link Schema} - schema to generate records
   * @param recordNum number - number of records to generate
   * @param filePath string - file path to save csv file (default: 'output.csv')
   * @example
   * await mock2csv.generateAsync(User, 1000, 'output.csv');
   * await mock2csv.generateAsync(User, 1e6);
   */
  public async generateAsync(
    schema: Schema,
    recordNum: number,
    filePath: string = "output.csv"
  ): Promise<void> {
    const stream = fs.createWriteStream(filePath);
    const startTime = new Date().getTime();

    await this.writeRecrodsToStreamAsync(schema, recordNum, stream);
    this.logEndMessage(startTime, filePath);
  }

  /**
   * write generated csv records to stream
   *
   * @description write generated csv records to stream
   * @note stream is not closed after writing records
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
  ): void {
    this.log(`Generating ${recordNum} records to stream...`);
    this.writeRecordsToStream(schema, recordNum, stream);
  }

  /**
   * get csv string with given schema and record number
   *
   * @description get csv string with given schema and record number
   *
   * @param schema {@link Schema} - schema to generate records
   * @param recordNum number - number of records to generate (default: 1)
   * @returns string - csv string
   * @example
   * const csvString = mock2csv.getCsvString(User, 1000);
   */
  public generateRecordString(schema: Schema, recordNum: number = 1): string {
    let csvString: string = "";

    for (let i = 0; i < recordNum; i++) {
      csvString += this.getRecordLine(schema);
    }
    return csvString;
  }

  // setters

  /**
   * set options for csv file
   *
   * @description set options for csv file
   * @param options {@link Options} - options for csv file
   *
   * @example
   * mock2csv.setOptions({header: false, delimiter: ';', quote: "'", escape: "'", newLine: '\n'});
   */
  public setOptions(options: Options): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * set header option
   *
   * @description set header (column names) option (default: true
   * @param header
   */
  public setHeader(header: boolean): void {
    this.options.header = header;
  }

  /**
   * set delimiter option
   *
   * @description set delimiter option (default: ',')
   * @param delimiter
   */
  public setDelimiter(delimiter: string): void {
    this.options.delimiter = delimiter;
  }

  /**
   * set quote option
   *
   * @description set quote option (default: '"')
   * @param quote
   */
  public setQuote(quote: string): void {
    this.options.quote = quote;
  }

  /**
   * set escape option
   *
   * @description set escape option (default: '"')
   * @param escape
   */
  public setEscape(escape: string): void {
    this.options.escape = escape;
  }

  /**
   * set newLine option
   *
   * @description set newLine option (default: '\n')
   * @param newLine
   */
  public setNewLine(newLine: string): void {
    this.options.newLine = newLine;
  }

  /**
   * set logging option
   *
   * @description set logging option (default: true)
   * @param logging
   */
  public setLogging(logging: boolean): void {
    this.options.logging = logging;
  }

  // private methods
  private writeRecordsToStream(
    schema: Schema,
    recordNum: number,
    stream: WriteStream
  ): WriteStream {
    if (this.options.header) {
      stream.write(this.getHeaderLine(schema));
    }
    for (let i = 0; i < recordNum; i++) {
      stream.write(this.getRecordLine(schema));
    }
    return stream;
  }

  private async writeRecrodsToStreamAsync(
    schema: Schema,
    recordNum: number,
    stream: WriteStream
  ): Promise<WriteStream> {
    this.log(`Generating ${recordNum} records...`);
    this.writeRecordsToStream(schema, recordNum, stream).end();
    return new Promise<WriteStream>((resolve, reject) => {
      stream.on("finish", () => {
        resolve(stream);
      });
      stream.on("error", (err) => {
        reject(err);
      });
    });
  }

  private getLineString(values: string[]): string {
    let line: string = "";
    values.forEach((value) => {
      // if value has quote add escape (all)
      if (value.includes(this.options.quote)) {
        value = value.replaceAll(
          this.options.quote,
          this.options.escape + this.options.quote
        );
      }
      line += `${this.options.quote}${value}${this.options.quote}${this.options.delimiter}`;
    });
    line = line.slice(0, -1);
    line += this.options.newLine;
    return line;
  }

  private getHeaderLine(schema: Schema): string {
    return this.getLineString(Object.keys(schema));
  }

  private getRecordLine(schema: Schema): string {
    return this.getLineString(Object.keys(schema).map((key) => schema[key]()));
  }

  private logEndMessage(startTime: number, filePath: string): void {
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

  private getTimeString(startTime: number, endTime: number): string {
    if (endTime - startTime > 60000) {
      return `${((endTime - startTime) / 60000).toFixed(0)}m ${
        ((endTime - startTime) % 60000) / 1000
      }s`;
    }
    return `${((endTime - startTime) / 1000).toFixed(2)}s`;
  }

  private log(message: string): void {
    if (this.options.logging) console.log(message);
  }
}
