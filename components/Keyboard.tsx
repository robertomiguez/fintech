import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface KeyboardProps {
  onNumberPress: (number: number) => void;
  numberBackSpace: () => void;
  onBiometricAuthPress: () => void;
  code: number[];
}

const NumberButton = ({
  number,
  onPress,
}: {
  number: number;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.number}>{number}</Text>
  </TouchableOpacity>
);

const Keyboard = ({
  onNumberPress,
  numberBackSpace,
  onBiometricAuthPress,
  code,
}: KeyboardProps) => {
  const renderNumberRow = (numbers: number[]) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {numbers.map((number) => (
        <NumberButton
          key={number}
          number={number}
          onPress={() => onNumberPress(number)}
        />
      ))}
    </View>
  );
  return (
    <View style={styles.numbersView}>
      {renderNumberRow([1, 2, 3])}
      {renderNumberRow([4, 5, 6])}
      {renderNumberRow([7, 8, 9])}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={onBiometricAuthPress}>
          <MaterialCommunityIcons
            name="fingerprint"
            size={32}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <NumberButton number={0} onPress={() => onNumberPress(0)} />
        <TouchableOpacity
          onPress={numberBackSpace}
          disabled={code.length === 0}
        >
          <MaterialCommunityIcons
            name="backspace-outline"
            size={32}
            color={code.length === 0 ? Colors.lightGray : Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Keyboard;
const styles = StyleSheet.create({
  numbersView: {
    marginHorizontal: 70,
    gap: 40,
  },
  number: {
    fontSize: 32,
  },
});
