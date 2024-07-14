export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  description?: string;
  ath: number;
  ath_date: Date;
  ath_change_percentage: number;
  max_supply: number;
}

export interface Ticker {
  timestamp: string;
  price: number;
  volume_24h?: number;
  market_cap?: number;
}
