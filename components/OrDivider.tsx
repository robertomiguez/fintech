import Colors from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

const OrDivider = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View style={styles.line} />
      <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
      <View style={styles.line} />
    </View>
  );
};
export default OrDivider;
const styles = StyleSheet.create({
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
  },
});
