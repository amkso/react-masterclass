const BASE_PATH = "https://api.themoviedb.org/3";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjZhMzgzOTY1M2FlMWM4N2FlZTUyNDliZDliMmZjYiIsIm5iZiI6MTczNDMyNTc0NS44NDUsInN1YiI6IjY3NWZiNWYxZDZmNWU4NDU4YjhiNThlMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o4QYEwzPdbUyZXdjmthfUeKBq86BQ7sdoonoZzS4J9M",
  },
};

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  popularity: number;
  genre_ids: number[];
}
export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export function getMovies({
  type,
}: {
  type: "now_playing" | "popular" | "top_rated" | "upcoming";
}) {
  return fetch(`${BASE_PATH}/movie/${type}?language=ko&page=1`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

export interface ISeries {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
}
export interface IGetSeriesResult {
  page: number;
  results: ISeries[];
  total_pages: number;
  total_results: number;
}
export function getTvSeries({
  type,
}: {
  type: "airing_today" | "on_the_air" | "popular" | "top_rated";
}) {
  return fetch(`${BASE_PATH}/tv/${type}?language=ko&page=1`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

interface IGenre {
  id: number;
  name: string;
}
export interface IMovieGenreId {
  genres: IGenre[];
}
export function getMoviesGenreId() {
  return fetch(`${BASE_PATH}/genre/movie/list?language=ko`, options)
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

export interface ITvGenreId {
  genres: IGenre[];
}
export function getTvGenreId() {
  return fetch(`${BASE_PATH}/genre/tv/list?language=ko`, options)
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

export interface IGetMovieSearchResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export function getMovieSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?query=${keyword}&include_adult=false&language=ko&page=1`,
    options
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

export interface IGetTvSearchResult {
  page: number;
  results: ISeries[];
  total_pages: number;
  total_results: number;
}
export function getTvSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?query=${keyword}&include_adult=false&language=ko&page=1`,
    options
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));
}
