export interface ICardItem {
  name: string;
  description: string;
  language: string;
  star: number;
  fork: number;
}

export interface User {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email_address: string;
  username?: string;
  phone_number?: string;
  date_of_birth?: string;
  total_balance?: number;
  total_returns?: number;
}

export interface SavingPlan {
  id: string;
  created_at: string;
  plan_name: string;
  invested_amount: number;
  total_returns: number;
  target_amount: number;
  maturity_date: string;
  user_id: string;
}
