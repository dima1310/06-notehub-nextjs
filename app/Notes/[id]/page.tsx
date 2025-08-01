import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/Lib/api";
import { NoteDetailsClient } from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const noteId = params.id;

  // Створюємо новий QueryClient для серверного рендерингу
  const queryClient = new QueryClient();

  try {
    // Prefetch даних на сервері
    await queryClient.prefetchQuery({
      queryKey: ["note", noteId],
      queryFn: () => fetchNoteById(noteId),
    });
  } catch (error) {
    // Якщо помилка при prefetch, продовжуємо рендер
    console.error("Failed to prefetch note:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
