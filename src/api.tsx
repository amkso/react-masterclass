const BASE_URL = `https://api.coinpaprika.com/v1`;

export function fetchCoins(){
  return fetch(`${BASE_URL}/coins`).then((resoponse) =>
    resoponse.json()
  );
}

export function fetchCoinInfo(coinId:string){
  return fetch(`${BASE_URL}/coins/${coinId}`).then((resoponse) =>
    resoponse.json()
  );
}

export function fetchCoinTickers(coinId:string){
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((resoponse) =>
    resoponse.json()
  );
}

export function fetchCoinHistory(coinId:string){
  return fetch(`https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`).then((resoponse) =>
    resoponse.json()
  );
}