import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import Slider from "../Components/Slider";
import {
  getMovieSearch,
  getTvSearch,
  IGetMovieSearchResult,
  IGetTvSearchResult,
} from "../api";
import { useQuery } from "react-query";
import { truncateText } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { useEffect } from "react";

const Wrapper = styled.div``;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  padding-left: 60px;
  font-size: 40px;
  font-weight: bold;
  height: 10vh;
  margin-top: 20vh;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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

const BigCover = styled.div<{ $bgphoto: string }>`
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1)),
    url(${(props) => props.$bgphoto});
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

// 공통 쿼리 옵션 정의
const queryOptions = {
  staleTime: 1000 * 60 * 5, // 5분간 fresh
  cacheTime: 1000 * 60 * 10, // 10분간 캐시 유지
  keepPreviousData: true, // 새 쿼리 동안 이전 데이터 유지
};

function Search() {
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const selectedId = searchParams.get("id");

  // bigBoardMatch를 대체
  const bigBoardMatch = selectedId ? { params: { id: selectedId } } : null;

  // Moive
  const { data: movieSearchData, isLoading: movieSearchLoading } =
    useQuery<IGetMovieSearchResult>(
      ["search_movie", keyword],
      () => getMovieSearch(keyword || ""),
      queryOptions
    );
  // Tv
  const { data: tvSearchData, isLoading: tvSearchLoading } =
    useQuery<IGetTvSearchResult>(
      ["search_tv", keyword],
      () => getTvSearch(keyword || ""),
      queryOptions
    );

  const findContentById = (id: string) => {
    switch (rowNum) {
      case 0:
        return movieSearchData?.results?.find((content) => content.id === +id);
      case 1:
        return tvSearchData?.results?.find((content) => content.id === +id);
      default:
        return null;
    }
  };

  const clicked = selectedId && findContentById(selectedId);

  const isLoading = movieSearchLoading || tvSearchLoading;
  // 모달이 열리거나 닫힐 때 스크롤 제어
  useEffect(() => {
    if (bigBoardMatch) {
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
  }, [bigBoardMatch]);
  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Wrapper>
          <Title>검색 결과</Title>
          <Container>
            {movieSearchData && (
              <div
                onClick={() => {
                  setRowNum(0);
                }}
              >
                <Slider
                  title="관련 영화"
                  data={movieSearchData}
                  datatype="search_movie"
                  offset={offset}
                  rowNum={0}
                />
              </div>
            )}
            {tvSearchData && (
              <div
                onClick={() => {
                  setRowNum(1);
                }}
              >
                <Slider
                  title="관련 tv 프로그램"
                  data={tvSearchData}
                  datatype="search_tv"
                  offset={offset}
                  isLastSlider={true}
                  rowNum={1}
                />
              </div>
            )}
          </Container>
          <AnimatePresence>
            {bigBoardMatch ? (
              <>
                <Overlay
                  onClick={() => history.goBack()}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BigMovie layoutId={`${rowNum}-${bigBoardMatch.params.id}`}>
                    {clicked && (
                      <>
                        <BigCover
                          $bgphoto={makeImagePath(clicked?.backdrop_path || "")}
                        />
                        <BigTitle>{`${
                          "title" in clicked ? clicked.title : clicked.name
                        }(${
                          "release_date" in clicked
                            ? clicked.release_date.slice(0, 4)
                            : clicked.first_air_date.slice(0, 4)
                        })`}</BigTitle>
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
                          {truncateText(clicked.overview, 40)}
                        </BigOverview>
                      </>
                    )}
                  </BigMovie>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </Wrapper>
      )}
    </>
  );
}

export default Search;
