import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGameDto } from "./dtos";

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const games = await this.prisma.game.findMany();

    return { games };
  }

  async create(game: CreateGameDto) {
    const foundGame = await this.prisma.game.findUnique({
      where: {
        name: game.name,
      },
    });

    if (foundGame) throw new ConflictException("This game already exists");

    const createdGame = await this.prisma.game.create({
      data: game,
    });

    return createdGame;
  }

  async delete(gameId: number) {
    const foundGame = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!foundGame) throw new NotFoundException("Game not found");

    const deletedGame = await this.prisma.game.delete({
      where: { id: gameId },
    });

    return deletedGame;
  }
}

