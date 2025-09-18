import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as mockApi from '../api/mockApi';

const initial = [
  { id: 'room-1', title: 'General', messages: [] },
];

const useChatStore = create(
  persist(
    (set, get) => ({
      chatrooms: initial,
      currentRoomId: initial[0].id,
      addChatroom: (title) => {
        const id = `room-${Date.now()}`;
        set((s) => ({
          chatrooms: [...s.chatrooms, { id, title, messages: [] }],
          currentRoomId: id,
        }));
        return id;
      },
      deleteChatroom: (id) =>
        set((s) => ({
          chatrooms: s.chatrooms.filter((r) => r.id !== id),
          currentRoomId: s.chatrooms[0]?.id || null,
        })),
      setCurrentRoom: (id) => set(() => ({ currentRoomId: id })),
      addMessage: (roomId, message) =>
        set((s) => ({
          chatrooms: s.chatrooms.map((r) =>
            r.id === roomId
              ? { ...r, messages: [...r.messages, message] }
              : r
          ),
        })),
      loadOlderMessages: (roomId) => {
        const older = Array.from({ length: 8 }).map((_, i) => ({
          id: `older-${Date.now()}-${i}`,
          sender: i % 2 ? 'user' : 'ai',
          text: `Older message ${i + 1}`,
          ts: Date.now() - (i + 1) * 100000,
        }));
        set((s) => ({
          chatrooms: s.chatrooms.map((r) =>
            r.id === roomId
              ? { ...r, messages: [...older, ...r.messages] }
              : r
          ),
        }));
      },
      simulateAiReply: async (roomId, userMessage) => {
        const typingId = `typing-${Date.now()}`;
        set((s) => ({
          chatrooms: s.chatrooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  messages: [
                    ...r.messages,
                    {
                      id: typingId,
                      sender: 'ai',
                      text: 'Gemini is typing...',
                      typing: true,
                    },
                  ],
                }
              : r
          ),
        }));

        const reply = await mockApi.aiReply(userMessage);

        set((s) => ({
          chatrooms: s.chatrooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  messages: r.messages
                    .filter((m) => m.id !== typingId)
                    .concat([
                      {
                        id: `${Date.now()}`,
                        sender: 'ai',
                        text: reply,
                        ts: Date.now(),
                      },
                    ]),
                }
              : r
          ),
        }));
      },
    }),
    {
      name: 'chat-storage', // key in localStorage
    }
  )
);

export default useChatStore;
