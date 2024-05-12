/**
 * Schema
 * @description Schema to generate records.
 *
 * @param key: string - column name
 * @param value: () => string - function to generate column value
 *
 *
 * @example
 * ```typescript
 * let id = 1;
 * const pw = bcrypt.hashSync('password123', 10); // encrypt password (* encryption is time-consuming)
 * export const User: Schema = {
 *    userId: () => (i++).toString(),
 *    nickname: () => faker.internet.userName(),
 *    email: () => faker.internet.email(),
 *    password: () => pw,
 *    createdAt: () => moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
 *    updatedAt: () => moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ'),
 * }
 * ```
 */
export interface Schema {
  [key: string]: () => string;
}
