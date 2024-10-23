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

app.post("/register", async (req: Request, res: Response) => {
  console.log(req.body);
  const response = req.body;
  const idToken = response.idToken;
  const name = response.name;
  const email = response.email;
  const password = response.password;

  if (!idToken || !name || !email || !password) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: "missing required fields" });
  }

  let uid;
  try {
    const decodedToken = await admin.auth().verifyIdToken(response.idToken);
    uid = decodedToken.uid;
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.UNAUTHORIZED).send("Authentication failed");
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser !== null) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "user already exists. please login" });
    }

    const hashedPassword = await argon2.hash(password);
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });
    const newUser = await prisma.user.create({
      data: {
        id: uid,
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    res.cookie("userId", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week,
      sameSite: "strict",
    });
    res.cookie("token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.status(HTTP_STATUS.OK).json({
      message: "user registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "failed to regsiter user" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  console.log(req.body);
  const response = req.body;
  const idToken = response.idToken;
  const email = response.email;
  const password = response.password;
  console.log(response);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const user = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (!user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "User not found. please register" });
    }
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "invalid credentials" });
    }

    res.cookie("userId", uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiry
      sameSite: "strict",
    });

    res.cookie("token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: "strict",
    });
    res.json({ message: "login successful", user });
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "Authentication failed, invalid credentials" });
  }
});

app.post("/check-user", async (req, res) => {
  const response = req.body;
  const email = response.email;
  if (!email) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: "Email is required" });
  }
  try {
    console.log("Checking for user with email:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log("Existing user:", existingUser);
    if (existingUser !== null) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "this email is  already registered. please log in instead.",
      });
    }
    res.status(HTTP_STATUS.OK).json({ message: "user doesnt exist" });
  } catch (error) {
    console.error("error checking user", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
