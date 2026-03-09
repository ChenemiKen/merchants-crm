import { CreateMerchantDto, MerchantQueryDto } from "@/models/schemas/merchant.schema";
import { Database } from "../database";
import { MerchantEntity, merchants, merchantStatusEnum } from "../schemas/merchant.schema";
import { and, ilike, eq, or, SQL, count } from "drizzle-orm";


export default class MerchantRepository {
    private readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async create(merchantData: CreateMerchantDto) {
        const db = this.database.getInstance();

        return await db.transaction(async (tx) => {
            const [merchant] = await tx.insert(merchants).values({
                name: merchantData.name,
                category: merchantData.category,
                city: merchantData.city,
                contactEmail: merchantData.contactEmail,
                status: merchantStatusEnum.enumValues[0]
            }).returning();

            return merchant;
        });
    }

    async fetchAll(query: MerchantQueryDto) {
        const db = this.database.getInstance();

        const { search, status, category, city, page = 1, limit = 20 } = query;
        const offset = (page - 1) * limit;

        const filters: SQL[] = [];

        if (search) {
            filters.push(
                or(
                    ilike(merchants.name, `%${search}%`),
                    ilike(merchants.contactEmail, `%${search}%`),
                    ilike(merchants.city, `%${search}%`)
                )!
            );
        }

        if (status) {
            filters.push(eq(merchants.status, status));
        }

        if (category) {
            filters.push(ilike(merchants.category, `%${category}%`));
        }

        if (city) {
            filters.push(ilike(merchants.city, `%${city}%`));
        }

        const where = filters.length > 0 ? and(...filters) : undefined;

        const [data, totalResult] = await Promise.all([
            db.select().from(merchants).where(where).limit(limit).offset(offset),
            db.select({ total: count() }).from(merchants).where(where),
        ]);

        const total = totalResult[0]?.total ?? 0;

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    async fetchOne(merchantId: string) {
        const db = this.database.getInstance();
        return await db.query.merchants.findFirst({
            where: eq(merchants.id, merchantId)
        });
    }

    async update(merchantId: string, data: Partial<MerchantEntity>) {
        const db = this.database.getInstance();

        const [updated] = await db
            .update(merchants)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(merchants.id, merchantId))
            .returning();

        return updated;
    }
}