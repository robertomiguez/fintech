import Dropdown from '@/components/Dropdown';
import RoundBtn from '@/components/RoundBtn';
import WidgetList from '@/components/SortableList/WidgetList';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useBalanceStore } from '@/store/balanceStore';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
const Page = () => {
  const { balance, runTransaction, transactions, clearTransactions } =
    useBalanceStore();

  const onUpdateMoney = () => {
    const amount =
      Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1);
    runTransaction({
      id: Math.random().toString(),
      title: amount > 0 ? 'Added money' : 'deducted money',
      amount: amount,
      date: new Date(),
    });
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>£</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundBtn icon={'cash'} text={'Money'} onPress={onUpdateMoney} />
        <RoundBtn
          icon={'refresh'}
          text={'Exchange'}
          onPress={clearTransactions}
        />
        <RoundBtn icon={'list'} text={'Details'} />
        <Dropdown />
      </View>

      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {!transactions.length && (
          <Text style={{ padding: 14, color: Colors.gray }}>
            No transactions yet
          </Text>
        )}
        {[...transactions].reverse().map((transaction) => (
          <View
            key={transaction.id}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}
          >
            <View>
              <Ionicons
                name="cash-outline"
                size={20}
                color={transaction.amount > 0 ? Colors.blue : Colors.red}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '400' }}>{transaction.title}</Text>
              <Text style={{ color: Colors.gray, fontSize: 12 }}>
                {transaction.date.toLocaleString()}
              </Text>
            </View>
            <Text>{transaction.amount}£</Text>
          </View>
        ))}
      </View>

      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList />
    </ScrollView>
  );
};
export default Page;
const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 0,
  },
  balance: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 25,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 20,
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
