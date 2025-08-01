import axios from "axios";
import {
  Note,
  NotesResponse,
  CreateNoteData,
  NotesSearchParams,
} from "@/types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const notesApi = {
  // Получить список заметок с пагинацией и поиском
  async getNotes(params: NotesSearchParams = {}): Promise<NotesResponse> {
    const { page = 1, perPage = 12, search = "" } = params;
    const response = await api.get("/notes", {
      params: {
        page,
        per_page: perPage,
        ...(search && { search }),
      },
    });

    return {
      notes: response.data.results,
      total: response.data.total,
      totalPages: response.data.total_pages,
      page: response.data.page,
      perPage: response.data.per_page,
    };
  },

  // Получить заметку по ID
  async getNoteById(id: string): Promise<Note> {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Создать новую заметку
  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await api.post("/notes", data);
    return response.data;
  },

  // Удалить заметку
  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};

// Додаткові функції для сумісності з іншими компонентами
export const fetchNotes = notesApi.getNotes;
export const fetchNoteById = notesApi.getNoteById;
export const createNote = notesApi.createNote;
export const deleteNote = notesApi.deleteNote;
