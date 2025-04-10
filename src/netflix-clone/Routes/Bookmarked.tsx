import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "../Components/Slider";
import { bookmarkState } from "../../atoms";
import { IMovie, ISeries } from "../api";
import { makeImagePath, truncateText } from "../utils";
import LargeActionButtons from "../Components/SliderInfo/LargeActionButtons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEffect } from "react";

const Wrapper = styled.div`
  background-color: rgba(20, 20, 20, 1);
  min-height: 100vh;
  margin-top: 80px;
`;

const Title = styled.div`
  padding-left: 60px;
  font-size: 40px;
  font-weight: bold;
  height: 10vh;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

function Bookmarked() {
  const history = useHistory();
  const bookmarks = useRecoilValue(bookmarkState);
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    "/netflix/bookmarked/movies/:movieId"
  );
  const bigSeriesMatch = useRouteMatch<{ seriesId: string }>(
    "/netflix/bookmarked/series/:seriesId"
  );

  // 북마크된 영화와 TV 시리즈 분리
  const bookmarkedMovies = bookmarks
    .filter((item) => item.type === "movie")
    .map((item) => ({
      ...item,
      popularity: 0,
      genre_ids: [],
      vote_average: 0,
      vote_count: 0,
    })) as IMovie[];

  const bookmarkedSeries = bookmarks
    .filter((item) => item.type === "series")
    .map((item) => ({
      ...item,
      popularity: 0,
      genre_ids: [],
      vote_average: 0,
      vote_count: 0,
    })) as ISeries[];

  const clickedMovie = bigMovieMatch?.params.movieId
    ? bookmarkedMovies.find(
        (movie) => movie.id === Number(bigMovieMatch.params.movieId)
      )
    : null;

  const clickedSeries = bigSeriesMatch?.params.seriesId
    ? bookmarkedSeries.find(
        (series) => series.id === Number(bigSeriesMatch.params.seriesId)
      )
    : null;

  // 모달이 열리거나 닫힐 때 스크롤 제어
  useEffect(() => {
    if (bigMovieMatch || bigSeriesMatch) {
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
  }, [bigMovieMatch, bigSeriesMatch]);

  // 북마크된 항목이 없을 때 표시할 메시지
  if (bookmarks.length === 0) {
    return (
      <Wrapper>
        <Title>내가 찜한 리스트</Title>
        <Container>
          <div style={{ padding: "0 60px", fontSize: "24px" }}>
            아직 북마크한 콘텐츠가 없습니다.
          </div>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>내가 찜한 리스트</Title>
      <Container>
        {bookmarkedMovies.length > 0 && (
          <div>
            <Slider
              title="영화"
              data={{
                results: bookmarkedMovies,
                page: 1,
                total_pages: 1,
                total_results: bookmarkedMovies.length,
              }}
              datatype="bookmarked_movie"
              offset={offset}
              rowNum={0}
            />
          </div>
        )}
        {bookmarkedSeries.length > 0 && (
          <div>
            <Slider
              title="TV 시리즈"
              data={{
                results: bookmarkedSeries,
                page: 1,
                total_pages: 1,
                total_results: bookmarkedSeries.length,
              }}
              datatype="bookmarked_series"
              offset={offset}
              isLastSlider={true}
              rowNum={1}
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
                <BigMovie layoutId={`0-${bigMovieMatch.params.movieId}`}>
                  {clickedMovie && (
                    <>
                      <BigCover>
                        <BigCoverImage
                          src={makeImagePath(clickedMovie?.backdrop_path || "")}
                          alt={clickedMovie?.title}
                        />
                      </BigCover>
                      <div>
                        <BigTitle>{`${
                          clickedMovie.title
                        }(${clickedMovie.release_date?.slice(
                          0,
                          4
                        )})`}</BigTitle>
                        <LargeActionButtons
                          content={clickedMovie}
                          datatype="movie"
                        />
                        <BigOverview>
                          {truncateText(clickedMovie.overview, 50)}
                        </BigOverview>
                      </div>
                    </>
                  )}
                </BigMovie>
              </Overlay>
            </>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {bigSeriesMatch ? (
            <>
              <Overlay
                onClick={() => history.goBack()}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BigMovie layoutId={`1-${bigSeriesMatch.params.seriesId}`}>
                  {clickedSeries && (
                    <>
                      <BigCover>
                        <BigCoverImage
                          src={makeImagePath(clickedSeries.backdrop_path || "")}
                          alt={clickedSeries.name}
                        />
                      </BigCover>
                      <div>
                        <BigTitle>{`${
                          clickedSeries.name
                        }(${clickedSeries.first_air_date?.slice(
                          0,
                          4
                        )})`}</BigTitle>
                        <LargeActionButtons
                          content={clickedSeries}
                          datatype="series"
                        />
                        <BigOverview>
                          {truncateText(clickedSeries.overview, 50)}
                        </BigOverview>
                      </div>
                    </>
                  )}
                </BigMovie>
              </Overlay>
            </>
          ) : null}
        </AnimatePresence>
      </Container>
    </Wrapper>
  );
}

export default Bookmarked;
