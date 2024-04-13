interface IUserDomain {
  getId(): string;

  getFirstName(): string;
  getLastName(): string;
  getEmail(): string;
  getPassword(): string;
  getEnable(): boolean;
  getIsSuperAdmin(): boolean;
  getFullName(): string;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
}

export default IUserDomain;
