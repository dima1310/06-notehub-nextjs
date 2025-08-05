import axios from "axios";
import type {
  Note,
  CreateNoteData,
  UpdateNoteData,
  NotesResponse,
} from "@/types/note";

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
    // Створюємо параметри як об'єкт для axios
    const params: Record<string, string | number> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    // Додаємо search тільки якщо він не пустий
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }

    console.log(`Fetching notes from: ${API_BASE_URL}/notes`);
    console.log("Request params:", params);

    const response = await api.get("/notes", { params });

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  try {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching note ${id}:`, error);
    throw error;
  }
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  try {
    const response = await api.post("/notes", noteData);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const updateNote = async (
  id: number,
  noteData: UpdateNoteData
): Promise<Note> => {
  try {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error(`Error updating note ${id}:`, error);
    throw error;
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    await api.delete(`/notes/${id}`);
  } catch (error) {
    console.error(`Error deleting note ${id}:`, error);
    throw error;
  }
};
