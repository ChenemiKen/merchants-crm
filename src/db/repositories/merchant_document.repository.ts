import { CreateMerchantDocumentDto, UpdateMerchantDocumentDto } from "@/models/schemas/merchant.schema";
import { Database } from "../database";
import { and, eq } from "drizzle-orm";
import { MerchantDocumentEntity, merchantDocuments } from "../schemas/merchant_document.schema";


export default class MerchantDocumentRepository {
    private readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async create(merchantId: string, merchantData: CreateMerchantDocumentDto) {
        const db = this.database.getInstance();

        return await db.transaction(async (tx) => {
            const [document] = await tx.insert(merchantDocuments).values({
                merchantId,
                type: merchantData.type,
                fileUrl: merchantData.fileUrl,
            }).returning();

            return document;
        });
    }

    async fetchByMerchantId(merchantId: string) {
        const db = this.database.getInstance();
        return await db.query.merchantDocuments.findMany({
            where: eq(merchantDocuments.merchantId, merchantId)
        });
    }

    async findByMerchantIdAndType(merchantId: string, type: CreateMerchantDocumentDto['type']) {
        const db = this.database.getInstance();
        return await db.query.merchantDocuments.findFirst({
            where: and(
                eq(merchantDocuments.merchantId, merchantId),
                eq(merchantDocuments.type, type)
            )
        });
    }

    async fetchOne(documentId: string) {
        const db = this.database.getInstance();
        return await db.query.merchantDocuments.findFirst({
            where: eq(merchantDocuments.id, documentId)
        });
    }

    async update(documentId: string, data: Partial<MerchantDocumentEntity>) {
        const db = this.database.getInstance();

        const [updated] = await db
            .update(merchantDocuments)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(merchantDocuments.id, documentId))
            .returning();

        return updated;
    }
}