import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { fetchCoins } from "./crypto-api";
import { cryptoBasePath } from "../Routes/Crypto";
import DarkmodeToggle from "./components/DarkmodeToggle";
import BackButton from "./components/BackButton";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Hedaer = styled.header`
  height: 15vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const CoinsList = styled.ul`
  transition: 400ms;
`;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 10px;
  border: 1px solid white;
  transition: 400ms;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.3);
    transform: scale(1.1, 1.1);
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
  ${CoinsList}:hover > &:not(:hover) {
    filter: blur(1.5px);
  }
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function CryptoApp() {
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Hedaer>
        <BackButton />
        <Title>코인</Title>
        <DarkmodeToggle />
      </Hedaer>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `${cryptoBasePath}/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default CryptoApp;
