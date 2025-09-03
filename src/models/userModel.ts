import { z } from 'zod';
//import { type UserFormValues } from '../components/users/types';

export const schemaUser = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede superar los 50 caracteres'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede superar los 100 caracteres'),
  confirmPassword: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
}).superRefine((data, ctx) => {
    if (data.password !== undefined) {
    if (!data.confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Confirma la contraseña', path: ['confirmPassword'] });
    } else if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Las contraseñas no coinciden', path: ['confirmPassword'] });
    }
  }
});


export type UserFormValues = z.infer<typeof schemaUser>;
export type SchemaUser = z.infer<typeof schemaUser>;