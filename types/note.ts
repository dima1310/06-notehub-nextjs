export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: number;
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
  tag?: NoteTag;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag; //
}
