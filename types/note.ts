export interface Note {
  id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNoteData {
  title: string;
  text: string;
}

export interface UpdateNoteData extends CreateNoteData {
  id: string;
}

export interface NotesSearchParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
