-- CreateTable
CREATE TABLE "PersonInfoModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nickname" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PersonModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "personInfoId" INTEGER NOT NULL,
    CONSTRAINT "PersonModel_personInfoId_fkey" FOREIGN KEY ("personInfoId") REFERENCES "PersonInfoModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleInfoModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ArticleModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "articleInfoId" INTEGER NOT NULL,
    CONSTRAINT "ArticleModel_articleInfoId_fkey" FOREIGN KEY ("articleInfoId") REFERENCES "ArticleInfoModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlackListTokensModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonModel_email_key" ON "PersonModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PersonModel_personInfoId_key" ON "PersonModel"("personInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleModel_title_key" ON "ArticleModel"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleModel_articleInfoId_key" ON "ArticleModel"("articleInfoId");
