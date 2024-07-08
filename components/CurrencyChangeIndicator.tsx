import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CurrencyChangeIndicatorProps {
  percentChange: number;
}

const CurrencyChangeIndicator = ({
  percentChange,
}: CurrencyChangeIndicatorProps) => {
  const isPositive = percentChange > 0;
  const iconName = isPositive ? 'caret-up' : 'caret-down';
  const color = isPositive ? 'green' : 'red';

  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <Ionicons name={iconName} size={16} color={color} />
      <Text style={{ color }}>{percentChange?.toFixed(2)}%</Text>
    </View>
  );
};

export default CurrencyChangeIndicator;
