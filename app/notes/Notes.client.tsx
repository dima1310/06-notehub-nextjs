"use client"; 

import { useState } from "react";
import NoteList from "@/components/NoteList/NoteList";
import NoteSearch from "@/components/SearchBox/SearchBox";
import NotePagination from "@/components/Pagination/Pagination";
import type { NotesResponse } from "@/types/note";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
  initialData: NotesResponse;
}

export default function NotesClient({
  initialPage,
  initialSearch,
  initialData,
}: NotesClientProps) {
  const [data, setData] = useState<NotesResponse>(initialData);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
  };

  return (
    <div>
      <h1>Notes</h1>
      <NoteSearch initialValue={searchQuery} onSearch={handleSearch} />
      <NoteList notes={data.notes} />
      <NotePagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}