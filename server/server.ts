import { PrismaClient } from "@prisma/client";
import { Multer } from "@ts-stack/multer";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";

import { HTTP_STATUS } from "./utils/utils.js";

const prisma = new PrismaClient();
const multer = new Multer({
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024,
  },
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
    const users = await prisma.form.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
});

app.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    const parsedForm = await parseImage(req, req.headers);
    if (!parsedForm) return;
    console.log("received form data", parsedForm.textFields);
    const formData = parsedForm.textFields;
    console.log(formData);
    const title = formData.title;
    const description = formData.description;
    const untitledQuestion = formData.untitledQuestion;
    const questionType = formData.questionType;
    const multipleChoiceOption1 = formData.multipleChoiceOption1;
    const multipleChoiceOption2 = formData.multipleChoiceOption2;
    const option1Checked = false;
    const option2Checked = false;

    const newTemplate = await prisma.template.create({
      data: {
        title: title,
        description: description,
        questions: {
          create: [
            {
              text: untitledQuestion,
              type: questionType,
              order: 1,
              option1: multipleChoiceOption1,
              option2: multipleChoiceOption2,
              option1Checked: option1Checked,
              option2Checked: option2Checked,
            },
          ],
        },
      },
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: "Form created successfully",
      templateId: newTemplate.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create form" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const searchQuery = (await req.query.search) as string;
    console.log(searchQuery);

    if (!searchQuery) {
      return res.json([]);
    }
    const searchResults = await prisma.template.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery.toLowerCase(),
            },
          },
          {
            description: {
              contains: searchQuery.toLowerCase(),
            },
          },
        ],
      },
      take: 20,
    });

    res.json(searchResults);
  } catch (error) {
    console.error("search error:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "failed to perform search" });
  }
});

app.get("/templates", async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      include: {
        questions: true,
      },
    });
    res.status(HTTP_STATUS.OK).json(templates);
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "failed to fetch templates" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
