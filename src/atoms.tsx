import { atom } from "recoil";
import {
  getMoviesGenreId,
  getTvGenreId,
  IMovieGenreId,
  ITvGenreId,
} from "./netflix-clone/api";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// 1. Crypto-tracker Atoms
export const isDarkAtom = atom({
  key: "isDark",
  default: false,
});

// 2. Trello Atoms
export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}
export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});

// 3. Netflix clone
export const genreIdsAtom = atom<{
  movie: IMovieGenreId | null;
  tv: ITvGenreId | null;
}>({
  key: "genreIds",
  default: { movie: null, tv: null },
  effects_UNSTABLE: [
    ({ setSelf }) => {
      Promise.all([getMoviesGenreId(), getTvGenreId()]).then(
        ([movieData, tvData]) => {
          setSelf({ movie: movieData, tv: tvData });
        }
      );
    },
  ],
});

// 북마크 타입 정의
interface BookmarkedContent {
  id: number;
  title?: string; // 영화의 경우
  name?: string; // TV 시리즈의 경우
  backdrop_path: string;
  poster_path: string;
  overview: string;
  type: "movie" | "series";
  release_date?: string; // 영화의 경우
  first_air_date?: string; // TV 시리즈의 경우
}

// 북마크 atom
export const bookmarkState = atom<BookmarkedContent[]>({
  key: "bookmarkState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
