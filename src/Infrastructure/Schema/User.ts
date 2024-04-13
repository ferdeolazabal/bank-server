import { EntitySchema } from "typeorm";
import User from "../../domain/User";

const UserSchema = new EntitySchema<User>({
  name: "User",
  target: User,
  tableName: "user",
  columns: {
    _id: {
      type: String,
      primary: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      name: "createdAt",
      type: "timestamp with time zone",
      createDate: true,
    },
    updatedAt: {
      name: "updatedAt",
      type: "timestamp with time zone",
      updateDate: true,
    },
  },
});

export default UserSchema;
