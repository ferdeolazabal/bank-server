import PaymentStatusEnum from "../../Infrastructure/Enums/PaymentStatusEnum";
import PaymentTypeEnum from "../../Infrastructure/Enums/PaymentTypeEnum";
import IUserDomain from "./IUserDomain";

export default interface IPaymentDomain {
  getId(): string;

  getAmount(): number;
  getPaymentType(): PaymentTypeEnum;
  getStatus(): PaymentStatusEnum;

  getUser(): IUserDomain;
  getReceiver(): string;

  getCreatedAt(): Date;
  getUpdatedAt(): Date;
  setValues(values: Record<string, any>): void;
}
