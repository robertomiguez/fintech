import { Coin } from '@/types/crypto';
import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { parse } from 'url';

export async function GET(request: { url: string }) {
  const parsedUrl = parse(request.url, true);
  const limit = parsedUrl.query.limit || 15;
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Response Listings Error: ${response.status} ${response.statusText}`
      );
      return ExpoResponse.json({
        error: `Failed to fetch data: ${response.status} ${response.statusText}`,
      });
    }

    const res = await response.json();
    const listCoins = res.slice(0, limit).map((coin: Coin) => {
      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        description: null,
        ath: coin.ath,
        ath_date: coin.ath_date,
        ath_change_percentage: coin.ath_change_percentage,
        max_supply: coin.max_supply,
      };
    });

    return ExpoResponse.json(listCoins);
  } catch (error) {
    console.error(`Fetch Error: ${(error as Error).message}`);
    return ExpoResponse.json({
      error: `Fetch Error: ${(error as Error).message}`,
    });
  }
}
