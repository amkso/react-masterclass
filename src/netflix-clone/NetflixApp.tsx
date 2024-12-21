import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Header from "./Components/Header";
import { netflixBasePath } from "../Routes/Netflix";

function NetflixApp() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path={netflixBasePath + "/tv"}>
          <Tv />
        </Route>
        <Route path={netflixBasePath + "/search"}>
          <Search />
        </Route>
        <Route
          path={["/", "/movies/:movieId"].map((item) => netflixBasePath + item)}
        >
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default NetflixApp;
