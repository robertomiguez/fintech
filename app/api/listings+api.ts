// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ExpoRequest, ExpoResponse } from 'expo-router/server';

const API_KEY = process.env.CRYPTO_API_KEY;

export async function GET(request: ExpoRequest) {
  // Default limit value
  const limit = request?.expoUrl?.searchParams?.get('limit') || 5;

  if (!API_KEY) {
    console.error('API_KEY is not set');
    return ExpoResponse.json({ error: 'API_KEY is not set' });
  }

  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${limit}&convert=GBP`;

    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return ExpoResponse.json({
        error: `Failed to fetch data: ${response.status} ${response.statusText}`,
      });
    }

    const res = await response.json();

    if (res.status.error_code !== 0) {
      console.error(`API Error: ${res.status.error_message}`);
      return ExpoResponse.json({
        error: `API Error: ${res.status.error_message}`,
      });
    }

    return ExpoResponse.json(res.data);
  } catch (error) {
    console.error(`Fetch Error: ${(error as Error).message}`);
    return ExpoResponse.json({
      error: `Fetch Error: ${(error as Error).message}`,
    });
  }
}
