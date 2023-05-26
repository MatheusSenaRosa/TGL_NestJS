import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { IFindUnique } from "./types";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(attributes: IFindUnique) {
    const role = await this.prisma.role.findUnique({
      where: attributes,
    });

    return role;
  }
}

