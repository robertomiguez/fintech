import { ExpoResponse, ExpoRequest } from 'expo-router/server';

export async function GET(request: { url: string }) {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const countries = await response.json();

    const simplifiedCountries = countries.map(
      (country: { name: { common: string } }) => ({
        name: country.name.common,
      })
    );

    const priorityCountries =
      process.env.EXPO_PUBLIC_PRIORITY_COUNTRIES?.split(',') ?? [];
    const prioritized = simplifiedCountries.filter(
      (country: { name: string }) => priorityCountries.includes(country.name)
    );
    const others = simplifiedCountries.filter(
      (country: { name: string }) => !priorityCountries.includes(country.name)
    );
    others.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name)
    );
    const sortedCountries = [...prioritized, ...others];

    return ExpoResponse.json(sortedCountries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return ExpoResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
