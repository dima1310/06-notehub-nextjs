import NotesClient from "./Notes.client";
import { fetchNotes, type NotesResponse } from "@/lib/api";
export const dynamic = "force-dynamic";
import css from "./NotesPage.module.css";

interface NotesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";

  let initialData: NotesResponse;

  try {
    initialData = await fetchNotes(currentPage, searchQuery, 12);
  } catch (error) {
    initialData = {
      notes: [],
      totalPages: 1,
      currentPage,
    };
  }

  return (
    <main className={css.container}>
      <NotesClient initialData={initialData} />
    </main>
  );
}
