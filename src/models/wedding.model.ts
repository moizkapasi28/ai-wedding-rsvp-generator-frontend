import type { GenericResponse } from "./generic";

export interface Wedding {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  message: string;
  created_at: string;
  updated_at: string;
  totalGuests?: number;
  totalEvents?: number;
  confirmationRate?: number;
  tag?: string;
}

export type WeddingListResponse = GenericResponse<{
  weddings: Wedding[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>;

export type CreateOrUpdateWeddingResponse = GenericResponse<Wedding>;

export type DeletWeddingResponse = GenericResponse<{}>;
