import { v4 as uuidv4 } from "uuid";
import { SetValuesPayload } from "../TsHelper";
import IUserDomain from "../InterfaceAdapters/IDomain/IUserDomain";

class User implements IUserDomain {
  _id: string;

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  enable: boolean;
  isSuperAdmin: boolean;

  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this._id = uuidv4();
  }

  getId(): string {
    return this._id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return this.firstName + " " + this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getEnable(): boolean {
    return this.enable;
  }

  getIsSuperAdmin(): boolean {
    return this.isSuperAdmin;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setValues(values: SetValuesPayload<User>): void {
    this.firstName = values.firstName ?? this.firstName;
    this.lastName = values.lastName ?? this.lastName;
    this.email = values.email ?? this.email;
    this.password = values.password ?? this.password;
    this.enable = values.enable ?? this.enable;
    this.isSuperAdmin = values.isSuperAdmin ?? this.isSuperAdmin;

    this.createdAt = values.createdAt ?? this.createdAt;
    this.updatedAt = values.updatedAt ?? this.updatedAt;
  }

  static fromValues(values: User): User {
    const user = new User();
    const { _id, ...rest } = values;

    user._id = _id;
    user.setValues({
      ...rest,
    });
    return user;
  }
}

export default User;
