export type UserStatus = "active" | "inactive";
export type FilterStatus = "ALL" | UserStatus;
export interface User {
  id: number;
  username: string;
  status: UserStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface UserFormValues {
  username: string;
  password?: string;       
  confirmPassword?: string; 
  status: UserStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}
