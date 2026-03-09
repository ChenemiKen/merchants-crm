import { eq, sql } from "drizzle-orm";
import { Database } from "../database";
import { merchantStatusHistory, MerchantStatusHistoryInsert } from "../schemas/merchant_status_history.schema";


export default class MerchantStatusHistoryRepository {
    private readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async create(data: MerchantStatusHistoryInsert) {
        const db = this.database.getInstance();

        return await db.transaction(async (tx) => {
            const [document] = await tx.insert(merchantStatusHistory).values({
                ...data
            }).returning();

            return document;
        });
    }


    async findByMerchantId(merchantId: string, limit: number, offset: number) {
        const db = this.database.getInstance();

        const [data, countResult] = await Promise.all([
            db.select().from(merchantStatusHistory)
                .where(eq(merchantStatusHistory.merchantId, merchantId))
                .limit(limit)
                .offset(offset)
                .orderBy(merchantStatusHistory.createdAt),
            db.select({ count: sql<number>`count(*)` })
                .from(merchantStatusHistory)
                .where(eq(merchantStatusHistory.merchantId, merchantId))
        ]);

        const total = countResult[0]?.count ?? 0;

        return {
            data,
            total: Number(total)
        };
    }
}