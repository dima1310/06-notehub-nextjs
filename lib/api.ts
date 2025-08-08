import axios from "axios";
import type { Note, NoteTag } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`, // Исправлены кавычки
  },
});

export async function fetchNotes({
  page = 1,
  search = "",
}: {
  page?: number;
  search?: string;
}): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: { page, search },
  });
  return response.data;
}

export const getNotes = fetchNotes;

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: number | string): Promise<void> {
  await api.delete(`/notes/${id}`);
}

export async function fetchNoteById(id: number | string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export const getNoteById = fetchNoteById;
