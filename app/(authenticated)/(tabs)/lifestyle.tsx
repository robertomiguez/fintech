import { StyleSheet, Text, View } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { useHeaderHeight } from '@react-navigation/elements';

const Page = () => {
  const headerHeight = useHeaderHeight();
  return (
    <View style={{ paddingTop: headerHeight }}>
      <Text style={defaultStyles.sectionHeader}>Not Implemented</Text>
      <Text style={defaultStyles.sectionHeader}>
        The Life style feature has not been implemented yet.
      </Text>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
