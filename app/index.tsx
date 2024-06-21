import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAssets } from 'expo-asset';
import { Video, ResizeMode } from 'expo-av';
import { Link } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const Page = () => {
  const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {assets && (
          <Video
            shouldPlay
            isLooping
            isMuted
            source={{ uri: assets[0].uri }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.header}> Ready to change the way you money?</Text>
        </View>
        <View style={styles.buttons}>
          <Link
            href={'/login'}
            style={[
              defaultStyles.pillButton,
              { flex: 1, backgroundColor: Colors.dark },
            ]}
            asChild
          >
            <TouchableOpacity>
              <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>
                Log in
              </Text>
            </TouchableOpacity>
          </Link>
          <Link
            href={'/sign up'}
            style={[
              defaultStyles.pillButton,
              { flex: 1, backgroundColor: 'white' },
            ]}
            asChild
          >
            <TouchableOpacity>
              <Text style={{ fontSize: 22, fontWeight: '500' }}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};
export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    top: 110,
    left: 30,
    right: 30,
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'white',
  },
  buttons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
});
