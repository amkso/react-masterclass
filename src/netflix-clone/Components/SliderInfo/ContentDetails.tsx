import styled from "styled-components";
import { truncateText } from "../../utils";

const Title = styled.h4`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const Overview = styled.div`
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.1;
`;

const Genres = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

interface ContentDetailsProps {
  content: any;
  getGenreNameById: (id: number) => string | undefined;
}

function ContentDetails({ content, getGenreNameById }: ContentDetailsProps) {
  return (
    <>
      <Title>{"title" in content ? content.title : content.name}</Title>
      <Overview>{truncateText(content.overview, 9)}</Overview>
      <Genres>
        {content.genre_ids.map((id: number) => getGenreNameById(id) + " ")}
      </Genres>
    </>
  );
}

export default ContentDetails;
