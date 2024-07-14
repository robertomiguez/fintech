import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';

const Loading = ({ show }: { show: boolean }) => {
  if (!show) {
    return <></>;
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
  },
});

export default Loading;
