import { eq } from "drizzle-orm";
import { Database } from "../database";
import { RefreshTokenEntity, refreshTokensTable } from "../schemas/refresh_token.schema";


export class RefreshTokenRepository {
    private database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async create(userId: string, token: string, expiresAt: Date): Promise<RefreshTokenEntity | undefined> {
        const db = this.database.getInstance();
        return await db.transaction(async (tx) => {
            const [refreshToken] = await tx.insert(refreshTokensTable).values({
                userId: userId,
                token: token,
                expiresAt: expiresAt,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();

            return refreshToken;
        });
    }

    async findByTokenHash(tokenHash: string) {
        const db = this.database.getInstance();
        const refreshToken = await db.query.refreshTokensTable.findFirst({
            where: eq(refreshTokensTable.token, tokenHash),
            with: {
                user: true
            }
        });

        return refreshToken;
    }

    async update(id: string, data: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity | undefined> {
        const db = this.database.getInstance();
        const [updatedToken] = await db.update(refreshTokensTable)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(refreshTokensTable.id, id))
            .returning();

        return updatedToken;
    }

}