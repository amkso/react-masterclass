import { atom } from "recoil";
import {
  getMoviesGenreId,
  getTvGenreId,
  IMovieGenreId,
  ITvGenreId,
} from "./netflix-clone/api";

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
