import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBetsDto } from "./dtos";

@Injectable()
export class BetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBetsDto) {
    const gameIds = data.bets.reduce((acc: number[], currentGame) => {
      const isAlreadyIncluded = acc.includes(currentGame.gameId);
      if (isAlreadyIncluded) return acc;

      return [...acc, currentGame.gameId];
    }, []);

    const prices: number[] = [];

    for (let i = 0; i < gameIds.length; i++) {
      const currentGameId = gameIds[i];

      const foundGame = await this.prisma.game.findUnique({
        where: {
          id: currentGameId,
        },
      });

      if (!foundGame)
        throw new BadRequestException(`gameId ${gameIds[i]} does not exist`);

      const betsWithCurrentId = data.bets.filter(
        (bet) => bet.gameId === currentGameId
      );

      betsWithCurrentId.forEach((bet) => {
        const isBetValid =
          bet.choosenNumbers.length === foundGame.requiredAmount;

        if (!isBetValid)
          throw new BadRequestException(
            `gameId ${currentGameId} must have ${foundGame.requiredAmount} choosenNumbers`
          );
      });

      prices.push(Number(foundGame.price));
    }

    const totalPrice = prices.reduce((acc: number, cur) => acc + cur, 0);

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

