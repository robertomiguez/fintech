import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';

const ErrorMessage = ({
  show,
  message,
}: {
  show: Error | null | boolean;
  message?: string;
}) => {
  if (!show) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>Sorry for the inconvenience.</Text>
      <Text style={styles.message}>Message: {message}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.dark,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default ErrorMessage;
