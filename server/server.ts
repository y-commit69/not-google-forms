import { PrismaClient } from "@prisma/client";
import { Multer } from "@ts-stack/multer";

import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import admin from "firebase-admin";
import argon2 from "argon2";
import { readFileSync } from "fs";
import { resolve } from "path";

import { HTTP_STATUS } from "./utils/utils.js";

const prisma = new PrismaClient();
const multer = new Multer({
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024,
  },
});

const filePath = resolve(
  "config/not--forms-firebase-adminsdk-8rg04-49aaea9062.json"
);
const serviceAccount = JSON.parse(readFileSync(filePath, "utf-8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const parseImage = multer.single("image");

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://not-google-forms.pages.dev"],
    credentials: true,
  })
);

app.get("/api", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
});

app.post("/create", async (req, res) => {
  try {
    const parsedForm = await parseImage(req, req.headers);
    if (!parsedForm) return;
    console.log("received form data", parsedForm.textFields);
    const { title, description, untitledQuestion, radio } =
      parsedForm.textFields;
    console.log({ title, description, untitledQuestion, radio });

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "Form created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create form" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
