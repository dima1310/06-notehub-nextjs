export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}
export interface UpdateNoteData {
  title?: string;
  content?: string;
}
export interface CreateNoteData {
  title: string;
  content: string;
}
