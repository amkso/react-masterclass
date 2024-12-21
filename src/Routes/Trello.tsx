import { createGlobalStyle, ThemeProvider } from "styled-components";
import { GlobalStyle } from "../css";
import { trelloTheme } from "../theme";
import TrelloApp from "../trello-clone/TrelloApp";

const TrelloGlobalStyle = createGlobalStyle`
  ${GlobalStyle}
  body{
    color: black;
    line-height: 1.2;
  }
`;

function Trello() {
  return (
    <ThemeProvider theme={trelloTheme}>
      <TrelloGlobalStyle />
      <TrelloApp />
    </ThemeProvider>
  );
}

export default Trello;
