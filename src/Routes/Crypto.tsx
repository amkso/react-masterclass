import { BrowserRouter, Route, Switch } from "react-router-dom";
import Coin from "../crypto-tracker/Coin";
import Coins from "../crypto-tracker/Coins";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { cryptoDarkTheme, cryptoLightTheme } from "../theme";
import { GlobalStyle } from "../css";

const CryptoGlobalStyle = createGlobalStyle`
  ${GlobalStyle}
`;

export const cryptoBasePath = `/Crypto`;

function Crypto() {
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <ThemeProvider theme={isDark ? cryptoDarkTheme : cryptoLightTheme}>
      <CryptoGlobalStyle />
      <BrowserRouter>
        <Switch>
          <Route path={cryptoBasePath + "/:coinId"}>
            <Coin />
          </Route>
          <Route path={cryptoBasePath}>
            <Coins />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default Crypto;