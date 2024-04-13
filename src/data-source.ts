import { DataSource } from "typeorm";
import dotenv from "dotenv";
import PaymentsSchema from "./Infrastructure/Schema/Payment";
import UserSchema from "./Infrastructure/Schema/User";
dotenv.config();

console.log("process.env.NODE_ENV =>", process.env.NODE_ENV);
export let AppDataSource: DataSource;
if (process.env.NODE_ENV === "development") {
  AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "bank_payment",
    username: "postgres",
    password: "",
    dropSchema: false,
    synchronize: true,
    migrationsRun: false,
    logging: false,
    entities: ["src/Infrastructure/Schema/*.ts"],
  });
}
if (process.env.NODE_ENV === "production") {
  console.log("DATABASE_URL: ", `${process.env.DATABASE_URL}`);
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dropSchema: false,
    synchronize: true,
    migrationsRun: false,
    logging: false,
    entities: ["src/Infrastructure/Schema/*.ts"],
  });
}
