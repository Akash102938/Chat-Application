import React, { useEffect, useRef, useState } from 'react';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore'; // <-- Import auth store
import Message from './Message';

export default function ChatRoom() {
  const { chatrooms, currentRoomId, addMessage, simulateAiReply, loadOlderMessages } = useChatStore((s) => s);
  const logout = useAuthStore((s) => s.logout); // <-- Get logout function
  const room = chatrooms.find((r) => r.id === currentRoomId) || chatrooms[0];
  const [text, setText] = useState('');
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  // Keyboard shortcut for file input (Ctrl+U)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        fileRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // auto-scroll when messages change
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [room?.messages?.length]);

  const onSend = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const msg = { id: `m-${Date.now()}`, sender: 'user', text: text.trim(), ts: Date.now() };
    addMessage(room.id, msg);
    setText('');
    simulateAiReply(room.id, msg.text);
  };

  const onInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const msg = { id: `m-${Date.now()}`, sender: 'user', image: url, ts: Date.now() };
    addMessage(room.id, msg);
    simulateAiReply(room.id, '[image]');
    fileRef.current.value = '';
    setTimeout(() => URL.revokeObjectURL(url), 1000); // Clean up
  };

  const onScroll = (ev) => {
    if (ev.target.scrollTop < 160) {
      // user scrolled to top - load older messages
      loadOlderMessages(room.id);
    }
  };

  // Guard for no chatrooms
  if (!room) {
    return (
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto mt-4 sm:mt-8 bg-white dark:bg-gray-800 p-2 sm:p-4 rounded shadow flex flex-col h-[75vh] min-h-[400px]">
        <div className="text-center text-gray-500 mt-10">No chatrooms available.</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto mt-4 sm:mt-8 bg-white dark:bg-gray-800 p-2 sm:p-4 rounded shadow flex flex-col h-[75vh] min-h-[400px]">
      {/* Logout button at the top right */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <div>
          <h3 className="font-semibold">{room?.title}</h3>
          <div className="text-xs text-gray-500">{room?.messages?.length} messages</div>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-auto chat-scroll p-2"
        aria-label="Chat messages"
      >
        {(!room || room.messages.length === 0) && (
          <div className="text-sm text-gray-500">No messages yet — say hi 👋</div>
        )}
        {room.messages.map((m) => (
          <Message key={m.id} m={m} />
        ))}
      </div>

      <form onSubmit={onSend} className="mt-2 flex gap-2 flex-wrap" aria-label="Send message">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Type a message..."
          className="flex-1 border rounded p-2 min-w-[120px] dark:bg-gray-800 dark:text-white"
          aria-label="Message input"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          id="file-input"
        />
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="p-2 border rounded"
          aria-label="Attach image"
        >
          📎
        </button>
        <button
          type="submit"
          className="p-2 bg-indigo-600 text-white rounded"
          disabled={!text.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}