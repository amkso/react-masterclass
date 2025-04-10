import styled from "styled-components";
import { useRecoilState } from "recoil";
import { bookmarkState } from "../../../atoms";

const ButtonContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
`;

const PlayButton = styled.button`
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }
`;

const BookmarkButton = styled(PlayButton)`
  color: white;
  background-color: rgba(20, 20, 20, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgb(255, 255, 255);
  }
`;

const LikeButton = styled(BookmarkButton)``;

interface ActionButtonsProps {
  content: any;
  datatype:
    | "movie"
    | "series"
    | "search_movie"
    | "search_tv"
    | "bookmarked_movie"
    | "bookmarked_series";
}

interface BookmarkedContent {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  type: "movie" | "series";
  release_date?: string;
  first_air_date?: string;
}

function ActionButtons({ content, datatype }: ActionButtonsProps) {
  const [bookmarks, setBookmarks] =
    useRecoilState<BookmarkedContent[]>(bookmarkState);
  const isBookmarked = bookmarks.some((item) => item.id === content.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((item) => item.id !== content.id));
    } else {
      const isMovie = datatype === "movie" || datatype === "search_movie";
      const newBookmark: BookmarkedContent = {
        id: content.id,
        backdrop_path: content.backdrop_path,
        poster_path: content.poster_path,
        overview: content.overview,
        type: isMovie ? "movie" : "series",
        ...(isMovie ? { title: content.title } : { name: content.name }),
        ...(isMovie
          ? { release_date: content.release_date }
          : { first_air_date: content.first_air_date }),
      };
      setBookmarks((prev) => [...prev, newBookmark]);
    }
  };

  return (
    <ButtonContainer>
      <PlayButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path
            d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
            fill="currentColor"
          />
        </svg>
      </PlayButton>
      <BookmarkButton onClick={handleBookmark}>
        {isBookmarked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="20"
            height="20"
          >
            <path
              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z"
              fill="currentColor"
            />
          </svg>
        )}
      </BookmarkButton>
      <LikeButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="none"
          width="20"
          height="20"
        >
          <path
            d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z"
            fill="currentColor"
          />
        </svg>
      </LikeButton>
    </ButtonContainer>
  );
}

export default ActionButtons;
