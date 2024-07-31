import Colors from '@/constants/Colors';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserInactivityProvider } from '@/context/UserInactivity';

const queryClient = new QueryClient();

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('Error getting token:', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('Error saving token:', error);
    }
  },
};

const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('isLoaded', isLoaded);
    console.log('isSignedIn', isSignedIn);
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(authenticated)';

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(authenticated)/(tabs)/home');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  if (!loaded || !isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="authpage"
          options={{
            title: '',
            headerBackTitle: '',
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={30} color={Colors.dark} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <Link href={'/help'} asChild>
                <TouchableOpacity>
                  <Ionicons
                    name="help-circle-outline"
                    size={30}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="help"
          options={{ title: 'Help', presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="verify/[phone]"
          options={{
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={30} color={Colors.dark} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(authenticated)/(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(authenticated)/crypto/[id]"
          options={{
            title: '',
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={30} color={Colors.dark} />
              </TouchableOpacity>
            ),
            headerLargeTitle: true,
            headerTransparent: true,
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={router.back}>
                  <Ionicons
                    name="notifications-outline"
                    size={30}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={router.back}>
                  <Ionicons name="star-outline" size={30} color={Colors.dark} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="(authenticated)/(modals)/lock"
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen
          name="(authenticated)/(modals)/account"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            title: '',
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="close-outline" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <UserInactivityProvider>
          <InitialLayout />
        </UserInactivityProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
