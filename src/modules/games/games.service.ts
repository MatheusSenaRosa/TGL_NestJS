import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const games = await this.prisma.game.findMany();

    return { games };
  }

  async listById(ids: number[]) {
    const games = await this.prisma.game.findMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });

    return games;
  }
}

