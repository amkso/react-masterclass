import { createGlobalStyle, ThemeProvider } from "styled-components";
import { GlobalStyle } from "../css";
import { theme } from "../theme";
import NetflixApp from "../netflix-clone/NetflixApp";

const NetflixGlobalStyle = createGlobalStyle`
  ${GlobalStyle}
  body{
    color: ${(props) => props.theme.white.darker};
    line-height: 1.2;
    background-color: #141414;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const netflixBasePath = `/Netflix`;

function Netflix() {
  return (
    <ThemeProvider theme={theme}>
      <NetflixGlobalStyle />
      <NetflixApp />
    </ThemeProvider>
  );
}

export default Netflix;
