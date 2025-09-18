import React from 'react';

export default function Message({ m }) {
  const isUser = m.sender === 'user';
  const canCopy = !!m.text;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[70%] p-2 rounded ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
        {m.image ? (
          <img src={m.image} alt={m.text ? m.text : "uploaded image"} className="max-h-48 w-auto rounded" />
        ) : (
          <div>{m.text}</div>
        )}
        {canCopy && (
          <div className="text-xs mt-1 opacity-70 flex gap-2 justify-end">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(m.text);
                  // Optionally use toast here
                  // toast.success('Copied!');
                  console.log('copied');
                } catch (e) {
                  console.error(e);
                }
              }}
              className="underline"
              aria-label="Copy message"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}