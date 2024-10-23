/*
  Warnings:

  - You are about to drop the column `option3` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `option3Checked` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `option4` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `option4Checked` on the `Question` table. All the data in the column will be lost.

*/
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
    "option1Checked" BOOLEAN NOT NULL DEFAULT false,
    "option2Checked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Question_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("id", "option1", "option1Checked", "option2", "option2Checked", "order", "templateId", "text", "type") SELECT "id", "option1", "option1Checked", "option2", "option2Checked", "order", "templateId", "text", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
