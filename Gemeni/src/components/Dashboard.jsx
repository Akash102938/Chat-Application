import React, { useMemo, useState } from 'react';
import useChatStore from '../store/chatStore';
import useDebounce from '../hooks/useDebounce';

export default function Dashboard() {
  const { chatrooms, addChatroom, deleteChatroom, setCurrentRoom, currentRoomId } = useChatStore((s) => s);
  const [q, setQ] = useState('');
  const dq = useDebounce(q, 300);

  const filtered = useMemo(
    () => chatrooms.filter((r) => r.title.toLowerCase().includes(dq.toLowerCase())),
    [chatrooms, dq]
  );

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded shadow">
      <div className="flex items-center gap-2 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Search chats..."
          aria-label="Search chats"
        />
        <button
          onClick={() => addChatroom('New chat')}
          className="p-2 border rounded"
          aria-label="Add new chatroom"
        >
          + New
        </button>
      </div>

      <ul className="space-y-2 max-h-[60vh] overflow-auto">
        {filtered.length === 0 && (
          <li className="text-center text-gray-500 py-8">No chatrooms found.</li>
        )}
        {filtered.map((r) => (
          <li
            key={r.id}
            className={`p-2 rounded cursor-pointer flex justify-between items-center ${
              r.id === currentRoomId ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
            }`}
          >
            <button
              onClick={() => setCurrentRoom(r.id)}
              className="flex-1 text-left focus:outline-none"
              aria-label={`Open chatroom ${r.title}`}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {r.messages.length} messages
              </div>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                deleteChatroom(r.id);
              }}
              className="text-sm text-red-500 ml-2"
              aria-label={`Delete chatroom ${r.title}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
