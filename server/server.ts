import { PrismaClient } from "@prisma/client";
import { Multer } from "@ts-stack/multer";
import cors from "cors";
import express from "express";
import { HTTP_STATUS } from "./utils/utils.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
const app = express();
const prisma = new PrismaClient();
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
  })
);

const multer = new Multer({
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, //2MB
  },
});
const parseImage = multer.single("image");
app.post("/create", async (req, res) => {
  try {
    const parsedForm = await parseImage(req, req.headers);
    if (!parsedForm) return;
    const formData = parsedForm.textFields;
    const { title, description, questionText, questionType } = formData;
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
    console.error(error, { cause: error });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "failed to create form" });
  }
});

app.delete("/forms/:id", async (req, res) => {
  const formId = req.params.id;
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
    console.error(error, { cause: error });
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "failed to delete form" });
  }
});

app.get("/search", async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const searchQuery = req.query.search as string;
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
    console.log(`🔴: ${error}`, { cause: error });

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
    console.error(error, { cause: error });
    let errorMessage;
    if (error instanceof PrismaClientKnownRequestError) {
      return (errorMessage = "db query failed");
    } else {
      errorMessage = "failed to fetch templates";
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)

      .json({ error: errorMessage });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
