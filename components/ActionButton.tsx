import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface ActionButtonProps {
  iconName: IoniconsName;
  text: string;
  onPress?: () => void;
  textColor: string;
  notificationCount?: number;
}

const ActionButton = ({
  iconName,
  text,
  onPress,
  textColor,
  notificationCount,
}: ActionButtonProps) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Ionicons name={iconName} size={24} color={'#fff'} />
    <Text style={{ color: textColor, fontSize: 18, flex: 1 }}>{text}</Text>
    {notificationCount !== undefined && (
      <View style={styles.notification}>
        <Text style={styles.notificationText}>{notificationCount}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    padding: 14,
    flexDirection: 'row',
    gap: 20,
  },
  notification: {
    backgroundColor: Colors.gray,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  notificationText: {
    color: Colors.lightGray,
    fontSize: 12,
  },
});

export default ActionButton;
