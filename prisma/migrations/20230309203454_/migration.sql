/*
  Warnings:

  - You are about to drop the column `code` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Component` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_folderId_fkey";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "code",
DROP COLUMN "folderId",
ADD COLUMN     "ComponentFolderid" INTEGER,
ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "content" DROP NOT NULL;

-- DropTable
DROP TABLE "Folder";

-- CreateTable
CREATE TABLE "ComponentFolder" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ComponentFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ComponentFolder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ComponentFolder_title_key" ON "ComponentFolder"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_ComponentFolder_AB_unique" ON "_ComponentFolder"("A", "B");

-- CreateIndex
CREATE INDEX "_ComponentFolder_B_index" ON "_ComponentFolder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Component_title_key" ON "Component"("title");

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_ComponentFolderid_fkey" FOREIGN KEY ("ComponentFolderid") REFERENCES "ComponentFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentFolder" ADD CONSTRAINT "_ComponentFolder_A_fkey" FOREIGN KEY ("A") REFERENCES "ComponentFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentFolder" ADD CONSTRAINT "_ComponentFolder_B_fkey" FOREIGN KEY ("B") REFERENCES "ComponentFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
