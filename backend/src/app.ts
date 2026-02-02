import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler, notFound } from "./middleware/errorHandler";
import { sendSuccess } from "./utils/response";

import classRoutes from "./routes/class.routes";
import branchRoutes from "./routes/branch.routes";
import instructorRoutes from "./routes/instructor.routes";
import roomRoutes from "./routes/room.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());

app.use("/api/classes", classRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);

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
