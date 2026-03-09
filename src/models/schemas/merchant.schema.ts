import * as z from "zod";

// --- Enums ---
export const MerchantStatusEnum = z.enum(["PENDING_KYB", "ACTIVE", "SUSPENDED"]);
export const DocumentTypeEnum = z.enum([
    "BUSINESS_REGISTRATION",
    "OWNER_ID",
    "BANK_ACCOUNT_PROOF"
]);

// --- Merchant CRUD Schemas ---

// Create Merchant Schema
export const CreateMerchantSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").max(255),
    category: z.string().min(2, "Category must be at least 2 characters long").max(255),
    city: z.string().min(2, "City must be at least 2 characters long").max(255),
    contactEmail: z.string().email("Invalid email format").max(255),
    status: MerchantStatusEnum.optional(),
});

// Update Merchant Schema (all fields optional)
export const UpdateMerchantSchema = z.object({
    name: z.string().min(2).max(255).optional(),
    category: z.string().min(2).max(255).optional(),
    city: z.string().min(2).max(255).optional(),
    contactEmail: z.string().email("Invalid file URL").max(255).optional(),
    status: MerchantStatusEnum.optional(),
});

// Create Merchant Document Schema
export const CreateMerchantDocumentSchema = z.object({
    merchantId: z.string().uuid("Invalid merchant ID"),
    type: DocumentTypeEnum,
    fileUrl: z.string().url("Invalid file URL"),
});

// Update Merchant Document Schema (e.g., verifying)
export const UpdateMerchantDocumentSchema = z.object({
    verified: z.boolean().optional(),
    fileUrl: z.string().url("Invalid file URL").optional(),
});

// Update Merchant Status Schema
export const UpdateMerchantStatusSchema = z.object({
    status: MerchantStatusEnum,
    reason: z.string().min(2, "Please provide a reason").optional(),
});

// Merchant Query Schema (for list/search/filter)
export const MerchantQuerySchema = z.object({
    search: z.string().optional(),
    status: MerchantStatusEnum.optional(),
    category: z.string().optional(),
    city: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Types
export type CreateMerchantDto = z.infer<typeof CreateMerchantSchema>;
export type UpdateMerchantDto = z.infer<typeof UpdateMerchantSchema>;
export type CreateMerchantDocumentDto = z.infer<typeof CreateMerchantDocumentSchema>;
export type UpdateMerchantDocumentDto = z.infer<typeof UpdateMerchantDocumentSchema>;
export type UpdateMerchantStatusDto = z.infer<typeof UpdateMerchantStatusSchema>;
export type MerchantQueryDto = z.infer<typeof MerchantQuerySchema>;
