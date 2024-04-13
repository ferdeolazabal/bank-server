import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";

import { AppDataSource } from "./src/data-source";
import paymentsRoutes from "./src/routes/payments";
import usersRoutes from "./src/routes/users";
import authRoutes from "./src/routes/auth";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    auth: "/api/auth",
    users: "/api/users",
    payments: "/api/payments",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";

    this.dbConnection();
    this.middlewares();
    this.routes();
  }

  async dbConnection() {
    AppDataSource.initialize()
      .then(() => {
        console.log("Connection has been established successfully!");
      })
      .catch((error) =>
        console.log("Unable to connect to the database:", error)
      );
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes() {
    this.app.use(this.apiPaths.auth, authRoutes);
    this.app.use(this.apiPaths.users, usersRoutes);
    this.app.use(this.apiPaths.payments, paymentsRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
