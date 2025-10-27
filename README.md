# Full-Stack Focus Space Application 📚

This project comprises a comprehensive full-stack application, named **Focus Space**, designed for blog list management, real-time communication, and integrated client-side productivity.

-----

## 1\. System Architecture Overview 🗺️

**Focus Space** follows a **Decoupled Monorepo Architecture**, clearly separating the **Server (API)** from the **Client (SPA)** but unifying management within a single structure.

| Layer | Technology | Primary Role | Communication |
| :--- | :--- | :--- | :--- |
| **Client** | React, Redux Toolkit, Socket.IO Client | User Interface, State Management, Real-time Rendering | **REST** (Axios) for CRUD, **WebSockets** (Socket.IO) for Real-time Updates |
| **Server** | Node.js, Express, MongoDB, Socket.IO Server | REST API, Data Persistence, Authentication, Real-time Broadcasting | **Mongoose** (ODM) for MongoDB, **JWT** for Security |

### Real-time Data Flow

The core feature is instant synchronization:

1.  **Client Action** (e.g., liking a blog) triggers a **REST** $\text{PATCH}$ request to the server.
2.  **Server** updates the database, then uses the **Socket.IO Server** to instantly broadcast an event (e.g., `blogUpdated`) to **all connected clients**.
3.  **Clients** receive the event, and the **`socketListeners.js`** file dispatches a Redux action, causing the UI to re-render immediately without polling.

-----

## 2\. Server API (Backend) ⚙️

The server is a highly modular Node.js application built on Express.

### Testing Strategy (Integration Focus)

The server prioritizes **Integration Testing** using **Node's native test runner** and **Supertest**. This ensures API endpoints, database interactions, and middleware (authentication, error handling) function correctly as a single unit.

| Test Type | Tools Used | Focus/Goal |
| :--- | :--- | :--- |
| **Integration Tests** | **`node:test`**, **Supertest** | Verifies the full request-response cycle for CRUD operations, checks $\text{HTTP}$ status codes ($\text{200}$, $\text{201}$, $\text{400}$), and validates authentication logic. |

### Best Practices for Scalability & Maintainability

  * **Real-time Decoupling:** The global $\text{Socket.IO}$ registry allows for future **horizontal scaling** by integrating a $\text{Socket.IO}$ adapter (like Redis).
  * **Security:** Authentication is handled by $\text{JWT}$. Routes are protected by dedicated middleware ($\text{tokenExtractor}$/$\text{userExtractor}$).
  * **Data Integrity:** Payloads are sanitized, and $\text{Mongoose}$ schemas enforce consistent data structure, reducing vulnerability to unexpected input.

-----

## 3\. Client Application (Frontend) 💻

The client is a performant single-page application built on React, utilizing Redux for state management.

### Testing Strategy (Component Focus)

The client uses **Vitest** as the test runner and **React Testing Library (RTL)** for component testing, ensuring a user-centric verification process.

| Test Type | Tools Used | Focus/Goal |
| :--- | :--- | :--- |
| **Component Tests** | **Vitest**, **RTL**, `user-event` | Verifies that individual UI components (e.g., `<Blog />`, `<BlogForm />`) render correctly, simulate user actions (clicks, typing), and correctly fire the associated event handlers/props. |
| **Unit Tests** | **Vitest** | Used for isolated testing of Redux reducers, thunks, and pure utility functions. |

### Architecture and Core Features

#### State Management and Synchronization

  * **Redux Toolkit:** Manages all server-synced data (`blogs`, `users`) with asynchronous logic handled by **Thunks**.
  * **Session Persistence:** The user $\text{JWT}$ is stored in $\text{localStorage}$. A browser $\text{storage}$ event listener ensures **login status synchronizes across multiple browser tabs** without delays.

#### Integrated Productivity Tools (Client-Side Only)

The **Focus Space** application includes dedicated tools that manage their state locally for speed and separation of concerns.

| Tool Name | Persistence Mechanism | Focus |
| :--- | :--- | :--- |
| **Tasks Tool** | `localStorage` (key: `focus-space-tasks`) | Prioritization and management of to-do items (High, Medium, Low). |
| **Pomodoro Timer Tool** | `localStorage` (key: `focus-space-pomodoro`) | Customizable focus/break time management and session tracking. |
| **Journal Tool** | `localStorage` (key: `focus-space-journal`) | Quick logging of thoughts and notes with timestamps. |

-----

## 4\. Setup and Development

### Prerequisites

  * Node.js (v18 or higher)
  * MongoDB instance (local or remote URI)

### Installation and Run

1.  **Install Dependencies:** Run `npm install` (in both `server/` and `client/` directories if using distinct $\text{package.json}$ files).
2.  **Environment Setup:** Create a **`.env`** file in the server root directory:
    ```
    PORT=3003
    MONGODB_URI=mongodb://localhost:27017/focus-space-dev
    SECRET=your_super_secret_jwt_key
    # Client variables (used in client build process)
    VITE_API_BASE=http://localhost:3003/api
    VITE_SOCKET_URL=http://localhost:3003
    ```

### Available Commands

| Layer | Script | Command | Purpose |
| :--- | :--- | :--- | :--- |
| **Server** | `npm start` | `cross-env NODE_ENV=production node index.js` | Runs the server in production mode. |
| **Server** | `npm run dev` | `cross-env NODE_ENV=development nodemon index.js` | Starts the server with **nodemon** (auto-reloads). |
| **Server** | `npm run test-jest` | `cross-env NODE_ENV=test jest ...` | Runs **Integration Tests** against the test database. |
| **Client** | `npm run dev` | `vite` | Starts the client development server with HMR. |
| **Client** | `npm run build` | `vite build` | Builds the production static assets. |
| **Client** | `npm run test` | `vitest run` | Runs **Component/Unit Tests** using Vitest. |