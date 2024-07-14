import { create } from 'zustand';
import { Coin } from '@/types/crypto';

interface CoinState {
  coin: Coin | null;
  setCoin: (coin: Coin) => void;
}

export const useCoinStore = create<CoinState>((set) => ({
  coin: null,
  setCoin: (coin: Coin) => set({ coin }),
}));
