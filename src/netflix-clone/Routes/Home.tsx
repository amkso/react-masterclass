import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEffect } from "react";
import styled from "styled-components";
import { getMovies, IGetMovieResult } from "../api";
import { makeImagePath, truncateText } from "../utils";
import { netflixBasePath } from "../../Routes/Netflix";
import { ButtonPlay, ButtonInfo } from "../Components/Button";
import Slider from "../Components/Slider";
import LargeActionButtons from "../Components/SliderInfo/LargeActionButtons";

const Wrapper = styled.div`
  background-color: rgba(20, 20, 20, 1);
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 60px;
  background-color: rgba(20, 20, 20, 1);
`;

const BannerImage = styled(LazyLoadImage)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  mask-image: linear-gradient(to bottom, rgba(20, 20, 20, 1), rgba(0, 0, 0, 0));
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
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
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

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  background-color: rgba(20, 20, 20, 1);
`;

const BigCoverImage = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  mask-image: linear-gradient(to bottom, rgba(20, 20, 20, 1), rgba(0, 0, 0, 0));
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px 40px;
  font-size: 46px;
  font-weight: 800;
  position: relative;
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

// 공통 쿼리 옵션 정의
const queryOptions = {
  staleTime: 1000 * 60 * 5, // 5분간 fresh
  cacheTime: 1000 * 60 * 10, // 10분간 캐시 유지
  keepPreviousData: true, // 새 쿼리 동안 이전 데이터 유지
};

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
    useQuery<IGetMovieResult>(
      ["movies", "nowPlaying"],
      () => getMovies({ type: "now_playing" }),
      queryOptions
    );
  const banner = dataNowPlaying?.results[0];

  // Movie-popular
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetMovieResult>(
      ["movies", "popular"],
      () => getMovies({ type: "popular" }),
      queryOptions
    );

  // Movie-topRated
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetMovieResult>(
      ["movies", "topRated"],
      () => getMovies({ type: "top_rated" }),
      queryOptions
    );

  // Movie-upcoming
  const { data: dataUpcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetMovieResult>(
      ["movies", "upcoming"],
      () => getMovies({ type: "upcoming" }),
      queryOptions
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

  // 모달이 열리거나 닫힐 때 스크롤 제어
  useEffect(() => {
    if (bigMovieMatch) {
      // 모달이 열릴 때
      document.body.style.overflow = "hidden";
    } else {
      // 모달이 닫힐 때
      document.body.style.overflow = "unset";
    }
    // cleanup 함수
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [bigMovieMatch]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner>
            <BannerImage
              src={makeImagePath(banner?.backdrop_path || "")}
              alt={banner?.title}
              threshold={100}
            />
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
                        <BigCover>
                          <BigCoverImage
                            src={makeImagePath(clicked?.backdrop_path || "")}
                            alt={clicked?.title}
                            threshold={100}
                          />
                        </BigCover>
                        <div>
                          <BigTitle>{`${
                            clicked.title
                          }(${clicked.release_date.slice(0, 4)})`}</BigTitle>
                          <LargeActionButtons
                            content={clicked}
                            datatype="movie"
                          />
                          <BigOverview>
                            {truncateText(clicked.overview, 50)}
                          </BigOverview>
                        </div>
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
