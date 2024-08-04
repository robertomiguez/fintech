import { Coin } from '@/types/crypto';

class CryptoService {
  static async getCoins(): Promise<Coin[] | undefined> {
    const limit = process.env.EXPO_PUBLIC_COINS_LIMIT || 10;
    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }
      const coins = await response.json();

      const listCoins = coins.slice(0, limit).map((coin: Coin) => {
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

      return listCoins;
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }
}

export default CryptoService;
