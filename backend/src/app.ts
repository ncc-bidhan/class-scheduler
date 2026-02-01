import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { sendSuccess } from "./utils/response";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return sendSuccess(res, {
    title: "API Status",
    message: "API is running",
    data: { status: "running" },
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
