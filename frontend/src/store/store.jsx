import { create } from 'zustand';
import { io } from 'socket.io-client';


const useChatStore = create((set) => ({
  selectedUser: null, // will store user object or null
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),
}));

export default useChatStore;


// store/viewStore.js

export const useViewStore = create((set) => ({
  showChat: false,
  setShowChat: (value) => set({ showChat: value }),
}));



const socket = io('http://localhost:5000');

export const useSocketStore = create(() => ({
  socket
}));



