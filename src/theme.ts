import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  red: "#E51013",
  black: {
    veryDark: "#141414",
    darker: "#181818",
    lighter: "#2F2F2F",
  },
  white: {
    lighter: "#fff",
    darker: "#e5e5e5",
  },
};

export const cryptoDarkTheme: DefaultTheme = {
  ...theme,
  bgColor: "#2f3640",
  textColor: "white",
  accentColor: "#9c88ff",
  cardBgColor: "transparent",
};

export const cryptoLightTheme: DefaultTheme = {
  ...theme,
  bgColor: "whitesmoke",
  textColor: "black",
  accentColor: "#9c88ff",
  cardBgColor: "white",
};

export const trelloTheme: DefaultTheme = {
  ...theme,
  bgColor: "#3F8CF2",
  boardColor: "#DADFE9",
  cardColor: "white",
};
