// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Currency } from '@/types/crypto';
import { useQuery } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import { Image } from 'react-native';

const Page = () => {
  const currencies = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await fetch('/api/listings');
      return response.json();
    },
  });

  const id = currencies.data?.map((currency: Currency) => currency.id);
  const { data } = useQuery({
    queryKey: ['info', id],
    queryFn: async () => {
      const response = await fetch(`/api/info?id=${id}`);
      return response.json();
    },
    enabled: !!id,
  });

  return (
    <View>
      {currencies.data?.map((currency: Currency) => (
        <View
          key={currency.id}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Image
            source={{
              uri: data?.[currency.id]?.logo || 'asset:/images/50.png',
            }}
            style={{ width: 50, height: 50 }}
          />
          <Text>{currency.name}</Text>
        </View>
      ))}
    </View>
  );
};
export default Page;
