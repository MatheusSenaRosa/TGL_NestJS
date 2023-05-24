/*
  Warnings:

  - Added the required column `updatedAt` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "choosenNumbers" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("choosenNumbers", "gameId", "id", "userId") SELECT "choosenNumbers", "gameId", "id", "userId" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
CREATE TABLE "new_games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "range" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "requiredAmount" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_games" ("color", "description", "id", "name", "price", "range", "requiredAmount") SELECT "color", "description", "id", "name", "price", "range", "requiredAmount" FROM "games";
DROP TABLE "games";
ALTER TABLE "new_games" RENAME TO "games";
CREATE UNIQUE INDEX "games_name_key" ON "games"("name");
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("email", "hashedRefreshToken", "id", "name", "password") SELECT "email", "hashedRefreshToken", "id", "name", "password" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
