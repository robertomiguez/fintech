import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { recordStartTime, getStartTime } from '@/store/mmks-storage';

interface UserInactivityProviderProps {
  children: ReactNode;
}

export const UserInactivityProvider = ({
  children,
}: UserInactivityProviderProps) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleAppStageChange = useCallback(
    (nextAppstate: AppStateStatus) => {
      if (nextAppstate === 'background') {
        recordStartTime();
      } else if (
        nextAppstate === 'active' &&
        appState.current.match(/background/)
      ) {
        const startTime = getStartTime();
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        if (elapsed > 3000 && isSignedIn) {
          router.push('/(authenticated)/(modals)/lock');
        }
      }
      appState.current = nextAppstate;
    },
    [isSignedIn, router]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStageChange
    );
    return () => {
      subscription.remove();
    };
  }, [handleAppStageChange]);

  return children;
};
