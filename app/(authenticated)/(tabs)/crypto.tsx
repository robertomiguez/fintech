// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Currency } from '@/types/crypto';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import CurrencyChangeIndicator from '@/components/CurrencyChangeIndicator';

const fetchCurrencies = async () => {
  const response = await fetch('/api/listings?limit=15');
  if (!response.ok) throw new Error('Failed to fetch currencies');
  return await response.json();
};

const fetchCurrencyInfo = async (id: string[]) => {
  const response = await fetch(`/api/info?id=${id}`);
  if (!response.ok) throw new Error('Failed to fetch currency info');
  return await response.json();
};

const Page = () => {
  const headerHeight = useHeaderHeight();

  const {
    data: currencies,
    isLoading: isCurrenciesLoading,
    error: currenciesError,
  } = useQuery({ queryKey: ['currencies'], queryFn: fetchCurrencies });

  const currencyIds = currencies?.map((currency: Currency) => currency.id);
  const {
    data: currencyInfo,
    isLoading: isCurrencyInfoLoading,
    error: currencyInfoError,
  } = useQuery({
    queryKey: ['info', currencyIds],
    queryFn: async () => fetchCurrencyInfo(currencyIds),
    enabled: !!currencyIds,
  });

  if (isCurrenciesLoading || isCurrencyInfoLoading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  if (currenciesError || currencyInfoError) {
    return <Text>Error fetching data.</Text>;
  }
  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight }}
    >
      <Text style={defaultStyles.sectionHeader}>Latest Cryptos</Text>
      <View style={defaultStyles.block}>
        {currencies?.map((currency: Currency) => (
          <Link key={currency.id} href={`/crypto/${currency.id}`} asChild>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}
            >
              <Image
                source={{
                  uri:
                    currencyInfo?.[currency.id]?.logo || 'asset:/images/40.png',
                }}
                style={{ width: 40, height: 40 }}
              />
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={{ fontWeight: '600', color: Colors.dark }}>
                  {currency.name}
                </Text>
                <Text style={{ color: Colors.gray }}>{currency.symbol}</Text>
              </View>
              <View style={{ gap: 6, alignItems: 'flex-end' }}>
                <Text style={{ fontWeight: '600', color: Colors.dark }}>
                  {currency.quote?.GBP?.price?.toFixed(2)} ?
                </Text>
                <CurrencyChangeIndicator
                  percentChange={currency.quote?.GBP?.percent_change_24h}
                />
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};
export default Page;
