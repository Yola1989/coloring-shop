import { PrismaClient } from "@prisma/client";
import { books } from "../data/books";

const prisma = new PrismaClient();

async function main() {
  for (const book of books) {
    await prisma.book.upsert({
      where: { id: book.id },
      update: {},
      create: {
        title: book.title,
        price: book.price,
        cover: book.cover,
        description: book.description,
        pages: book.pages,
        age: book.age,
        preview: book.preview,
      },
    });
  }

  console.log(`Seeded ${books.length} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
