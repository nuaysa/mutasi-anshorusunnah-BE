import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { AuthRouter } from "./routers/auth.router";
import { UserRouter } from "./routers/users.router";
import { CategoryRouter } from "./routers/category.router";
import { VendorRouter } from "./routers/vendor.router";
import { TransactionsRouter } from "./routers/transaction.router";
import { StudentsRouter } from "./routers/students.router";
import { PdfRouter } from "./routers/pdf.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: [`${process.env.BASE_URL_FE}`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("API running");
});

const authRouter = new AuthRouter();
const pdfRouter = new PdfRouter();
const categoryRouter = new CategoryRouter();
const vendorRouter = new VendorRouter();
const userRouter = new UserRouter();
const transactionsRouter = new TransactionsRouter();
const studentRouter = new StudentsRouter();

app.use("/api/auth", authRouter.getRouter());
app.use("/api/pdf", pdfRouter.getRouter());
app.use("/api/category", categoryRouter.getRouter());
app.use("/api/vendor", vendorRouter.getRouter());
app.use("/api/user", userRouter.getRouter());
app.use("/api/student", studentRouter.getRouter());
app.use("/api/transaction", transactionsRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});
