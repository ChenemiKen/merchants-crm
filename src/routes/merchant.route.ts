import { MerchantController } from "@/controllers/merchant.controller";
import { Database } from "@/db/database";
import MerchantRepository from "@/db/repositories/merchant.repository";
import { CreateMerchantSchema, UpdateMerchantSchema, UpdateMerchantStatusSchema } from "@/models/schemas/merchant.schema";
import { auth } from "@/middleware/auth.middleware";
import { validateRequest } from "@/middleware/validation.middleware";
import MerchantService from "@/services/merchant.service";
import { Router } from "express";

const router = Router();

const database = new Database();
const merchantRepository = new MerchantRepository(database);
const merchantService = new MerchantService(merchantRepository);
const merchantController = new MerchantController(merchantService);

router.post("/", auth, validateRequest(CreateMerchantSchema), merchantController.create)
router.get("/", auth, merchantController.fetchAll)
router.get("/:id", auth, merchantController.fetchOne)
router.patch("/:id", auth, validateRequest(UpdateMerchantSchema), merchantController.update)
router.patch("/:id/status", auth, validateRequest(UpdateMerchantStatusSchema), merchantController.updateStatus)

export default router;

