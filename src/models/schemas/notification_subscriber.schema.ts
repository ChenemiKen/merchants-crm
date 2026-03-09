import * as z from "zod";

// --- Notification Subscriber CRUD Schemas ---

// Create Notification Subscriber Schema
export const CreateNotificationSubscriberSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").max(255),
    url: z.string().url("Invalid notification URL").max(2048),
    secret: z.string().min(8, "Secret must be at least 8 characters long").max(255),
});

// Update Notification Subscriber Schema
export const UpdateNotificationSubscriberSchema = z.object({
    name: z.string().min(2).max(255).optional(),
    url: z.string().url("Invalid notification URL").max(2048).optional(),
    secret: z.string().min(8).max(255).optional(),
    isActive: z.boolean().optional(),
});

// Notification Subscriber Query Schema
export const NotificationSubscriberQuerySchema = z.object({
    name: z.string().optional(),
    search: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateNotificationSubscriberDto = z.infer<typeof CreateNotificationSubscriberSchema>;
export type UpdateNotificationSubscriberDto = z.infer<typeof UpdateNotificationSubscriberSchema>;
export type NotificationSubscriberQueryDto = z.infer<typeof NotificationSubscriberQuerySchema>;
