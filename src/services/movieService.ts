import axios from "axios";
import { type Movie } from "../types/movie";

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: "application/json",
  },
});

// ДОДАЛИ: функція тепер приймає другий параметр - page (за замовчуванням 1)
export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<TMDBResponse> => {
  const response = await apiClient.get<TMDBResponse>("/search/movie", {
    params: {
      query: query,
      include_adult: false,
      language: "en-US",
      page: page,
    },
  });

  return response.data;
};
