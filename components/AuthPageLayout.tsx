import { ReactNode } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { defaultStyles } from '@/constants/Styles';

interface AuthPageLayoutProps {
  children: ReactNode;
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={defaultStyles.container}>{children}</View>
  </GestureHandlerRootView>
);

export default AuthPageLayout;
