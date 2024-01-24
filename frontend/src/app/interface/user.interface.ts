import { UserRoles } from "./user-roles.enum";

export interface UserPayload {
  name?: string,
  email?: string,
  password?: string
}

export interface UserList {
  role: UserRoles,
  _id: String,
  name: String,
  email: String,
  is_active?: boolean;
}

export interface UserUpdate {
  is_active?: Boolean,
  role: UserRoles
}
