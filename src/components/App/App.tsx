import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginatePkg from "react-paginate";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";
import css from "./App.module.css";

const ReactPaginate =
  (ReactPaginatePkg as unknown as { default: typeof ReactPaginatePkg })
    .default || ReactPaginatePkg;

const App = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0 && !isFetching) {
      toast.error("Sorry, no movies found for your request.", {
        duration: 3000,
      });
    }
  }, [isSuccess, movies.length, isFetching]);

  const handleSearch = (newQuery: string) => {
    if (newQuery === searchQuery) return;
    setSearchQuery(newQuery);
    setPage(1);
  };

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}

      {selectedMovie && (
        <MovieModal
          isOpen={!!selectedMovie}
          movie={selectedMovie}
          onClose={closeModal}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
