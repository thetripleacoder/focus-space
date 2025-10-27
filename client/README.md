# Blog List Client Application (Frontend) 💻

This is the client-side application for the **Blog List** service, built as a modern Single-Page Application (SPA) using **React** and managed with **Vite**. It provides a rich user interface, centralized state management via **Redux Toolkit**, real-time data synchronization through **Socket.IO**, and integrated **Productivity Tools** for focused work.

---

## Technical Stack & Architecture 🚀

The frontend is a contemporary React application prioritizing centralized state, real-time data flow, and a modular architecture for easy maintenance and expansion.

| Technology | Core Role | Wiring & Integration |
| :--- | :--- | :--- |
| **React** | Component-Based UI | **`src/main.jsx`** renders the root `<App />` component, handling the routing and providing the Redux store and MUI theme context. |
| **Vite** | Build Tool & Dev Server | Used for fast development (`npm run dev`) and efficient bundling (`npm run build`). |
| **Redux Toolkit** | Global State Management | **`src/store.js`** configures the central store for **`blogs`**, **`user`**, and **`notification`**. **Thunks** handle all asynchronous API calls and state updates. |
| **React Router v6** | Client-Side Routing | **`src/App.jsx`** defines all application routes and uses authentication logic to guard navigation. |
| **Socket.IO Client** | Real-time Updates | **`src/App.jsx`** connects the socket client upon user login. **`src/socketListeners.js`** maps incoming server events (`blogCreated`, `blogUpdated`, etc.) directly to **Redux actions**, instantly updating the UI state. |
| **MUI & Tailwind CSS** | Styling and UI Components | **`@mui/material`** provides rich components, styled via **`@emotion`**. **`tailwindcss`** is used for utility-first styling (imported in `src/index.css`). |
| **Local Storage** | Client-side Persistence | Used by the **`TasksTool`**, **`JournalTool`**, and **`userReducer`** to store session data (JWT) and user-specific tool data persistently across sessions and tabs. |

---

## Key Functional Wiring 💡

### 1. State Management and Data Flow (Redux)

* **Central Store (`src/store.js`):** Centralizes application data, making it accessible to all components via the **`useSelector`** hook.
* **Async Logic (Thunks):** All interaction with the backend API (`src/services/`) is handled via **async thunks** within the Redux reducers. For example, `blogsReducer` contains thunks like `initializeBlogs` and `likeBlog`, which manage the full lifecycle of a data request.
* **User Session:** The **`userReducer`** manages the **JWT token** and user profile, saving/loading the session data to **`localStorage`** using `src/services/localStorage.js`.

### 2. Real-time Synchronization

The client maintains a persistent, event-driven connection to the server:

* **Managed Connection:** The Socket.IO client is initialized in **`src/socket.js`** and its connection/disconnection lifecycle is tightly coupled with the user's login state in **`App.jsx`**.
* **Event Handling (`src/socketListeners.js`):** This file is the bridge, dynamically mapping server events to Redux actions. When the server broadcasts a `blogUpdated` event (e.g., a like count changes), the listener immediately dispatches `dispatch(updateBlog(blog))`, causing the UI to re-render instantly with the new data.

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

- username: sampleuser
- password: sampleuser

User 2:
- username: sampleuser2
- password: sampleuser2
