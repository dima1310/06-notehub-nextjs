import axios from "axios";
import type { Note, CreateNoteData, UpdateNoteData } from "@/types/note";

// Перенесено NotesResponse в api.ts згідно з вимогами
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}

const API_BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

console.log("API Configuration:");
console.log("API_BASE_URL:", API_BASE_URL);
console.log("TOKEN exists:", !!TOKEN);
console.log("TOKEN length:", TOKEN?.length || 0);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  page = 1,
  search = "",
  limit = 12
): Promise<NotesResponse> => {
  try {
    console.log(`Fetching notes from: ${API_BASE_URL}/notes`);
    console.log("Request params:", { page, search, limit });

    // Перевіряємо чи токен існує
    if (!TOKEN) {
      throw new Error("API token is not configured");
    }

    // Створюємо параметри
    const params: Record<string, string | number> = {
      page: page.toString(),
      perPage: limit.toString(),
    };

    // Додаємо search тільки якщо він не пустий
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }

    const response = await api.get("/notes", { params });

    console.log("API Response:", response.data);

    // Якщо API повертає дані у форматі масиву, обробляємо це
    if (Array.isArray(response.data)) {
      return {
        notes: response.data,
        totalPages: 1,
        currentPage: 1,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);

    // Детальне логування для діагностики
    if (axios.isAxiosError(error)) {
      console.error("Axios Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    }

    // Повертаємо порожні дані замість викидання помилки під час build
    return {
      notes: [],
      totalPages: 1,
      currentPage: page,
    };
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    // Виправлено: додано явний дженерик для типізації відповіді
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching note ${id}:`, error);
    throw error;
  }
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  try {
    // Виправлено: додано явний дженерик для типізації відповіді
    const response = await api.post<Note>("/notes", noteData);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const updateNote = async (
  id: string,
  noteData: UpdateNoteData
): Promise<Note> => {
  try {
    // Виправлено: змінено PUT на PATCH згідно зі специфікацією API
    const response = await api.patch<Note>(`/notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error(`Error updating note ${id}:`, error);
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    // Виправлено: тепер повертає об'єкт видаленої нотатки
    const response = await api.delete<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting note ${id}:`, error);
    throw error;
  }
};
