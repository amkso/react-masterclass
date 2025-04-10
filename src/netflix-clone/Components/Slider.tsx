import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  IGetMovieResult,
  IGetMovieSearchResult,
  IGetSeriesResult,
  IGetTvSearchResult,
} from "../api";
import styled from "styled-components";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { netflixBasePath } from "../../Routes/Netflix";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { genreIdsAtom } from "../../atoms";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SliderInfo from "./SliderInfo/SliderInfo";

const Title = styled.h1`
  display: inline-block;
  font-size: 28px;
  margin-bottom: 10px;
  margin-left: 60px;
`;

const Info = styled(SliderInfo)``;

const BoxImage = styled(LazyLoadImage)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s ease-in-out;
`;

const Box = styled(motion.div)`
  position: relative;
  margin-right: 10px;
  height: 160px;
  width: 290px;
  font-size: 66px;
  cursor: pointer;
  &:hover,
  & ${Info}:hover {
    z-index: 2;
  }
  &:hover ${BoxImage} {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const Row = styled(motion.div)`
  display: flex;
  position: relative;
  margin: 0 60px;
  ${Box}:first-child {
    transform-origin: center left;
  }
  ${Box}:not(:first-child):last-child {
    transform-origin: center right;
  }
`;

const RowSide = styled.div`
  background-color: rgba(255, 255, 255, 0);
  position: absolute;
  height: 160px;
  width: 50px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    fill: rgba(255, 255, 255, 0);
    width: 30px;
    height: 30px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
    svg {
      fill: rgba(255, 255, 255, 1);
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
  margin: 20px 0 45px 0;
  ${RowSide}:first-child {
    left: 0;
  }
  ${RowSide}:last-child {
    right: 0;
    top: 35px;
  }
`;

const rowVariants: Variants = {
  hidden: (goBack: boolean) => ({
    x: (window.outerWidth + 5) * (goBack ? -1 : 1),
  }),
  visible: {
    x: 0,
  },
  exit: (goBack: boolean) => ({
    x: (window.outerWidth + 5) * (goBack ? 1 : -1),
  }),
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: (isLastSlider) => ({
    scale: 1.3,
    y: isLastSlider ? -150 : -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  }),
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    visibility: "visible",
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface SliderProps {
  style?: object;
  title?: string;
  isFirstSlider?: boolean;
  isLastSlider?: boolean;
  rowNum?: number;
  nowPath?: string;

  data:
    | IGetMovieResult
    | IGetSeriesResult
    | IGetMovieSearchResult
    | IGetTvSearchResult;
  datatype:
    | "movie"
    | "series"
    | "search_movie"
    | "search_tv"
    | "bookmarked_movie"
    | "bookmarked_series";
  offset: number;
}
function Slider({
  style,
  title,
  isFirstSlider = false,
  isLastSlider = false,
  rowNum = 0,
  data,
  datatype,
  offset,
}: SliderProps) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setGoBack(false);
      const totalMovies = data.results.length;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setGoBack(true);
      const totalMovies = data.results.length;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const history = useHistory();
  const onBoxClicked = (contentId: number) => {
    const url = (() => {
      switch (datatype) {
        case "movie":
          return `${netflixBasePath}/movies/${contentId}`;
        case "series":
          return `${netflixBasePath}/series/${contentId}`;
        case "bookmarked_movie":
          return `${netflixBasePath}/bookmarked/movies/${contentId}`;
        case "bookmarked_series":
          return `${netflixBasePath}/bookmarked/series/${contentId}`;
        case "search_movie":
        case "search_tv":
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("id", contentId.toString());
          return `${netflixBasePath}/search?${searchParams.toString()}`;
        default:
          return `${netflixBasePath}`;
      }
    })();
    history.push(url);
  };

  const genreIds = useRecoilValue(genreIdsAtom);
  const getGenreNameById = (id: number): string => {
    const genreList =
      datatype === "movie" || "search_movie" ? genreIds.movie : genreIds.tv;
    if (!genreList) return "";
    return (
      genreList.genres.find(
        (genre: { id: number; name: string }) => genre.id === id
      )?.name ?? ""
    );
  };
  return (
    <Wrapper style={style}>
      <Title>{title}</Title>
      <RowSide onClick={decreaseIndex}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      </RowSide>
      <AnimatePresence
        custom={goBack}
        mode="popLayout"
        initial={false}
        onExitComplete={toggleLeaving}
      >
        <Row
          custom={goBack}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data?.results
            .slice(isFirstSlider ? 1 : 0)
            .slice(offset * index, offset * (index + 1))
            .map((content) => (
              <Box
                custom={{ isLastSlider, itemCount: data?.results.length || 0 }}
                layoutId={`${rowNum}-${content.id}`}
                key={content.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(content.id)}
              >
                <BoxImage
                  src={makeImagePath(content.backdrop_path, "w500")}
                  alt={"title" in content ? content.title : content.name}
                  threshold={100}
                  effect="opacity"
                  placeholderSrc={makeImagePath(content.backdrop_path, "w300")}
                />
                <Info
                  content={content}
                  datatype={datatype}
                  getGenreNameById={getGenreNameById}
                  variants={infoVariants}
                />
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <RowSide onClick={increaseIndex}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
      </RowSide>
    </Wrapper>
  );
}

export default Slider;
