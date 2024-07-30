export interface Country {
  flagUrl: string;
  name?: string;
  phoneCode?: string;
  regionCode?: string;
  currency?: string;
}

export interface CountryDetails {
  name: string;
  cca2?: string;
  cca3?: string;
  phoneCode?: string;
  currency?: {
    name: string;
    symbol: string;
    code: string;
  };
  flag?: {
    png: string;
    svg: string;
  };
}
