import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { notFound } from "next/navigation";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  // id це вже string, не потрібно конвертувати в число
  if (!id || id.trim() === "") {
    notFound();
  }

  const queryClient = new QueryClient();

  try {
    // Prefetch даних на сервері для гідратації на клієнті
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
      staleTime: 5 * 60 * 1000, // 5 хвилин
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
