import { AppDataSource } from "../data-source";
import { Response, Request } from "express";
import ConverToCSVHelper from "../helpers/csv";
import fs from "fs";
import path from "path";

import Payment from "../domain/Payment";
import { statusEnum, typeEnum } from "../helpers/helpers";

const getPayments = async (req: Request, res: Response) => {
  try {
    const savedPayments = await AppDataSource.manager.find(Payment, {
      relations: ["user"],
    });

    const payments = savedPayments.map((pay) => Payment.fromValues(pay));

    res.json({
      ok: true,
      payments,
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      ok: false,
      message: "Error al obtener total de pagos",
    });
  }
};

const getPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const savedPayment = await AppDataSource.manager.findOne(Payment, {
      relations: ["user"],
      where: { _id: id },
    });
    const payment = Payment.fromValues(savedPayment);

    res.json({
      ok: true,
      payment,
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      ok: false,
      message: "Error al obtener pago",
    });
  }
};

const postPayment = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const payment = new Payment();

    payment.setValues({
      amount: +body.amount,
      type: body.type,
      user: body.user,
      status: body.status,
      receiver: body.receiver,
    });

    const savedPayment = await AppDataSource.manager.save(payment);

    const getPayment = await AppDataSource.manager.findOne(Payment, {
      relations: ["user"],
      where: { _id: savedPayment._id },
    });
    const newPay = Payment.fromValues(getPayment);

    res.json({
      ok: true,
      payment: newPay,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      message: "Error al guardar el pago",
    });
  }
};

const downloadCsvPayments = async (req: Request, res: Response) => {
  try {
    const csvHelper = new ConverToCSVHelper();
    const savedPayments = await AppDataSource.manager.find(Payment, {
      relations: ["user"],
    });
    const payments = savedPayments.map((pay) => Payment.fromValues(pay));

    const paymentsToDownload = payments.map((data: Payment) => {
      return {
        Nombre_de_usuario: data?.user?.getFullName() || "-",
        Email: data?.user?.getEmail() || "-",
        Forma_de_pago: typeEnum[data.type],
        Fecha_de_pago: new Date(data.getCreatedAt()).toLocaleDateString(
          "es-AR"
        ),
        Estado: statusEnum[data.getStatus()],
        Monto: `$ ${data.getAmount()}`,
        Receptor: data.getReceiver(),
      };
    });

    const filePath = await csvHelper.convertToCSV(
      paymentsToDownload,
      "payments"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + path.basename(filePath)
    );
    res.setHeader("Content-Type", "text/csv");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      fs.unlinkSync(filePath);
    });
  } catch (e) {
    console.log("Error al descargar el archivo CSV:", e);
    res.status(500).json({
      ok: false,
      message: "Error al descargar el archivo CSV",
    });
  }
};

export { getPayments, getPayment, postPayment, downloadCsvPayments };
