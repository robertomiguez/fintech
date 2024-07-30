import { CountryDetails } from '@/types/Country';
import { ExpoResponse, ExpoRequest } from 'expo-router/server';

export async function GET(request: { url: string }) {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2,cca3,currencies'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const countries = await response.json();

    const simplifiedCountries = countries.map(
      (country: {
        name: { common: string };
        cca2: string;
        cca3: string;
        idd?: { root?: string; suffixes?: string[] };
        currencies: { [key: string]: { name: string; symbol: string } };
        flags: { svg: string; png: string };
      }) => {
        const currencyCode = Object.keys(country.currencies)[0];
        const currencyDetails = country.currencies[currencyCode];

        return {
          name: country.name.common,
          cca2: country.cca2,
          cca3: country.cca3,
          phoneCode:
            country?.idd?.root + (country?.idd?.suffixes?.[0] || '') || '',
          currency: currencyDetails
            ? {
                name: currencyDetails.name,
                symbol: currencyDetails.symbol,
                code: currencyCode,
              }
            : null,
          flag: { png: country.flags.png, svg: country.flags.svg },
        };
      }
    );

    const priorityCountries =
      process.env.EXPO_PUBLIC_PRIORITY_COUNTRIES?.split(',') ?? [];
    const prioritized = simplifiedCountries.filter((country: CountryDetails) =>
      priorityCountries.includes(country.name)
    );
    const others = simplifiedCountries.filter(
      (country: CountryDetails) => !priorityCountries.includes(country.name)
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
