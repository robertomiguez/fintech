import { ExpoResponse, ExpoRequest } from 'expo-router/server';
import { parse } from 'url';

export async function GET(request: { url: string }) {
  const parsedUrl = parse(request.url, true);
  const coin = parsedUrl.query.coin;

  if (!coin) {
    console.error('Missing coin parameter');
    return ExpoResponse.json({
      error: 'Missing coin parameter',
    });
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&interval=daily&precision=2&days=90`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Response error: ${response.status} ${response.statusText}`
      );
      return ExpoResponse.json({
        error: `Failed to fetch data: ${response.status} ${response.statusText}`,
      });
    }

    const res = await response.json();

    if (!res.prices) {
      console.error('API Error: Missing prices data');
      return ExpoResponse.json({
        error: 'API Error: Missing prices data',
      });
    }

    const prices = res.prices.map((price: [number, number]) => {
      const date = new Date(price[0]);
      const isoDate = date.toISOString();
      return {
        timestamp: isoDate || null,
        price: price[1] || 0,
      };
    });

    return ExpoResponse.json(prices);
  } catch (error) {
    console.error(`Fetch Error: ${(error as Error).message}`);
    return ExpoResponse.json({
      error: `Fetch Error: ${(error as Error).message}`,
    });
  }
}
