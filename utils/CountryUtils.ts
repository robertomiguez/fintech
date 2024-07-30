import { getLocales } from 'expo-localization';

export function getRegionCode() {
  return getLocales()[0].regionCode;
}
