export type UserStatus = 'activo' | 'inactivo';

export interface UserType {
  id: number;
  username: string;
  status: UserStatus;
}

export interface UserFormValues {
  username: string;
  password: string;
  confirmPassword?: string;
  status?: UserStatus;
}

export type UserFilterStatusType = 'all' | UserStatus;
export type UserActionState = 'create' | 'edit';
