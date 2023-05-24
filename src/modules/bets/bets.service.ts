import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBetsDto } from "./dtos";
import { Bet, BetJoinedWithGame } from "./types";
import { Game } from "@prisma/client";

@Injectable()
export class BetsService {
  constructor(private readonly prisma: PrismaService) {}

  formatToGamesIdsArray(bets: Bet[]) {
    const gameIds = bets.reduce((acc: number[], currentGame) => {
      const isAlreadyIncluded = acc.includes(currentGame.gameId);
      if (isAlreadyIncluded) return acc;

      return [...acc, currentGame.gameId];
    }, []);

    return gameIds;
  }

  findInvalidBet(betsJoinedWithGames: BetJoinedWithGame[]) {
    const foundInvalidBet = betsJoinedWithGames.find(
      (item) => item.choosenNumbers.length !== item.requiredAmount
    );

    return foundInvalidBet;
  }

  joinBetsWithGames(bets: Bet[], games: Game[]) {
    const betsJoinedWithGames = bets.map((bet) => {
      const game = games.find((item) => item.id === bet.gameId);

      if (!game)
        throw new BadRequestException(`gameId ${bet.gameId} does not exist`);

      return {
        ...bet,
        price: Number(game.price),
        requiredAmount: Number(game.requiredAmount),
      };
    });

    return betsJoinedWithGames;
  }

  formatTotalPrice(betsJoinedWithGames: BetJoinedWithGame[]) {
    const total = betsJoinedWithGames.reduce(
      (acc: number, cur) => acc + cur.price,
      0
    );

    return total;
  }

  async create(data: CreateBetsDto) {
    const gamesIds = this.formatToGamesIdsArray(data.bets);

    const games = await this.prisma.game.findMany({
      where: {
        OR: gamesIds.map((id) => ({ id })),
      },
    });

    const invalidGameId = games.find((game) => !gamesIds.includes(game.id));
    if (invalidGameId)
      throw new BadRequestException(`gameId ${invalidGameId} does not exist`);

    const betsJoinedWithGames = this.joinBetsWithGames(data.bets, games);

    const invalidBet = this.findInvalidBet(betsJoinedWithGames);
    if (invalidBet)
      throw new BadRequestException(
        `gameId ${invalidBet.gameId} must have ${invalidBet.requiredAmount} choosenNumbers`
      );

    const totalPrice = this.formatTotalPrice(betsJoinedWithGames);
    if (totalPrice < 1)
      throw new BadRequestException("Total price must be greater than $30.00");

    const bets = [];

    for (let i = 0; i < data.bets.length; i++) {
      const currentGame = data.bets[i];
      const newBet = await this.prisma.bet.create({
        data: {
          userId: data.userId,
          gameId: currentGame.gameId,
          choosenNumbers: currentGame.choosenNumbers.join(", "),
        },
      });

      bets.push(newBet);
    }

    return { bets };
  }
}

