import { EntitySchema } from "typeorm";
import PaymentTypeEnum from "../Enums/PaymentTypeEnum";
import PaymentStatusEnum from "../Enums/PaymentStatusEnum";
import Payment from "../../domain/Payment";

const PaymentsSchema = new EntitySchema<Payment>({
  name: "Payment",
  target: Payment,
  tableName: "payment",
  columns: {
    _id: {
      type: String,
      primary: true,
      unique: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    type: {
      type: "enum",
      enum: PaymentTypeEnum,
      nullable: false,
    },
    status: {
      type: "enum",
      enum: PaymentStatusEnum,
      nullable: false,
    },
    receiver: {
      type: String,
      nullable: true,
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
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      eager: false,
      joinColumn: {
        name: "userId",
        referencedColumnName: "_id",
      },
    },
  },
});

export default PaymentsSchema;
