// Shared types for conference-related components

export interface Ticket {
  id: number;
  name: string;
  member_price: number;
  non_member_price: number;
  currency: string;
  category_till_date: string | null;
  category_after_date: string | null;
  mapping_id: number;
  sort_order: number;
}

export interface Category {
  id: number;
  name: string;
  is_residential: number;
  sort_order: number;
  tickets: Ticket[];
}

export interface Module {
  id: number;
  module_name: string;
  description: string;
  categories: Category[];
}

export interface EventMapping {
  id: number;
  event_name: string;
  description: string;
  start_date: string;
  end_date: string;
  modules: Module[];
}

// Membership type constants
export const MEMBERSHIP_TYPES = {
  MEMBER: 'member',
  NON_MEMBER: 'non_member',
} as const;

