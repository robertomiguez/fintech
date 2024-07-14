import type { Coin } from '@/types/crypto';
import { useCoinStore } from '@/store/coinStore';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import CurrencyChangeIndicator from '@/components/CurrencyChangeIndicator';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

const fetchCoins = async () => {
  const response = await fetch('/api/listings');
  if (!response.ok) throw new Error('Failed to fetch coins');
  return await response.json();
};

const Page = () => {
  const headerHeight = useHeaderHeight();
  const {
    data: coins,
    isLoading: isCoinsLoading,
    error: coinsError,
  } = useQuery({ queryKey: ['coins'], queryFn: fetchCoins });

  const setCoin = useCoinStore((state) => state.setCoin);
  const coinClick = (coin: Coin) => {
    setCoin(coin);
  };

  return (
    <View style={{ flex: 1 }}>
      <Loading show={isCoinsLoading} />
      <ErrorMessage show={coinsError} />
      {!isCoinsLoading && !coinsError && (
        <>
          <ErrorMessage
            show={coins?.length === 0}
            message="No data available"
          />
          {coins && coins.length > 0 && (
            <ScrollView
              style={{ backgroundColor: Colors.background }}
              contentContainerStyle={{ paddingTop: headerHeight }}
            >
              <Text style={defaultStyles.sectionHeader}>Latest Cryptos</Text>
              <View style={defaultStyles.block}>
                {coins?.map((coin: Coin) => (
                  <Link key={coin.id} href={`/crypto/${coin.id}`} asChild>
                    <TouchableOpacity
                      onPress={() => coinClick(coin)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                      }}
                    >
                      <Image
                        source={{
                          uri: coin?.image || 'asset:/images/40.png',
                        }}
                        style={{ width: 40, height: 40 }}
                      />
                      <View style={{ flex: 1, gap: 5 }}>
                        <Text style={{ fontWeight: '600', color: Colors.dark }}>
                          {coin.name}
                        </Text>
                        <Text style={{ color: Colors.gray }}>
                          {coin.symbol}
                        </Text>
                      </View>
                      <View style={{ gap: 6, alignItems: 'flex-end' }}>
                        <Text style={{ fontWeight: '600', color: Colors.dark }}>
                          {coin.current_price} ?
                        </Text>
                        <CurrencyChangeIndicator
                          percentChange={coin.price_change_percentage_24h}
                        />
                      </View>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};
export default Page;
