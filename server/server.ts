import { PrismaClient } from "@prisma/client";
import { Multer } from "@ts-stack/multer";
import cors from "cors";
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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://not-google-forms.pages.dev",
      "https://not-google-forms.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

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
    const questionText = formData.questionText;
    const questionType = formData.questionType;

    let option1;
    let option2;

    if (questionType === "multipleChoice") {
      option1 = formData["multipleChoice[0].text"];
      option2 = formData["multipleChoice[1].text"];
    } else if (questionType === "checkboxes") {
      option1 = formData["checkboxes[0].text"];
      option2 = formData["checkboxes[1].text"];
    }

    const newTemplate = await prisma.template.create({
      data: {
        title: title,
        description: description,
        questions: {
          create: [
            {
              text: questionText,
              type: questionType,
              order: 1,
              option1: option1,
              option2: option2,
              option1Checked: false,
              option2Checked: false,
            },
          ],
        },
      },
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: "form created successfully",
      templateId: newTemplate.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "failed to create form" });
  }
});

app.delete("/forms/:id", async (req, res) => {
  const formId = await req.params.id;
  console.log("server params", formId);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.question.deleteMany({
        where: {
          templateId: formId,
        },
      }),
        await tx.template.delete({
          where: {
            id: formId,
          },
        });
    });
    res.status(HTTP_STATUS.OK).json({ message: " form deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "failed to delete form" });
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
