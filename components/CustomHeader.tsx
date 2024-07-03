import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();

  return (
    <BlurView
      intensity={Platform.OS === 'ios' ? 100 : 250}
      tint="systemUltraThinMaterialLight"
      style={{ paddingTop: top }}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.roundBtn}>
          <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>
            RM
          </Text>
        </TouchableOpacity>
        <View style={styles.searchSection}>
          <Ionicons
            style={styles.searchIcon}
            name="search"
            size={20}
            color={Colors.dark}
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor={Colors.dark}
          />
        </View>
        <View style={styles.circle}>
          <Ionicons name="stats-chart" size={20} color={Colors.dark} />
        </View>
        <View style={styles.circle}>
          <Ionicons name="card" size={20} color={Colors.dark} />
        </View>
      </View>
    </BlurView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 60,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    color: Colors.dark,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
