import * as z from "zod";

//password schema
const PasswordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .refine(password => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
    })
    .refine(password => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
    })
    .refine(password => /[0-9]/.test(password), { message: "Password must contain at least one number" })
    .refine(password => /[!@#$%^&*]/.test(password), {
        message: "Password must contain at least one special character",
    });


// Signup schema
export const SignupSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters long' })
        .nonempty({ message: 'First name is required' }),
    email: z
        .email({ message: 'Invalid email format' })
        .nonempty({ message: 'Email is required' }),
    password: PasswordSchema,
    password2: z.string().nonempty({ message: 'Password2 is required' }),
}).superRefine((data, ctx) => {
    if (data.password !== data.password2) {
        ctx.addIssue({
            code: 'custom',
            path: ['password2'],
            message: 'Passwords do not match',
        });
    }
});


// Login schema
export const LoginSchema = z.object({
    email: z
        .email({ message: 'Invalid email format' })
        .nonempty({ message: 'Email is required' }),
    password: z.string().nonempty({ message: 'Password is required' }),
});