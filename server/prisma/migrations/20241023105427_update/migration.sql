/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `isPublic` on the `Template` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Like_userId_templateId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Like";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "option1" TEXT,
    "option2" TEXT,
    "option3" TEXT,
    "option4" TEXT,
    "option1Checked" BOOLEAN NOT NULL DEFAULT false,
    "option2Checked" BOOLEAN NOT NULL DEFAULT false,
    "option3Checked" BOOLEAN NOT NULL DEFAULT false,
    "option4Checked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Question_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("id", "order", "templateId", "text", "type") SELECT "id", "order", "templateId", "text", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "imageUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Template" ("authorId", "createdAt", "description", "id", "imageUrl", "title", "topic", "updatedAt") SELECT "authorId", "createdAt", "description", "id", "imageUrl", "title", "topic", "updatedAt" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
