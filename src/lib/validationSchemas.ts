import { z } from "zod";

// Sell Request Validation
export const sellRequestSchema = z.object({
  address: z
    .string()
    .trim()
    .min(10, { message: "Address must be at least 10 characters" })
    .max(500, { message: "Address must be less than 500 characters" })
    .regex(/^[a-zA-Z0-9\s,.\-/()#]+$/, { 
      message: "Address contains invalid characters" 
    }),
  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, { message: "Pincode must be exactly 6 digits" }),
});

// Brand Validation
export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Brand name is required" })
    .max(100, { message: "Brand name must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-&.]+$/, { 
      message: "Brand name contains invalid characters" 
    }),
  country: z
    .string()
    .trim()
    .max(100, { message: "Country name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s\-]+$/, { 
      message: "Country name contains invalid characters" 
    })
    .optional()
    .or(z.literal("")),
});

// Series Validation
export const seriesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Series name is required" })
    .max(100, { message: "Series name must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-+.]+$/, { 
      message: "Series name contains invalid characters" 
    }),
  brandId: z
    .string()
    .uuid({ message: "Invalid brand selection" }),
});

// Model Validation
export const modelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Model name is required" })
    .max(200, { message: "Model name must be less than 200 characters" })
    .regex(/^[a-zA-Z0-9\s\-+./()]+$/, { 
      message: "Model name contains invalid characters" 
    }),
  seriesId: z
    .string()
    .uuid({ message: "Invalid series selection" }),
  basePrice: z
    .string()
    .min(1, { message: "Price is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    })
    .refine((val) => parseFloat(val) <= 10000000, {
      message: "Price must be less than 1 crore",
    }),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional()
    .or(z.literal("")),
  sku: z
    .string()
    .trim()
    .max(100, { message: "SKU must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\-_]*$/, { 
      message: "SKU can only contain letters, numbers, hyphens, and underscores" 
    })
    .optional()
    .or(z.literal("")),
});

// File validation helper
export const validateImageFile = (file: File | null): { valid: boolean; error?: string } => {
  if (!file) return { valid: true }; // Optional
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: "Only JPEG, PNG, and WebP images are allowed" 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: "Image size must be less than 5MB" 
    };
  }
  
  return { valid: true };
};
