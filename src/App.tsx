import { createGlobalStyle } from "styled-components";
import { GlobalStyle } from "./css";
import Router from "./Router";

const AppGlobalStyle = createGlobalStyle`
  ${GlobalStyle}
`;

function App() {
  return (
    <>
      <AppGlobalStyle />
      <Router />
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </>
  );
}

export default App;
