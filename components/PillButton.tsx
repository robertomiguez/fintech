import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

interface PillButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: object;
}

const PillButton = ({ onPress, title, disabled, style }: PillButtonProps) => (
  <TouchableOpacity
    style={[styles.button, disabled ? styles.disabled : styles.enabled, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={defaultStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.pillButton,
    width: 250,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default PillButton;
