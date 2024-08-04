import { Ticker } from '@/types/crypto';

class TickerService {
  static async getTickers(coin: string): Promise<Ticker[] | undefined> {
    if (!coin) {
      console.error('Missing coin parameter');
      return [];
    }
    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&interval=daily&precision=2&days=90`;

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch coin');
      }
      const coin = await response.json();

      if (!coin.prices) {
        console.error('API Error: Missing prices data');
        return [];
      }

      const prices = coin.prices.map((price: [number, number]) => {
        const date = new Date(price[0]);
        const isoDate = date.toISOString();
        return {
          timestamp: isoDate || null,
          price: price[1] || 0,
        };
      });

      return prices;
    } catch (error) {
      console.error('Error fetching tickers:', error);
    }
  }
}

export default TickerService;
