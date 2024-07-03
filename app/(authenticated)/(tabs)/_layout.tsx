import CustomHeader from '@/components/CustomHeader';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === 'ios' ? 100 : 250}
            tint="systemUltraThinMaterialLight"
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="registered" size={size} color={color} />
          ),
          header: () => <CustomHeader />,
          headerTransparent: true,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Invest',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="line-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Transfer',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="registered" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="crypto"
        options={{
          title: 'Crypto',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="bitcoin" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lifestyle"
        options={{
          title: 'Lifestyle',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="th" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default _layout;
