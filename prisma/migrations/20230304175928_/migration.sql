-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "folderId" INTEGER,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Svg" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Svg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteFolder" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "NoteFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "noteFolderId" INTEGER,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NoteFolder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NoteFolder_title_key" ON "NoteFolder"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Note_title_key" ON "Note"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_NoteFolder_AB_unique" ON "_NoteFolder"("A", "B");

-- CreateIndex
CREATE INDEX "_NoteFolder_B_index" ON "_NoteFolder"("B");

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_noteFolderId_fkey" FOREIGN KEY ("noteFolderId") REFERENCES "NoteFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteFolder" ADD CONSTRAINT "_NoteFolder_A_fkey" FOREIGN KEY ("A") REFERENCES "NoteFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteFolder" ADD CONSTRAINT "_NoteFolder_B_fkey" FOREIGN KEY ("B") REFERENCES "NoteFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
