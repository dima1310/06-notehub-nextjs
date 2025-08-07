// Типи для нотаток

// Тип для тегів
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

// Інтерфейс для нотатки
export interface Note {
  id: string; // Унікальний ID — строка
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

// ✅ Новый тип для createNote
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}
