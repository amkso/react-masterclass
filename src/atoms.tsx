import { atom } from "recoil";

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
    "To Do": [], // 스페이스는 변수로 안되기에 "To Do"를 씀 아니면, To_Do를 써야함
    Doing: [],
    Done: [],
  },
});
