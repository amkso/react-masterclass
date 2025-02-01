import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// const Item = styled.div`
//   margin: 10px;
//   width: 400px;
//   height: 200px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background-color: white;
// `;

// this component is not used in the final project
function Home() {
  const history = useHistory();
  useEffect(() => {
    history.push("/Netflix");
  }, [history]);
  return (
    <Wrapper>
      {/* <Link
        to={{
          pathname: "/Crypto",
          state: {},
        }}
      >
        <Item>Crypto &rarr;</Item>
      </Link>
      <Link
        to={{
          pathname: "/Trello",
          state: {},
        }}
      >
        <Item>Trello &rarr;</Item>
      </Link>
      <Link
        to={{
          pathname: "/Netflix",
          state: {},
        }}
      >
        <Item>Netflix &rarr;</Item>
      </Link> */}
    </Wrapper>
  );
}

export default Home;
