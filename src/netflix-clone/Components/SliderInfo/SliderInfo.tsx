import { motion } from "framer-motion";
import styled from "styled-components";
import ActionButtons from "./ActionButtons";
import ContentDetails from "./ContentDetails";

const InfoContainer = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  visibility: hidden;
  position: absolute;
  width: 100%;
  top: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

interface InfoProps {
  content: any;
  datatype:
    | "movie"
    | "series"
    | "search_movie"
    | "search_tv"
    | "bookmarked_movie"
    | "bookmarked_series";
  getGenreNameById: (id: number) => string | undefined;
  variants: any;
}

function SliderInfo({
  content,
  datatype,
  getGenreNameById,
  variants,
}: InfoProps) {
  return (
    <InfoContainer variants={variants}>
      <ActionButtons content={content} datatype={datatype} />
      <ContentDetails content={content} getGenreNameById={getGenreNameById} />
    </InfoContainer>
  );
}

export default SliderInfo;
