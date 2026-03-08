import { User } from "@/domain/models/entities/user.entity";
import { Database } from "../database";
import { UserEntity, userTable } from "../schemas/user.schema";
import { eq } from "drizzle-orm";


export class UserRepository {

  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(userData: User): Promise<User> {
    const db = this.database.getInstance();

    const newUser = await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(userTable).values({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        deletedAt: userData.deletedAt,
      }).returning();

      return newUser;
    });

    return this.toUser(newUser!);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const db = this.database.getInstance();
    const result = await db.select().from(userTable)
      .where(eq(userTable.email, email)).limit(1);

    return result.length > 0;
  }

  private toUser(user: UserEntity): User {
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }

  // async findUserByEmail(email: string) {
  //   return this.prisma.user.findUnique({
  //     where: { email },
  //     select: {
  //       id: true,
  //       password: true,
  //       role: { select: { name: true } },
  //     },
  //   });
  // }

  // async findUserById(userId: string) {
  //   return this.prisma.user.findUnique({
  //     where: { id: userId },
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       email: true,
  //     },
  //   });
  // }

  // async createUser(data: { email: string; password: string; firstName: string }) {
  //   return this.prisma.user.create({
  //     data,
  //     select: {
  //       id: true,
  //       role: { select: { name: true } },
  //     },
  //   });
  // }
}
