export type UserStatus = 'active' | 'inactive' | 'all';

export type UserType = {
  id: number;
  username: string;
  active: boolean;
};
