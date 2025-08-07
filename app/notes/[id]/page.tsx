import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { notFound } from "next/navigation";
import NoteDetailsClient from "./NoteDetailsClient";

// Правильная типизация для Next.js 15 App Router
interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  // Ожидаем разрешения Promise для получения параметров
  const { id } = await params;

  // Валидация ID
  if (!id || typeof id !== "string" || id.trim() === "") {
    notFound();
  }

  const queryClient = new QueryClient();

  try {
    // Prefetch данных на сервере для гидратации на клиенте
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
      staleTime: 5 * 60 * 1000, // 5 минут
    });
  } catch (error) {
    console.error("Error prefetching note:", error);
    notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
