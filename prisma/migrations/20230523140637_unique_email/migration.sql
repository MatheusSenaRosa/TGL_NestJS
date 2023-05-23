/*
  Warnings:

  - You are about to drop the column `price` on the `bets` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "choosenNumbers" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    CONSTRAINT "bets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("choosenNumbers", "gameId", "id", "userId") SELECT "choosenNumbers", "gameId", "id", "userId" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
