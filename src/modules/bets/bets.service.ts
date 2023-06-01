import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBetsDto } from "./dtos";
import { IBet, IBetJoinedWithGame } from "./types";
import { GamesService } from "../games/games.service";

@Injectable()
export class BetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamesService: GamesService
  ) {}

  formatBetsToGamesIdArray(bets: IBet[]) {
    const gameIds = bets.reduce((acc: number[], currentGame) => {
      const isAlreadyIncluded = acc.includes(currentGame.gameId);
      if (isAlreadyIncluded) return acc;

      return [...acc, currentGame.gameId];
    }, []);

    return gameIds;
  }

  formatTotalPrice(betsJoinedWithGames: IBetJoinedWithGame[]) {
    const total = betsJoinedWithGames.reduce(
      (acc: number, cur) => acc + cur.price,
      0
    );

    return total;
  }

  validateRequiredAmounts(betsJoinedWithGames: IBetJoinedWithGame[]) {
    const foundInvalidBet = betsJoinedWithGames.find(
      (item) => item.choosenNumbers.length !== item.requiredAmount
    );

    return foundInvalidBet;
  }

  async joinBetsWithGames(bets: IBet[]) {
    const gamesIds = this.formatBetsToGamesIdArray(bets);
    const games = await this.gamesService.findManyByIds(gamesIds);

    const betsJoinedWithGames = bets.map((bet) => {
      const game = games.find((item) => item.id === bet.gameId);

      if (!game)
        throw new BadRequestException(`gameId ${bet.gameId} does not exist`);

      return {
        ...bet,
        name: game.name,
        price: Number(game.price),
        requiredAmount: Number(game.requiredAmount),
      };
    });

    return betsJoinedWithGames;
  }

  async createMany(userId: number, data: CreateBetsDto) {
    const betsJoinedWithGames = await this.joinBetsWithGames(data.bets);

    const invalidBet = this.validateRequiredAmounts(betsJoinedWithGames);
    if (invalidBet)
      throw new BadRequestException(
        `gameId ${invalidBet.gameId} must have ${invalidBet.requiredAmount} choosenNumbers`
      );

    const totalPrice = this.formatTotalPrice(betsJoinedWithGames);
    if (totalPrice < 1)
      throw new BadRequestException("Total price must be greater than $30.00");

    const { count } = await this.prisma.bet.createMany({
      data: data.bets.map((item) => ({
        userId: userId,
        gameId: item.gameId,
        choosenNumbers: item.choosenNumbers.join(", "),
      })),
    });

    return { message: `${count} bet${count > 1 ? "s" : ""} has been created` };
  }

  async list(userId: number) {
    const storedBets = await this.prisma.bet.findMany({
      select: {
        id: true,
        choosenNumbers: true,
        game: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      where: {
        userId: userId,
      },
    });

    const bets = storedBets.map((item) => ({
      ...item,
      game: { ...item.game, price: Number(item.game.price) },
    }));

    return { bets };
  }
}
