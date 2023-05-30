import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGamesDto, UpdateGameDto } from "./dtos";
import { IFormatGamesPrices } from "./types";

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  formatGamesPrices(games: IFormatGamesPrices[] | IFormatGamesPrices) {
    const isArray = Array.isArray(games);

    if (isArray) {
      const formattedGames = games.map((item) => ({
        ...item,
        price: Number(item.price),
      }));

      return formattedGames;
    }

    return {
      ...games,
      price: Number(games.price),
    };
  }

  async list() {
    const games = await this.prisma.game.findMany();

    const formattedGames = this.formatGamesPrices(games);

    return { games: formattedGames };
  }

  async findManyByIds(ids: number[]) {
    const games = await this.prisma.game.findMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });

    return games;
  }

  async createMany({ games }: CreateGamesDto) {
    for (let i = 0; i < games.length; i++) {
      const foundGame = await this.prisma.game.findUnique({
        where: { name: games[i].name },
      });

      if (foundGame)
        throw new ConflictException(`${games[i].name} already exists`);
    }

    const { count } = await this.prisma.game.createMany({
      data: games,
    });

    return {
      message: `${count} game${count > 1 ? "s" : ""} has been created`,
    };
  }

  async removeMany(ids: number[]) {
    for (let i = 0; i < ids.length; i++) {
      const foundGame = await this.prisma.game.findUnique({
        where: { id: ids[i] },
      });

      if (!foundGame) throw new NotFoundException(`gameId ${ids[i]} not found`);
    }

    await this.prisma.game.deleteMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });

    return;
  }

  async update(gameId: number, attributes: UpdateGameDto) {
    const game = await this.prisma.game.update({
      where: {
        id: gameId,
      },
      data: attributes,
    });

    const updatedGame = this.formatGamesPrices(game);

    return updatedGame;
  }
}
