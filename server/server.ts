import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/api", async (req, res) => {
  //   res.json({ users: [{ name: "shrek" }, { name: "fiona" }] });
  const users = await prisma.user.findMany();
  const posts = prisma.post.findMany();
  res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

async function main() {
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.dir(usersWithPosts, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
