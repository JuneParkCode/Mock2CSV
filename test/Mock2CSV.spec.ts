import { Schema } from "../src/schema";
import { Mock2CSV } from "../src/Mock2CSV";
import { test, expect, describe } from "vitest";

const testSchema: Schema = {
  userId: () => "1",
  nickname: () => "test",
};

const escapeTestSchema: Schema = {
  userId: () => `"1"`,
  nickname: () => `"te,st\n`,
};

describe("Mock2CSV", () => {
  describe("generate", () => {
    test("test generate", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generate.csv";

      mock2csv.generate(testSchema, 1, filePath);
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"userId","nickname"\n"1","test"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test generate multiples", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generate_multiples.csv";

      mock2csv.generate(testSchema, 3, filePath);
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(
        `"userId","nickname"\n"1","test"\n"1","test"\n"1","test"\n`
      );
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test generate no records", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generate_no_records.csv";

      mock2csv.generate(testSchema, 0, filePath);
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"userId","nickname"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test no header", async () => {
      const mock2csv = new Mock2CSV({ header: false });
      const filePath = "test_no_header.csv";

      mock2csv.generate(testSchema, 1, filePath);
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"1","test"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test delimiter", async () => {
      const mock2csv = new Mock2CSV({ delimiter: ";" });
      const filePath = "test_delimiter.csv";

      mock2csv.generate(testSchema, 1, filePath);
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"userId";"nickname"\n"1";"test"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test quote", async () => {
      const mock2csv = new Mock2CSV({ quote: "'" });
      const filePath = "test_quote.csv";

      mock2csv.generate(testSchema, 1, filePath);
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`'userId','nickname'\n'1','test'\n`);
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test escape", async () => {
      const mock2csv = new Mock2CSV({ escape: "-" });
      const filePath = "test_escape.csv";

      mock2csv.generate(escapeTestSchema, 1, filePath);
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"userId","nickname"\n"-"1-"","-"te,st\n"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });
  });

  describe("generateAsync", () => {
    test("test generateAsync", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generateAsync.csv";

      await mock2csv.generateAsync(testSchema, 1, filePath);
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"userId","nickname"\n"1","test"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test generateAsync multiples", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generateAsync_multiples.csv";

      await mock2csv.generateAsync(testSchema, 3, filePath);
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(
        `"userId","nickname"\n"1","test"\n"1","test"\n"1","test"\n`
      );
      // remove file
      fs.unlinkSync(filePath);
    });
  });

  describe("generateToStream", () => {
    test("test generateToStream", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generateToStream.csv";
      const stream = require("fs").createWriteStream(filePath, {
        autoClose: true,
      });

      mock2csv.generateToStream(testSchema, 1, stream);
      stream.end();
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"userId","nickname"\n"1","test"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test generateToStream multiples", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generateToStream_multiples.csv";
      const stream = require("fs").createWriteStream(filePath, {
        autoClose: true,
      });

      mock2csv.generateToStream(testSchema, 3, stream);
      stream.end();
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(
        `"userId","nickname"\n"1","test"\n"1","test"\n"1","test"\n`
      );
      // remove file
      fs.unlinkSync(filePath);
    });

    test("test generateToStream no records", async () => {
      const mock2csv = new Mock2CSV();
      const filePath = "test_generateToStream_no_records.csv";
      const stream = require("fs").createWriteStream(filePath, {
        autoClose: true,
      });

      mock2csv.generateToStream(testSchema, 0, stream);
      stream.end();
      // wait for file creation
      await new Promise((resolve) => setTimeout(resolve, 10));
      // check file is created.
      const fs = require("fs");
      expect(fs.existsSync(filePath)).toBe(true);
      // check file content
      const data = fs.readFileSync(filePath, "utf8");
      expect(data).toBe(`"userId","nickname"\n`);
      // remove file
      fs.unlinkSync(filePath);
    });
  });

  describe("generateRecordString", () => {
    test("test generateRecordString", async () => {
      const mock2csv = new Mock2CSV();
      const csvString = mock2csv.generateRecordString(testSchema, 1);
      expect(csvString).toBe(`"1","test"\n`);
    });

    test("test generateRecordString multiples", async () => {
      const mock2csv = new Mock2CSV();
      const csvString = mock2csv.generateRecordString(testSchema, 3);
      expect(csvString).toBe(`"1","test"\n"1","test"\n"1","test"\n`);
    });

    test("test generateRecordString no records", async () => {
      const mock2csv = new Mock2CSV();
      const csvString = mock2csv.generateRecordString(testSchema, 0);
      expect(csvString).toBe("");
    });

    test("test escape", async () => {
      const mock2csv = new Mock2CSV({ escape: "-" });
      const csvString = mock2csv.generateRecordString(escapeTestSchema, 1);
      expect(csvString).toBe(`"-"1-"","-"te,st\n"\n`);
    });

    test("test escape default", async () => {
      const mock2csv = new Mock2CSV({ escape: '"' });
      const csvString = mock2csv.generateRecordString(escapeTestSchema, 1);
      expect(csvString).toBe(`"""1""","""te,st\n"\n`);
    });
  });
});
