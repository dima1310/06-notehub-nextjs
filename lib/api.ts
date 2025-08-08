import type { Note, CreateNotePayload } from "@/types/note";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function getNotes(): Promise<Note[]> {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notes: ${response.status}`);
  }

  return response.json();
}

// Get a single note by ID
export async function getNoteById(id: string): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Note not found");
    }
    throw new Error(`Failed to fetch note: ${response.status}`);
  }

  return response.json();
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create note: ${response.status}`
    );
  }

  return response.json();
}

export async function updateNote(
  id: string,
  payload: Partial<CreateNotePayload>
): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update note: ${response.status}`
    );
  }

  return response.json();
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Note not found");
    }
    throw new Error(`Failed to delete note: ${response.status}`);
  }
}
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    })
);
