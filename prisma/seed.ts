import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const games = [
    {
      name: "Lotofácil",
      description:
        "Escolha 15 números para apostar na lotofácil. Você ganha acertando 11, 12, 13, 14 ou 15 números. São muitas chances de ganhar, e agora você joga de onde estiver!",
      range: 25,
      price: 2.5,
      requiredAmount: 15,
      color: "#7F3992",
    },
    {
      name: "Mega-Sena",
      description:
        "Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.",
      range: 60,
      price: 4.5,
      requiredAmount: 6,
      color: "#01AC66",
    },
    {
      name: "Quina",
      description:
        "Escolha 5 números dos 80 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 80,
      price: 2,
      requiredAmount: 5,
      color: "#F79C31",
    },
  ];

  const roles = [
    {
      name: "Administrator",
    },
    {
      name: "Customer",
    },
  ];

  const users = [
    {
      name: "Matheus Admin",
      email: "admin@gmail.com",
      password: "$2b$10$n07brVRslNCypsIabR7jnuG5AzOdYZE47vd/Fwx/10JBxViRg2kfm",
      roleId: 1,
    },
  ];

  await Promise.all([
    prisma.game.createMany({
      data: games,
    }),
    prisma.role.createMany({
      data: roles,
    }),
    prisma.user.createMany({
      data: users,
    }),
  ]);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
