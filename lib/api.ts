import axios from "axios";
import type {
  Note,
  CreateNoteData,
  UpdateNoteData,
  NotesResponse,
} from "@/types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async (
  page = 1,
  search = "",
  limit = 12
): Promise<NotesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  const response = await api.get(`/notes?${params}`);
  return response.data;
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await api.post("/notes", noteData);
  return response.data;
};

export const updateNote = async (
  id: number,
  noteData: UpdateNoteData
): Promise<Note> => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notes/${id}`);
};
