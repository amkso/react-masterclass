import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Series from "./Routes/Series";
import Header from "./Components/Header";
import { netflixBasePath } from "../Routes/Netflix";
import Bookmarked from "./Routes/Bookmarked";

function NetflixApp() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path={netflixBasePath + "/series"}>
          <Series />
        </Route>
        <Route path={netflixBasePath + "/search"}>
          <Search />
        </Route>
        <Route
          path={[
            netflixBasePath + "/bookmarked",
            netflixBasePath + "/bookmarked/movies/:movieId",
            netflixBasePath + "/bookmarked/series/:seriesId",
          ]}
        >
          <Bookmarked />
        </Route>
        <Route
          path={["/", "/movies/:movieId", "/series/:seriesId"].map(
            (item) => netflixBasePath + item
          )}
        >
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default NetflixApp;
