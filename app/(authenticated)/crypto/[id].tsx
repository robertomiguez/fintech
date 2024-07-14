import { Stack, useLocalSearchParams } from 'expo-router';
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { Ticker, Coin } from '@/types/crypto';
import Chart from '@/components/Chart';
import { useState } from 'react';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import { useCoinStore } from '@/store/coinStore';
import { format } from 'date-fns';
import CurrencyChangeIndicator from '@/components/CurrencyChangeIndicator';

const fetchTickers = async (id: string): Promise<Ticker[]> => {
  const response = await fetch(`/api/tickers?coin=${id}`);

  if (!response.ok) throw new Error('Failed to fetch tickers');

  const tickers = await response.json();

  return tickers;
};

const Page = () => {
  const categories = ['Overview', 'News', 'Orders', 'Transactions'];
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: tickers,
    isLoading: isTickersLoading,
    error: tickersError,
  } = useQuery({
    queryKey: ['tickers'],
    queryFn: async () => await fetchTickers(id as string),
  });

  const formattedTickers = tickers
    ? tickers.map((ticker: Ticker) => ({
        timestamp: ticker.timestamp?.toString(),
        price: ticker.price ?? 0,
      }))
    : [];

  const coin: Coin = useCoinStore((state) => state.coin) as Coin;

  return (
    <>
      <Stack.Screen options={{ title: coin?.name }} />
      <SectionList
        style={{ marginTop: headerHeight }}
        keyExtractor={(i) => i.title}
        sections={[{ data: [{ title: 'Chart' }] }]}
        contentInsetAdjustmentBehavior="automatic"
        stickySectionHeadersEnabled={true}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingBottom: 8,
              backgroundColor: Colors.background,
              borderBottomColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveIndex(index)}
                style={
                  activeIndex === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
              >
                <Text
                  style={
                    activeIndex === index
                      ? styles.categoryTextActive
                      : styles.categoryText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 16,
              }}
            >
              <Text style={styles.subtitle}>{coin?.symbol}</Text>
              <Image
                source={{ uri: coin?.image || 'asset:/images/40.png' }}
                style={{ width: 40, height: 40 }}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primary,
                    flexDirection: 'row',
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="add" size={24} color={'#fff'} />
                <Text style={[defaultStyles.buttonText, { color: '#fff' }]}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primaryMuted,
                    flexDirection: 'row',
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text
                  style={[defaultStyles.buttonText, { color: Colors.primary }]}
                >
                  Receive
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <>
            <Loading show={isTickersLoading} />
            <ErrorMessage show={tickersError} />
            {!isTickersLoading && !tickersError && (
              <>
                <ErrorMessage
                  show={formattedTickers?.length === 0}
                  message="No data available"
                />
                {formattedTickers && formattedTickers.length > 0 && (
                  <Chart tickers={formattedTickers} />
                )}
              </>
            )}
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>Overview</Text>
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>Price change % 24h</Text>
                <Text style={styles.overviewValue}>
                  <CurrencyChangeIndicator
                    percentChange={coin.price_change_percentage_24h}
                  />
                </Text>
              </View>
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>All-time high price</Text>
                <Text style={styles.overviewValue}>
                  {coin.ath
                    ? new Intl.NumberFormat('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(coin.ath)
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>All-time high change %</Text>
                <Text style={styles.overviewValue}>
                  <CurrencyChangeIndicator
                    percentChange={coin.ath_change_percentage}
                  />
                </Text>
              </View>
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>All-time high Date</Text>
                <Text style={styles.overviewValue}>
                  {coin.ath_date
                    ? format(new Date(coin.ath_date), 'dd/MM/yyyy')
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>Max supply</Text>
                <Text style={styles.overviewValue}>
                  {coin.max_supply
                    ? new Intl.NumberFormat('de-DE').format(coin.max_supply)
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </>
        )}
      />
    </>
  );
};
export default Page;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: '#000',
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: 'regular',
    color: Colors.dark,
  },
});
