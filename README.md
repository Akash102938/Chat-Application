A modern, responsive chat app built with React + Vite.
It simulates OTP login, chatroom management, Gemini-style AI replies, image uploads, dark mode, and local persistence.

✨ Features

Authentication: OTP login/signup with country codes (fetched from RestCountries API), validated using React Hook Form + Zod.

Dashboard: Create/Delete chatrooms with toast confirmations.

Chatroom:

User + AI messages with timestamps

“Gemini is typing…” indicator + delayed AI replies

Infinite scroll for older messages (dummy data) + pagination

Auto-scroll to latest message

Image uploads (base64/preview)

Copy message to clipboard on hover

Global UX: Mobile-responsive design, Dark mode toggle, Debounced search, LocalStorage persistence, Loading skeletons, Toast notifications, Keyboard accessible.

🚀 Getting Started
Prerequisites

Node.js >= 18

npm or yarn

Installation
git clone <your-repo-url>
cd <your-repo-folder>
npm install

Development
npm run dev


Runs the app in development (default: http://localhost:5173
).

Production
npm run build
npm run preview


Builds optimized assets and serves them locally for testing.

🛠️ Tech Stack

React + Vite

Zustand for state management

React Hook Form + Zod for form validation

TailwindCSS for styling

Toast & Skeleton loaders for UX

LocalStorage for persistence

📦 Project Structure
src/
 ├─ components/   # UI components
 ├─ store/        # Zustand stores (auth, chat)
 ├─ features/     # Auth, Chatroom, Chat modules
 ├─ utils/        # Helpers (fetch countries, OTP simulation)
 ├─ App.jsx       # Routes + layout
 └─ main.jsx      # Vite entry

📌 Notes

OTP & AI replies are simulated with setTimeout.
