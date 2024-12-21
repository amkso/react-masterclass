import { BrowserRouter, Route, Switch } from "react-router-dom";
import Netflix from "./Routes/Netflix";
import Trello from "./Routes/Trello";
import Crypto from "./Routes/Crypto";
import Home from "./Routes/Home";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/Crypto">
          <Crypto />
        </Route>
        <Route path="/Trello">
          <Trello />
        </Route>
        <Route path="/Netflix">
          <Netflix />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
