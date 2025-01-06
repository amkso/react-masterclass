const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjZhMzgzOTY1M2FlMWM4N2FlZTUyNDliZDliMmZjYiIsIm5iZiI6MTczNDMyNTc0NS44NDUsInN1YiI6IjY3NWZiNWYxZDZmNWU4NDU4YjhiNThlMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o4QYEwzPdbUyZXdjmthfUeKBq86BQ7sdoonoZzS4J9M",
  },
};

export function getMovies({
  type,
}: {
  type: "now_playing" | "popular" | "top_rated" | "upcoming";
}) {
  return fetch(`${BASE_PATH}/movie/${type}?language=ko&page=1`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
}
