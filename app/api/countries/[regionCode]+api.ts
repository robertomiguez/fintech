import { Country } from '@/types/Country';
import { ExpoResponse, ExpoRequest } from 'expo-router/server';

export async function GET(
  request: Request,
  { regionCode }: Record<string, string>
) {
  try {
    const { pathname } = new URL(request.url);
    const regionCode = pathname.split('/').pop();
    const url =
      regionCode === 'all'
        ? 'https://restcountries.com/v3.1/all?fields=flags,name,idd,cca2'
        : `https://restcountries.com/v3.1/alpha/${regionCode}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const countries = await response.json();

    const simplifiedCountries = countries.map(
      (country: {
        flags: { svg: string; png: string };
        name: { common: string };
        idd?: { root?: string; suffixes?: string[] };
        cca2?: string;
      }) => {
        return {
          flag: country.flags.png,
          name: country.name.common,
          phoneCode:
            country?.idd?.root + (country?.idd?.suffixes?.[0] || '') || '',
          regionCode: country?.cca2 || '',
        };
      }
    );

    if (regionCode !== 'all') {
      return ExpoResponse.json(simplifiedCountries);
    }
    const priorityCountries =
      process.env.EXPO_PUBLIC_PRIORITY_COUNTRIES?.split(',') ?? [];
    const prioritized = simplifiedCountries.filter((country: Country) =>
      priorityCountries.includes(country.name as string)
    );
    const others = simplifiedCountries.filter(
      (country: Country) => !priorityCountries.includes(country.name as string)
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
