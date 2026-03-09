import { Database } from "@/db/database";
import { CreateMerchantDocumentSchema, UpdateMerchantDocumentSchema } from "@/models/schemas/merchant.schema";
import { auth } from "@/middleware/auth.middleware";
import { validateRequest } from "@/middleware/validation.middleware";
import { Router } from "express";
import MerchantDocumentRepository from "@/db/repositories/merchant_document.repository";
import MerchantDocumentService from "@/services/merchant_document.service";
import { MerchantDocumentController } from "@/controllers/merchant_document.controller";
import MerchantService from "@/services/merchant.service";
import MerchantRepository from "@/db/repositories/merchant.repository";

const router = Router();

const database = new Database();
const merchantDocumentRepository = new MerchantDocumentRepository(database);
const merchantRepository = new MerchantRepository(database);
const merchantService = new MerchantService(merchantRepository);
const merchantDocumentService = new MerchantDocumentService(merchantDocumentRepository, merchantService);
const merchantDocumentController = new MerchantDocumentController(merchantDocumentService);

router.post("/:merchantId/documents", auth, validateRequest(CreateMerchantDocumentSchema), merchantDocumentController.create)
router.get("/:merchantId/documents", auth, merchantDocumentController.fetchByMerchantId)
router.patch("/documents/:id", auth, validateRequest(UpdateMerchantDocumentSchema), merchantDocumentController.update)
router.get("/documents/:id", auth, merchantDocumentController.fetchOne)
router.patch("/documents/:id/verify", auth, merchantDocumentController.verify)

export default router;

