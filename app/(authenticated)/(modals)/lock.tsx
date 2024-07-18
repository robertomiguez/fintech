import Colors from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import Keyboard from '@/components/Keyboard';

const Page = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [code, setCode] = useState<number[]>([]);
  const codeLength = Array(6).fill(0);
  const router = useRouter();

  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  const OFFSET = 20;
  const TIME = 100;

  useEffect(() => {
    const onBackPress = () => {
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      // :TODO: Replace with actual passcode
      if (code.join('') === '123456') {
        router.replace('/(authenticated)/home');
      } else {
        (offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME }), 10, true),
          withTiming(0, { duration: TIME / 2 })
        )),
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setCode([]);
      }
    }
  }, [code, offset, router]);

  const onNumberPress = (number: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode([...code, number]);
  };

  const numberBackSpace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(code.slice(0, -1));
  };

  const onBiometricAuthPress = async () => {
    const { success } = await LocalAuthentication.authenticateAsync();
    if (success) {
      router.replace('/(authenticated)/home');
    } else {
      console.warn('biometric auth failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.greeting}>Welcome back, {firstName}</Text>

        <Animated.View style={[styles.codeView, style]}>
          {codeLength.map((_, index) => (
            <View
              key={index}
              style={[
                styles.codeEmpty,
                {
                  backgroundColor: code[index]
                    ? Colors.primary
                    : Colors.lightGray,
                },
              ]}
            />
          ))}
        </Animated.View>
        <Keyboard
          onNumberPress={onNumberPress}
          numberBackSpace={numberBackSpace}
          onBiometricAuthPress={onBiometricAuthPress}
          code={code}
        />

        <Text
          style={{
            alignSelf: 'center',
            color: Colors.primary,
            fontWeight: 'bold',
            fontSize: 18,
            marginTop: 50,
          }}
        >
          Forgot your passcode?
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    alignSelf: 'center',
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 70,
  },
  codeEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
