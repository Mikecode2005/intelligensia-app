// src/lib/validation.ts - COMPLETE FIXED VERSION
import { z } from "zod"; // Make sure this import exists at the top

/**
 * Base string validation
 */
const requiredString = z.string().trim().min(1, "Required");

/**
 * Username validation
 * - Must be at least 3 characters
 * - Must contain only letters, numbers, underscores, and hyphens
 * - Must not contain spaces
 */
const usernameSchema = requiredString
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens"
  );

/**
 * Email validation
 */
const emailSchema = requiredString
  .email("Invalid email address")
  .max(255, "Email must be at most 255 characters");

/**
 * Password validation
 * - Must be at least 8 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 */
const passwordSchema = requiredString
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be at most 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

/**
 * Sign up form schema
 */
export const signUpSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Login form schema
 * - Username can be either username or email
 */
export const loginSchema = z.object({
  username: requiredString.min(3, "Username or email is required"),
  password: requiredString.min(1, "Password is required"),
});

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: requiredString,
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  displayName: requiredString.min(2, "Display name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

/**
 * Field selection schema
 */
export const fieldSelectionSchema = z.object({
  fields: z.array(z.string()).min(1, "Please select at least one field"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

/**
 * Post creation schema
 */
export const createPostSchema = z.object({
  content: requiredString.min(1, "Content is required").max(10000, "Content too long"),
  mediaIds: z.array(z.string()).optional().default([]),
});

/**
 * Update user profile schema
 */
export const updateUserProfileSchema = z.object({
  displayName: z.string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be at most 50 characters")
    .optional(),
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .optional(),
  bio: z.string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(''))
    .or(z.null()),
  location: z.string()
    .max(100, "Location must be at most 100 characters")
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(''))
    .or(z.null()),
}).refine(
  (data) => data.displayName || data.username || data.bio || data.avatarUrl || data.location || data.website,
  {
    message: "At least one field must be provided",
    path: ["displayName"]
  }
);

/**
 * Type exports
 */
export type SignUpValues = z.infer<typeof signUpSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetValues = z.infer<typeof passwordResetSchema>;
export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
export type FieldSelectionValues = z.infer<typeof fieldSelectionSchema>;
export type CreatePostValues = z.infer<typeof createPostSchema>;