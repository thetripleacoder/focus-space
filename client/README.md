# Focus Space Client Application (Frontend) 💻

This is the client-side application for the **Focus Space** productivity platform, built as a modern Single-Page Application (SPA) using **React** and managed with **Vite**. It provides a rich user interface with **hybrid state management** (React Query + Redux), real-time data synchronization through **Socket.IO**, blog management with **optimistic updates**, and integrated **Productivity Tools** for focused work.

---

## Technical Stack & Architecture 🚀

The frontend is a contemporary React application prioritizing centralized state, real-time data flow, and a modular architecture for easy maintenance and expansion.

| Technology | Core Role | Wiring & Integration |
| :--- | :--- | :--- |
| **React** | Component-Based UI | **`src/main.jsx`** renders the root `<App />` component, handling the routing and providing the Redux store and MUI theme context. |
| **Vite** | Build Tool & Dev Server | Used for fast development (`npm run dev`) and efficient bundling (`npm run build`). |
| **TanStack Query (React Query)** | Server State Management | **`src/hooks/useBlogs.js`** provides custom hooks for blog CRUD operations with **optimistic updates**, caching, and background refetching. |
| **Redux Toolkit** | Client State Management | **`src/store.js`** manages **`user`** authentication and **`notification`** states. Redux handles UI state and cross-component communication. |
| **React Router v6** | Client-Side Routing | **`src/App.jsx`** defines all application routes and uses authentication logic to guard navigation. |
| **Socket.IO Client** | Real-time Updates | **`src/App.jsx`** connects the socket client upon user login. **`src/socketListeners.js`** maps incoming server events (`blogCreated`, `blogUpdated`, etc.) to **React Query cache invalidation**, instantly updating the UI state. |
| **MUI & Tailwind CSS** | Styling and UI Components | **`@mui/material`** provides rich components, styled via **`@emotion`**. **`tailwindcss`** is used for utility-first styling (imported in `src/index.css`). |
| **Local Storage** | Client-side Persistence | Used by the **`TasksTool`**, **`JournalTool`**, and **`userReducer`** to store session data (JWT) and user-specific tool data persistently across sessions and tabs. |

---

## Key Functional Wiring 💡

### 1. Hybrid State Management (React Query + Redux)

The application uses a **hybrid state management approach** optimized for different types of state:

#### **Server State (React Query):**

* **Blog Operations:** **`src/hooks/useBlogs.js`** provides custom hooks (`useBlogs`, `useCreateBlog`, `useUpdateBlog`, `useDeleteBlog`, `useLikeBlog`) with **optimistic updates** for immediate UI feedback.
* **Caching & Synchronization:** Automatic background refetching, cache invalidation, and real-time updates via Socket.IO integration.
* **Optimistic Updates:** All blog mutations provide instant UI feedback with automatic rollback on API errors.

#### **Client State (Redux):**

* **Central Store (`src/store.js`):** Manages **`user`** authentication and **`notification`** states via **`useSelector`** hook.
* **User Session:** The **`userReducer`** handles **JWT tokens** and user profiles, persisting to **`localStorage`** using `src/services/localStorage.js`.
* **UI State:** Notifications, modal states, and cross-component communication.

#### **Blog Editing Features:**

* **Owner-Only Editing:** Users can edit/delete their own blogs from the blog list, detail pages, and profile page.
* **Inline Editing:** Click-to-edit functionality with title and genre modifications.
* **Permission Checks:** Edit controls only appear for blog owners (`isAddedByUser` flag).
* **Real-time Sync:** Changes are immediately reflected across all views via React Query.

#### **Like System:**

* **Toggle Functionality:** Users can like and unlike blogs (one like per user per blog).
* **Optimistic Updates:** Like counts update instantly with proper rollback on errors.
* **Real-time Sync:** Like changes broadcast to all connected users via Socket.IO.

### 2. Real-time Synchronization

The client maintains a persistent, event-driven connection to the server for instant cross-user updates:

* **Managed Connection:** The Socket.IO client is initialized in **`src/socket.js`** and its connection/disconnection lifecycle is tightly coupled with the user's login state in **`App.jsx`**.
* **Event Handling (`src/socketListeners.js`):** Maps server events to **React Query cache invalidation**. When the server broadcasts events (`blogCreated`, `blogUpdated`, `blogDeleted`), the listeners trigger cache invalidation, causing React Query to refetch data and update the UI instantly across all connected clients.
* **Optimistic + Real-time Combo:** Local optimistic updates provide immediate feedback, while Socket.IO ensures consistency when multiple users interact simultaneously.

### 3. Integrated Productivity Tools (Client-Side State)

The application includes dedicated tools for focus and productivity, all managed **client-side** for speed and responsiveness.

| Tool | Purpose | Persistence Mechanism | Key Features |
| :--- | :--- | :--- | :--- |
| **`TasksTool`** | Task management and prioritization. | **`localStorage`** (key: `focus-space-tasks`) | Tasks are categorized by **High, Medium, and Low** priority for effective filtering. Includes multi-tab synchronization via the browser's `storage` event listener. |
| **`PomodoroTimerTool`** | Focus and break time management. | **`localStorage`** (key: `focus-space-pomodoro`) | Customizable focus/break durations, session tracking, and a modal for settings adjustment and session completion alerts. Uses `useEffect` and `useRef` for precise timer logic. |
| **`JournalTool`** | Quick logging of thoughts and notes. | **`localStorage`** (key: `focus-space-journal`) | Logs entries with timestamps and uses a simple confirmation dialog for removal. |

These tools utilize **React's local state** (`useState`) and persist their data directly to **`localStorage`**, keeping the Redux store focused purely on backend-synced data (blogs and users).

---

## Router Structure 🧭

All routes are defined in **`App.jsx`** and are guarded by the `loggedUser` state:

| Route Path | Component | Authentication Required | Notes |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginForm` | No | Default unauthenticated route. |
| `/register` | `RegisterForm` | No | User creation form. |
| `/home` | `Blogs` | **Yes** | Main blog list page with filtering and sorting. |
| `/blogs/:id` | `BlogDetails` | **Yes** | Displays a single blog post. |
| `/users` | `Users` | **Yes** | List of all application users. |
| `/users/:id` | `OtherUserProfile` | **Yes** | Profile page for another user. |
| `/profile` | `UserProfile` | **Yes** | The current user's profile and settings. |

---

## Available Scripts 💻

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts the fast development server with HMR. |
| `npm run build` | `vite build` | Compiles the application for production deployment. |
| `npm run test` | `vitest run` | Executes all unit and component tests using **Vitest**. |
| `npm run lint` | `eslint . --ext js,jsx ...` | Runs ESLint for code quality and style checks. |

## User Credentials

User 1:

* username: sampleuser
* password: sampleuser

User 2:

* username: sampleuser2
* password: sampleuser2
