import { useQuery } from "react-query";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";
import { getTvSeries, IGetSeriesResult } from "../api";
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

function Series() {
  const nowPath = netflixBasePath + "/series";
  const history = useHistory();
  const bigSeriesMatch = useRouteMatch<{ seriresId: string }>(
    nowPath + "/:seriresId"
  );
  const onBoxClicked = (contentId: number) => {
    history.push(`${nowPath}/${contentId}`);
  };

  // 모달 스크롤 제어
  useEffect(() => {
    if (bigSeriesMatch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [bigSeriesMatch]);

  // Series-popular
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetSeriesResult>(
      ["series", "popular"],
      () => getTvSeries({ type: "popular" }),
      queryOptions
    );
  const banner = dataPopular?.results[0];

  // Series-TopRated
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetSeriesResult>(
      ["series", "top_rated"],
      () => getTvSeries({ type: "top_rated" }),
      queryOptions
    );

  // Series-onTheAir
  const { data: dataOnTheAir, isLoading: isLoadingOnTheAir } =
    useQuery<IGetSeriesResult>(
      ["series", "on_the_air"],
      () => getTvSeries({ type: "on_the_air" }),
      queryOptions
    );

  const clickedRow = (() => {
    switch (rowNum) {
      case 0:
        return dataPopular;
      case 1:
        return dataTopRated;
      case 2:
        return dataOnTheAir;
      default:
        return null;
    }
  })();
  const clickedSeries =
    bigSeriesMatch?.params.seriresId &&
    clickedRow?.results.find(
      (serires) => serires.id === +bigSeriesMatch.params.seriresId
    );

  const isLoading = isLoadingOnTheAir && isLoadingPopular && isLoadingTopRated;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner>
            <BannerImage
              src={makeImagePath(banner?.backdrop_path || "")}
              alt={banner?.name}
              threshold={100}
            />
            <BannerOverlay>
              <Title>{banner?.name}</Title>
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
          {dataPopular && (
            <div
              onClick={() => {
                setRowNum(0);
              }}
            >
              <Slider
                style={{ top: "-120px" }}
                title="인기작"
                data={dataPopular}
                datatype="series"
                offset={offset}
                isFirstSlider={true}
              />
            </div>
          )}
          {dataTopRated && (
            <div
              onClick={() => {
                setRowNum(1);
              }}
            >
              <Slider
                style={{ top: "-120px" }}
                title="최고 평점"
                data={dataTopRated}
                datatype="series"
                offset={offset}
                rowNum={1}
              />
            </div>
          )}
          {dataOnTheAir && (
            <div
              onClick={() => {
                setRowNum(2);
              }}
            >
              <Slider
                style={{ top: "-120px" }}
                title="방송중"
                data={dataOnTheAir}
                datatype="series"
                offset={offset}
                rowNum={2}
                isLastSlider={true}
              />
            </div>
          )}
          <AnimatePresence>
            {bigSeriesMatch ? (
              <>
                <Overlay
                  onClick={() => history.goBack()}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BigMovie
                    layoutId={`${rowNum}-${bigSeriesMatch.params.seriresId}`}
                  >
                    {clickedSeries && (
                      <>
                        <BigCover>
                          <BigCoverImage
                            src={makeImagePath(
                              clickedSeries?.backdrop_path || ""
                            )}
                            alt={clickedSeries?.name}
                            threshold={100}
                          />
                        </BigCover>
                        <BigTitle>{`${
                          clickedSeries.name
                        }(${clickedSeries.first_air_date.slice(
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

export default Series;
