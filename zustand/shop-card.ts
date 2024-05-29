import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, SetState } from "zustand";

// Karta interfeysi
interface Card extends Product {
  count: number;
}

// Karta do'kon interfeysi
interface CardStore {
  cards: Card[];
  loading: boolean;
  error: string;
  loadCards: () => Promise<void>;
  addCard: (newCard: Product) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  updateCard: (updatedCard: Product) => Promise<void>;
  setError: (errorMessage: string) => void;
  setLoading: (isLoading: boolean) => void;
}

// Karta do'koni ma'lumotlarini saqlash uchun zustand hook'ini o'rnatish
const useCardStore = create<CardStore>((set: SetState<CardStore>) => ({
  cards: [],
  loading: true,
  error: "",

  // Karta ma'lumotlarini yuklash
  loadCards: async () => {
    try {
      const cards = await AsyncStorage.getItem("cards");
      if (cards !== null) {
        set((state) => ({
          ...state,
          cards: JSON.parse(cards),
          loading: false,
        }));
      }
    } catch (error) {
      console.log("Xatolik: ", error);
      set((state) => ({ ...state, error: "Error", loading: false }));
    }
  },

  // Karta qo'shish
  addCard: async (newCard: Product) => {
    const newCardObj: Card = { ...newCard, count: 1 };
    set((state) => {
      const cardExists = state.cards.some((card) => card._id === newCard._id);
      if (!cardExists) {
        const updatedCards = [...state.cards, newCardObj];
        AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
        return { ...state, cards: updatedCards };
      }
      return state;
    });
  },

  // Karta o'chirish
  removeCard: async (cardId: string) => {
    set((state) => {
      const updatedCards = state.cards.filter((el) => el._id !== cardId);
      AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
      return { ...state, cards: updatedCards };
    });
  },

  // Karta yangilash
  updateCard: async (updatedCard: Product) => {
    set((state: any) => {
      const updatedCards = state.cards.map((card: Product) =>
        card._id === updatedCard._id ? updatedCard : card
      );
      AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
      return { ...state, cards: updatedCards };
    });
  },

  // Xatolikni sozlash
  setError: (errorMessage: string) =>
    set((state) => ({ ...state, error: errorMessage })),

  // Yuklashni sozlash
  setLoading: (isLoading: boolean) =>
    set((state) => ({ ...state, loading: isLoading })),
}));

export default useCardStore;
