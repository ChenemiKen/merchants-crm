import { Database } from "../database";
import { UserEntity, UserInsertModel, userTable } from "../schemas/user.schema";
import { eq } from "drizzle-orm";


export class UserRepository {

  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(userData: UserInsertModel): Promise<UserEntity> {
    const db = this.database.getInstance();

    const newUser = await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(userTable).values({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        deletedAt: userData.deletedAt,
      }).returning();

      if (!newUser) {
        throw new Error("Failed to create user");
      }

      return newUser;
    });

    return newUser;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const db = this.database.getInstance();
    const result = await db.select().from(userTable)
      .where(eq(userTable.email, email)).limit(1);

    return result.length > 0;
  }

  async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    const db = this.database.getInstance();
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email)
    });

    return user;
  }
}
