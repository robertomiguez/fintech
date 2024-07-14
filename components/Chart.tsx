import { defaultStyles } from '@/constants/Styles';
import { format } from 'date-fns';
import { View, TextInput, Text } from 'react-native';
import Colors from '@/constants/Colors';
import {
  CartesianChart,
  ChartPressState,
  Line,
  useChartPressState,
} from 'victory-native';
import Animated from 'react-native-reanimated';
import { Circle, useFont } from '@shopify/react-native-skia';
import SpaceMonoRegular from '@/assets/fonts/SpaceMono-Regular.ttf';
import { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { Ticker } from '@/types/crypto';

Animated.addWhitelistedNativeProps({ text: true, defaultValue: true });

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface ChartProps {
  tickers: Ticker[];
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const Chart = ({ tickers }: ChartProps) => {
  const font = useFont(SpaceMonoRegular, 12);
  const { state, isActive } = useChartPressState<{
    x: number;
    y: {
      price: number;
    };
  }>({
    x: 0,
    y: { price: 0 },
  });

  useEffect(() => {
    if (isActive) {
      Haptics.selectionAsync();
    }
  }, [isActive]);

  const AnimatedText = useAnimatedProps(() => {
    return {
      text: `${state.y.price.value.value.toFixed(2)}`,
      defaultValue: '',
    };
  });
  const AnimatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}`,
      defaultValue: '',
    };
  });

  return (
    <>
      <View style={[defaultStyles.block, { height: 500 }]}>
        {!isActive && (
          <View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: Colors.dark,
              }}
            >
              {tickers?.[tickers.length - 1]?.price.toFixed(2) || 0}
            </Text>
            <Text style={{ fontSize: 18, color: Colors.gray }}>Today</Text>
          </View>
        )}
        {isActive && (
          <View>
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={'transparent'}
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: Colors.dark,
              }}
              animatedProps={AnimatedText}
            />
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={'transparent'}
              style={{ fontSize: 18, color: Colors.gray }}
              animatedProps={AnimatedDateText}
            />
          </View>
        )}

        <CartesianChart
          chartPressState={[
            state as unknown as ChartPressState<{
              x: never;
              y: Record<never, number>;
            }>,
          ]}
          axisOptions={{
            font,
            tickCount: 5,
            labelOffset: { x: -2, y: 0 },
            labelColor: Colors.gray,
            formatYLabel: (v) => `${v} ?`,
            formatXLabel: (ms) => format(new Date(ms), 'MM/yy'),
          }}
          data={tickers as unknown as Record<string, unknown>[]}
          xKey={'timestamp' as never}
          yKeys={['price'] as never[]}
        >
          {({ points }: { points: unknown }) => (
            <>
              <Line
                points={points.price}
                color={Colors.primary}
                strokeWidth={3}
              />
              {isActive && (
                <ToolTip x={state.x.position} y={state.y.price.position} />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </>
  );
};
export default Chart;
