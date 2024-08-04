import type { Country } from '@/types/Country';

class CountryService {
  static async getCountries(): Promise<Country[] | undefined> {
    const url = 'https://restcountries.com/v3.1/all?fields=flags,name,idd,cca2';
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
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

      const priorityCountries =
        process.env.EXPO_PUBLIC_PRIORITY_COUNTRIES?.split(',') ?? [];
      const prioritized = simplifiedCountries.filter((country: Country) =>
        priorityCountries.includes(country.name as string)
      );
      const others = simplifiedCountries.filter(
        (country: Country) =>
          !priorityCountries.includes(country.name as string)
      );
      others.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name)
      );
      const sortedCountries = [...prioritized, ...others];

      return sortedCountries;
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }
}

export default CountryService;
