import { check } from "express-validator";
import { fieldValidator } from "../middlewares/fieldValidator";
import { Router } from "express";
import PaymentStatusEnum from "../Infrastructure/Enums/PaymentStatusEnum";
import PaymentTypeEnum from "../Infrastructure/Enums/PaymentTypeEnum";
import {
  getPayments,
  getPayment,
  postPayment,
  downloadCsvPayments,
} from "../controllers/payments";

const paymentsRoutes = Router();

paymentsRoutes.get("/", getPayments);

paymentsRoutes.get("/:id", getPayment);

paymentsRoutes.post(
  "/new",
  [
    check("amount", "El monto de la operación es obligatorio").not().isEmpty(),
    check(
      "type",
      `El tipo de operación es obligatorio, elija entre las opciones: 'creditCard', 'wallet', 'bankTransfer'`
    ).isIn(Object.values(PaymentTypeEnum)),
    check(
      "status",
      `El status de la operación es obligatorio, elija entre las opciones: 'pending', 'waitingAproval', 'inProcess', 'success', 'error'`
    ).isIn(Object.values(PaymentStatusEnum)),
    check("user", "El usuario es obligatorio").not().isEmpty(),
    check("receiver", "El email del receptor es obligatorio").isEmail(),
    fieldValidator,
  ],
  postPayment
);

paymentsRoutes.post("/export-csv", downloadCsvPayments);

export default paymentsRoutes;
