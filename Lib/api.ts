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

api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    console.log("Request params:", config.params);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.message);
    console.error("Error config:", error.config);
    return Promise.reject(error);
  }
);

export const notesApi = {
  async getNotes(params: NotesSearchParams = {}): Promise<NotesResponse> {
    const { page = 1, perPage = 12, search = "" } = params;

    try {
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
    } catch (error) {
      console.error("Error in getNotes:", error);
      throw error;
    }
  },

  async getNoteById(id: string): Promise<Note> {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in getNoteById:", error);
      throw error;
    }
  },

  async createNote(data: CreateNoteData): Promise<Note> {
    try {
      const response = await api.post("/notes", data);
      return response.data;
    } catch (error) {
      console.error("Error in createNote:", error);
      throw error;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      await api.delete(`/notes/${id}`);
    } catch (error) {
      console.error("Error in deleteNote:", error);
      throw error;
    }
  },
};

export const fetchNotes = notesApi.getNotes;
export const fetchNoteById = notesApi.getNoteById;
export const createNote = notesApi.createNote;
export const deleteNote = notesApi.deleteNote;
