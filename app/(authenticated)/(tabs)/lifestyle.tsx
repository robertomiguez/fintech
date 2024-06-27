import { StyleSheet, Text, View } from 'react-native';
const Page = () => {
  return (
    <View>
      <Text style={styles.container}>Page</Text>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
