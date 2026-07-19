import z from "zod";

export const CreateCompanySchema = z.object({
  companyName: z.string().min(3).max(100),
  website: z.url().optional(),
  logoUrl: z.url().optional(),
});
export type CreateCompanyRequest = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = CreateCompanySchema.partial().extend({
  companyId: z.string(),
});
export type UpdateCompanyRequest = z.infer<typeof UpdateCompanySchema>;

export const DeleteCompanySchema = z.object({
  companyId: z.string(),
});
export type DeleteCompanyRequest = z.infer<typeof DeleteCompanySchema>;

export const GetCompanySchema = z.object({
  companyId: z.string(),
});
export type GetCompanyRequest = z.infer<typeof GetCompanySchema>;
