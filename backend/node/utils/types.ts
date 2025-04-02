import { Request } from "express";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  domain: string;
  permissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
