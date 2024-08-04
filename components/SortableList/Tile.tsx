import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

import { SIZE } from './Config';
import Colors from '@/constants/Colors';
import { useBalanceStore } from '@/store/balanceStore';
import { Ionicons } from '@expo/vector-icons';
import { showNotImplementedAlert } from '@/utils/alertUtils';

const styles = StyleSheet.create({
  container: {
    width: SIZE - 20,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    padding: 14,
    alignSelf: 'center',
  },
});
interface TileProps {
  id: string;
  onLongPress: () => void;
}

const Tile = ({ id }: TileProps) => {
  const { transactions } = useBalanceStore();

  if (id === 'spent') {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          showNotImplementedAlert('Spent this month', 'Drag to reorder');
        }}
      >
        <Text style={{ color: Colors.gray, fontWeight: '500', fontSize: 16 }}>
          Spent this month
        </Text>
        <Text
          style={{
            color: Colors.dark,
            fontWeight: 'bold',
            fontSize: 26,
            paddingTop: 10,
          }}
        >
          1024€
        </Text>
      </TouchableOpacity>
    );
  }

  if (id === 'cashback') {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
        onPress={() => showNotImplementedAlert('Cashback', 'Drag to reorder')}
      >
        <View
          style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
              7.5%
            </Text>
          </View>
          <Text
            style={{ color: Colors.gray, fontWeight: 'bold', fontSize: 18 }}
          >
            Cashback
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (id === 'recent') {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          showNotImplementedAlert('Recent transaction', 'Drag to reorder')
        }
      >
        <View>
          <Text style={{ color: Colors.gray, fontWeight: '500', fontSize: 16 }}>
            Recent transaction
          </Text>

          {transactions.length === 0 && (
            <Text
              style={{
                color: Colors.gray,
                fontWeight: 'bold',
                fontSize: 18,
                paddingTop: 10,
              }}
            >
              No transactions
            </Text>
          )}

          {transactions.length > 0 && (
            <>
              <Text
                style={{
                  color: Colors.dark,
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingVertical: 10,
                }}
              >
                {transactions[transactions.length - 1].amount}€
              </Text>
              <Text
                style={{ color: Colors.gray, fontWeight: 'bold', fontSize: 16 }}
              >
                {transactions[transactions.length - 1].title}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (id === 'cards') {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => showNotImplementedAlert('Cards', 'Drag to reorder')}
      >
        <Text style={{ color: Colors.gray, fontWeight: '500', fontSize: 16 }}>
          Cards
        </Text>
        <Ionicons
          name="card"
          size={50}
          color={Colors.primaryMuted}
          style={{ marginTop: 20, alignSelf: 'center' }}
        />
      </TouchableOpacity>
    );
  }
};

export default Tile;
