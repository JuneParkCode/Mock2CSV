# Mock2CSV

- Mock2CSV is a simple library that allows you to quickly create csv files using libraries like faker.js.

## NOTE

- Recommend to use Typescript.
- Can use bcryptjs, faker-js, moment-timezone by `import { bcrypt, faker, moment } from "mock2csv";`

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

// can be configured..
const m2c = new Mock2CSV();
//    const m2c = new Mock2CSV({header: false, delimiter: ';', quote: "'", escape: "'", newLine: '\n'});
//    const m2c = new Mock2CSV({header: false, logging: false});

m2c.generate(User, 1e3, "user.csv");
```

- output.csv result example

```text
"userId","nickname","email","password","createdAt","updatedAt"
"1","Hermina.Corwin83","Johathan.Stark@yahoo.com","$2a$10$JWYurQEFR86NeomyOF0kSupf23ZH17.zWW/qE10VvLgE0RHBCrmp6","2024-05-13T08:20:49.716000+09:00","2024-05-13T08:20:49.717000+09:00"
... +999 records
```
