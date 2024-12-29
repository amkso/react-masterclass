import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Series from "./Routes/Series";
import Header from "./Components/Header";
import Movie from "./Routes/Movie";
import NewContent from "./Routes/NewContent";
import FavorList from "./Routes/FavorList";
import LangSearch from "./Routes/LangSearch";
import { netflixBasePath } from "../Routes/Netflix";

function NetflixApp() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path={netflixBasePath + "/series"}>
          <Series />
        </Route>
        <Route path={netflixBasePath + "/movie"}>
          <Movie />
        </Route>
        <Route path={netflixBasePath + "/newcontent"}>
          <NewContent />
        </Route>
        <Route path={netflixBasePath + "/favorlist"}>
          <FavorList />
        </Route>
        <Route path={netflixBasePath + "/langsearch"}>
          <LangSearch />
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
