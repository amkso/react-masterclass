import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  IGetMovieResult,
  IGetMovieSearchResult,
  IGetSeriesResult,
  IGetTvSearchResult,
} from "../api";
import styled from "styled-components";
import { useState } from "react";
import { makeImagePath, truncateText } from "../utils";
import { netflixBasePath } from "../../Routes/Netflix";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { genreIdsAtom } from "../../atoms";

const Title = styled.h1`
  display: inline-block;
  font-size: 28px;
  margin-bottom: 10px;
  margin-left: 60px;
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  visibility: hidden;
  position: absolute;
  width: 100%;
  top: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  h4 {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 10px;
  }
  div button {
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div:first-child {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    button:last-child {
      color: white;
      background-color: rgba(20, 20, 20, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.5);
    }
  }
  div:nth-child(3) {
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 1.1;
  }
  div:last-child {
    font-size: 12px;
    font-weight: 600;
  }
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  margin-right: 10px;
  height: 160px;
  width: 290px;
  font-size: 66px;
  cursor: pointer;
  &:hover {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:hover,
  & ${Info}:hover {
    z-index: 2;
  }
`;

const Row = styled(motion.div)`
  display: flex;
  position: relative;
  margin: 0 60px;
  ${Box}:first-child {
    transform-origin: center left;
  }
  ${Box}:last-child {
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
    y: !isLastSlider ? -100 : -200,
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
  data:
    | IGetMovieResult
    | IGetSeriesResult
    | IGetMovieSearchResult
    | IGetTvSearchResult;
  datatype: "movie" | "series" | "search_movie" | "search_tv";
  offset: number;
  isFirstSlider?: boolean;
  isLastSlider?: boolean;
  rowNum?: number;
  nowPath?: string;
}
function Slider({
  style,
  title,
  data,
  datatype,
  offset,
  isFirstSlider = false,
  isLastSlider = false,
  rowNum = 0,
}: SliderProps) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setGoBack(false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setGoBack(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
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
  const getGenreNameById = (id: number): string | undefined => {
    const genreList = datatype === "movie" ? genreIds.movie : genreIds.tv;
    if (!genreList) return undefined;
    return genreList.genres.find(
      (genre: { id: number; name: string }) => genre.id === id
    )?.name;
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
                custom={isLastSlider}
                variants={boxVariants}
                layoutId={`${rowNum}-${content.id}`}
                key={content.id}
                whileHover="hover"
                initial="normal"
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(content.id)}
                bgphoto={makeImagePath(content.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <div>
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
                  </div>
                  <h4>{"title" in content ? content.title : content.name}</h4>
                  <div>{truncateText(content.overview, 9)}</div>
                  <div>
                    {content.genre_ids.map((id) => {
                      return getGenreNameById(id) + " ";
                    })}
                  </div>
                </Info>
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
