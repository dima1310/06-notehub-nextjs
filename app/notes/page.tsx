import { fetchNotes } from "@/lib/api";
import NotesClient from "@/app/notes/Notes.client";
import type { NotesResponse } from "@/types/note";

interface NotesPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const searchQuery = searchParams.search || "";

  let initialData: NotesResponse;

  try {
    initialData = await fetchNotes(currentPage, searchQuery, 12);
  } catch (error) {
    console.error("Error fetching notes on server:", error);

    initialData = {
      notes: [],
      totalPages: 1,
      currentPage: 1,
    };
  }

  return (
    <NotesClient
      initialPage={currentPage}
      initialSearch={searchQuery}
      initialData={initialData}
    />
  );
}
