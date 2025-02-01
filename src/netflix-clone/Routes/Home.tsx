import { useQuery } from "react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getMovies, IGetMovieResult } from "../api";
import styled from "styled-components";
import { makeImagePath, truncateText } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { netflixBasePath } from "../../Routes/Netflix";
import { ButtonPlay, ButtonInfo } from "../Components/Button";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background-color: rgba(20, 20, 20, 1);
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 60px;
  background-image: linear-gradient(
      rgba(20, 20, 20, 1),
      rgba(0, 0, 0, 0),
      rgba(20, 20, 20, 1)
    ),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const BannerOverlay = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  top: 0;
  left: 60px;
  height: 75%;
  width: 35%;
  gap: 2%;
  div {
    display: flex;
    gap: 10px;
  }
`;

const Title = styled.h1`
  font-size: 80px;
  margin-bottom: 20px;
  font-weight: 800;
`;

const Overview = styled.p`
  margin-bottom: 20px;
  font-size: 24px;
  line-height: 1.3;
  width: 100%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 10;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: 10vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: rgba(20, 20, 20, 1);
`;

const BigCover = styled.div<{ bgphoto: string }>`
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px 40px;
  font-size: 46px;
  font-weight: 800;
  position: relative;
`;

const ButtonContainer = styled.div`
  padding: 10px 40px;
  display: flex;
  justify-content: flex-start;
  button {
    border: none;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:last-child {
      color: white;
      background-color: rgba(20, 20, 20, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.5);
    }
  }
`;

const BigOverview = styled.p`
  font-size: 20px;
  line-height: 1.2;
  padding: 10px 40px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
`;

const offset = 6;

let rowNum = 0;
const setRowNum = (num: number) => (rowNum = num);

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    netflixBasePath + "/movies/:movieId"
  );
  const onBoxClicked = (movieId: number) => {
    history.push(`${netflixBasePath}/movies/${movieId}`);
  };

  // Movie-nowPlaying
  const { data: dataNowPlaying, isLoading: isLoadingNowPlaying } =
    useQuery<IGetMovieResult>(["movies", "nowPlaying"], () =>
      getMovies({ type: "now_playing" })
    );
  const banner = dataNowPlaying?.results[0];

  // Movie-popular / Movie-topRated / Movie-upcoming
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetMovieResult>(["movies", "popular"], () =>
      getMovies({ type: "popular" })
    );
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetMovieResult>(["movies", "topRated"], () =>
      getMovies({ type: "top_rated" })
    );
  const { data: dataUpcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetMovieResult>(["movies", "upcoming"], () =>
      getMovies({ type: "upcoming" })
    );

  const clickedRow = (() => {
    switch (rowNum) {
      case 0:
        return dataNowPlaying;
      case 1:
        return dataPopular;
      case 2:
        return dataTopRated;
      case 3:
        return dataUpcoming;
      default:
        return null;
    }
  })();
  const clicked =
    bigMovieMatch?.params.movieId &&
    clickedRow?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );

  const isLoading =
    isLoadingNowPlaying &&
    isLoadingPopular &&
    isLoadingTopRated &&
    isLoadingUpcoming;
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(banner?.backdrop_path || "")}>
            <BannerOverlay>
              <Title>{banner?.title}</Title>
              <Overview>{truncateText(banner?.overview, 15)}</Overview>
              <div>
                <ButtonPlay
                  onClick={() => banner?.id && onBoxClicked(banner.id)}
                />
                <ButtonInfo
                  onClick={() => banner?.id && onBoxClicked(banner.id)}
                />
              </div>
            </BannerOverlay>
          </Banner>
          {dataNowPlaying && (
            <div
              onClick={() => {
                setRowNum(0);
              }}
            >
              <Slider
                style={{ top: "-120px" }}
                title="지금 상영중"
                data={dataNowPlaying}
                datatype="movie"
                offset={offset}
                isFirstSlider={true}
              />
            </div>
          )}
          {dataPopular && (
            <div
              onClick={() => {
                setRowNum(1);
              }}
            >
              <Slider
                style={{ top: "-120px" }}
                title="인기 영화"
                data={dataPopular}
                datatype="movie"
                offset={offset}
                rowNum={1}
              />
            </div>
          )}
          {dataTopRated && (
            <div
              onClick={() => {
                setRowNum(2);
              }}
            >
              <Slider
                style={{ top: "-120px" }}
                title="평점 높은 영화"
                data={dataTopRated}
                datatype="movie"
                offset={offset}
                rowNum={2}
              />
            </div>
          )}
          {dataUpcoming && (
            <div
              onClick={() => {
                setRowNum(3);
              }}
            >
              <Slider
                style={{ top: "-120px" }}
                title="개봉 예정작"
                data={dataUpcoming}
                datatype="movie"
                offset={offset}
                rowNum={3}
                isLastSlider={true}
              />
            </div>
          )}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={() => history.goBack()}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BigMovie
                    layoutId={`${rowNum}-${bigMovieMatch.params.movieId}`}
                  >
                    {clicked && (
                      <>
                        <BigCover
                          bgphoto={makeImagePath(clicked?.backdrop_path || "")}
                        />
                        <BigTitle>{`${
                          clicked.title
                        }(${clicked.release_date.slice(0, 4)})`}</BigTitle>
                        <ButtonContainer>
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              data-icon="PlayStandard"
                              aria-hidden="true"
                            >
                              <path
                                d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </button>
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              data-icon="PlusStandard"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </button>
                        </ButtonContainer>
                        <BigOverview>
                          {truncateText(clicked.overview, 50)}
                        </BigOverview>
                      </>
                    )}
                  </BigMovie>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
