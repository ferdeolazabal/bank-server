import { AppDataSource } from "../data-source";
import { postPayment } from "../controllers/payments";
import { Request, Response } from "express";
import IUserDomain from "../InterfaceAdapters/IDomain/IUserDomain";
import Payment from "../domain/Payment";
import PaymentStatusEnum from "../Infrastructure/Enums/PaymentStatusEnum";
import PaymentTypeEnum from "../Infrastructure/Enums/PaymentTypeEnum";

jest.mock("../data-source", () => ({
  AppDataSource: {
    manager: {
      save: jest.fn(),
    },
  },
}));

describe("postPayment", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      body: {
        amount: "100",
        type: "credit_card",
        user: {
          _id: "2e2d62aa-9d9a-47fd-b03a-1cf73dbf2b5f",
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
          password:
            "$2a$10$O6RHyWVjWhzKgy4Km7gGuujXFJyscu7Qm2hvW.6CQqB6LHsLXLi6e",
          enable: true,
          isSuperAdmin: true,
          createdAt: "2024-04-04T02:09:58.769Z",
          updatedAt: "2024-04-04T02:09:58.769Z",
        } as unknown as IUserDomain,
        status: "pending",
        receiver: "456",
      },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    (AppDataSource.manager.save as jest.Mock).mockClear();
  });

  it("it should save a new payment and return it", async () => {
    const mockPayment = new Payment();
    mockPayment.setValues({
      amount: 10,
      type: PaymentTypeEnum.CREDIT_CARD,
      user: {
        _id: "2e2d62aa-9d9a-47fd-b03a-1cf73dbf2b5f",
        firstName: "test",
        lastName: "test",
        email: "test@test.com",
        password:
          "$2a$10$O6RHyWVjWhzKgy4Km7gGuujXFJyscu7Qm2hvW.6CQqB6LHsLXLi6e",
        enable: true,
        isSuperAdmin: true,
        createdAt: "2024-04-04T02:09:58.769Z",
        updatedAt: "2024-04-04T02:09:58.769Z",
      } as unknown as IUserDomain,
      status: PaymentStatusEnum.SUCCESS,
      receiver: "test@test.com",
    });

    (AppDataSource.manager.save as jest.Mock).mockReturnValueOnce(
      Promise.resolve(mockPayment)
    );

    await postPayment(mockReq as Request, mockRes as Response);

    expect(AppDataSource.manager.save).toHaveBeenCalledWith(
      expect.any(Payment)
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: true,
      payment: expect.objectContaining(mockPayment),
    });
  });

  it("it should return an error response on failure", async () => {
    const mockError = new Error("Error saving payment");
    (AppDataSource.manager.save as jest.Mock).mockReturnValueOnce(
      Promise.reject(mockError)
    );

    await postPayment(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      message: "Error al guardar el pago",
    });
  });
});
