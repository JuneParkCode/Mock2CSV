# Mock2CSV

- Mock2CSV is a simple library that allows you to quickly create csv files using libraries like faker.js.

## NOTE

- Recommend to use Typescript.
- Can use bcryptjs, faker-js, moment-timezone by `import { bcrypt, faker, moment } from "mock2csv";`

## Readme

- [On Github](https://github.com/JuneParkCode/Mock2CSV)

## Configuration

It has some options.

### how to configure

```typescript
const m2c = new Mock2CSV(); // default
const m2c = new Mock2CSV({ header: false, logging: false }); // disable header, logging
const m2c = new Mock2CSV({ delimiter: ";" }); // use delimiter ';'

// you can set options by setter.
m2c.setOptions({ header: false });
m2c.setNewLine(" ");
```

### options

```typescript
interface Options {
  header: boolean;
  delimiter: string;
  quote: string;
  escape: string;
  newLine: string;
  logging: boolean;
}
```

- `header`
  - default : `true`
  - Add a line at the top of the CSV file that spells out the name of each column.
- `delimiter`
  - default : `,`
  - Separator for each `column` in the record.
- `quote`
  - default : `"`
  - Serves to enclose each `column value` in the record.
- `escape`
  - default : `"`
  - Utilized as the escape quote within the record.
- `newLine`
  - default : `\n`
  - Signals the end of the record line and separates the next record statement.
- `logging`
  - default : `false`
  - Enable/disable logging for this tool.

## Usage

```typescript
import { bcrypt, faker, moment, Mock2CSV, Schema } from "mock2csv";

let user_id = 1;
const pw = bcrypt.hashSync("password123", 10); // encrypt password (encryption is time-consuming)
const User: Schema = {
  userId: () => (user_id++).toString(),
  nickname: () => faker.internet.userName(),
  email: () => faker.internet.email(),
  password: () => pw,
  createdAt: () =>
    moment().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ"),
  updatedAt: () =>
    moment().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ"),
};

const m2c = new Mock2CSV();

// apis
m2c.generate(User, 1e3, "output.csv");
await m2c.generateAsync(User, 1e5, "output.csv");
m2c.generateToStream(User, 1e3, stream);
```

- output.csv result example

```text
"userId","nickname","email","password","createdAt","updatedAt"
"1","Hermina.Corwin83","Johathan.Stark@yahoo.com","$2a$10$JWYurQEFR86NeomyOF0kSupf23ZH17.zWW/qE10VvLgE0RHBCrmp6","2024-05-13T08:20:49.716000+09:00","2024-05-13T08:20:49.717000+09:00"
... +999 records
```
