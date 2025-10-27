# Blog List Server API 🚀

This is the robust backend server for a **Blog List** application, built using the **Node.js/Express** framework. It provides a secured **RESTful API** for blog and user management, featuring **JWT authentication** and **real-time updates** via **Socket.IO** for a dynamic user experience.

-----

## Technical Stack & Architecture 🛠️

The server adheres to the **Model-View-Controller (MVC)** pattern (or more accurately, Model-Controller-Utility for an API) and is designed with modularity, separation of concerns, and security as priorities.

| Technology | Core Role | Wiring & Integration |
| :--- | :--- | :--- |
| **Node.js/Express** | Runtime and Web Framework | **`index.js`** initializes the HTTP server, which wraps the Express **`app`** instance. **`app.js`** configures global middleware and mounts all routers (`blogsRouter`, `usersRouter`, `loginRouter`). |
| **MongoDB/Mongoose** | Database & ODM | **`app.js`** establishes the connection using `mongoose.connect(config.MONGODB_URI)`. **`models/`** defines the schemas (`Blog`, `User`, `Like`) with references for data population. |
| **Socket.IO** | Real-time Communication | **`index.js`** initializes the `io` server and binds it to the HTTP server. The **`utils/socketRegistry.js`** provides the $\text{io}$ instance globally to **controllers** (e.g., `blogs.js`) to emit real-time events. |
| **JWT (jsonwebtoken)** | Authentication | **`controllers/login.js`** signs the token upon successful login. **`utils/middleware.js`** (specifically `tokenExtractor` and `userExtractor`) validates the token and attaches the authenticated user to the request object. |
| **BcryptJS** | Password Security | Used in **`controllers/users.js`** to hash passwords during user registration and in **`controllers/login.js`** to securely compare passwords during login. |
| **Cross-Env/Dotenv** | Configuration | **`package.json`** scripts use `cross-env` to set the `NODE_ENV`. **`utils/config.js`** loads environment variables from `.env` and selects the appropriate `MONGODB_URI` for development, testing, or production. |

-----

## Key Functional Wiring 💡

### 1\. Unified Server and Real-time Initialization

The core server setup in **`index.js`** ensures both REST and Socket.IO operate from the same port:

1.  `const server = http.createServer(app);` creates a standard HTTP server using Express.
2.  `const io = new Server(server, { cors: corsOptions });` initializes the Socket.IO server, binding it to the existing HTTP `server`.
3.  `setIO(io)` (from `utils/socketRegistry.js`) makes the $\text{io}$ instance accessible globally. This is crucial for **controllers** to trigger real-time updates after database operations.
4.  `server.listen(config.PORT, ...)` starts the combined server.

### 2\. Secure Middleware Pipeline

The Express pipeline in **`app.js`** enforces security and consistency:

1.  `app.use(cors(corsOptions));` handles Cross-Origin Resource Sharing based on the `FRONTEND_ORIGIN` list defined in `utils/corsConfig.js`.
2.  `app.use(express.json());` parses JSON request bodies.
3.  **Authentication Flow for Protected Routes:**
      * `middleware.tokenExtractor` extracts the JWT from the `Authorization: Bearer ...` header.
      * The **`blogs`** router is mounted with `middleware.userExtractor`, which verifies the token and fetches the corresponding User object, setting it as `req.user` for authorization checks (e.g., ensuring a user can only delete their own blog).
4.  **Data Validation and Sanitization:** Custom middleware like `sanitizeAndValidateBlog` (used in blog routes) ensures that only allowed fields are accepted and processed, rejecting requests with unexpected payload keys.
5.  **Centralized Error Handling:** `middleware.errorHandler` gracefully handles common database (Mongoose `CastError`, `ValidationError`) and authentication (`JsonWebTokenError`) exceptions, returning standardized $\text{400}$ or $\text{401}$ responses.

### 3\. Real-time Event Broadcasting

Real-time updates are driven from the API controllers:

| Controller | Event Triggered | Description |
| :--- | :--- | :--- |
| **`blogs.js`** | `blogCreated` | Emitted after a successful $\text{POST}$ request. |
| | `blogDeleted` | Emitted after a successful $\text{DELETE}$ request. |
| | `blogUpdated` | Emitted after a successful $\text{PATCH}$ or $\text{PUT}$ request (e.g., likes or comments). |
| **`login.js`** | `userLoggedIn` | Emitted after a successful user login. |

The pattern is consistently: `getIO().emit('eventName', payload);`.

-----

## Installation and Setup ⚙️

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd blog-list
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:** Create a **`.env`** file for configuration:
    ```ini
    PORT=3001
    MONGODB_URI=mongodb://localhost/bloglist_dev
    TEST_MONGODB_URI=mongodb://localhost/bloglist_test
    SECRET=a_secure_random_string_for_jwt_signing
    FRONTEND_ORIGIN=http://localhost:3000,https://my.frontend.app
    ```

-----

## Available Scripts 💻

| Script | Command | Environment | Purpose |
| :--- | :--- | :--- | :--- |
| **Start (Production)** | `npm start` | `production` | Starts the server in production mode. |
| **Development** | `npm run dev` | `development` | Starts the server with **nodemon** for auto-reloading during development. |
| **Test** | `npm run test-jest` | `test` | Executes unit and integration tests using **Jest** and **Supertest**. |
| **Test (Node)** | `npm test` | `test` | Runs tests using Node's built-in test runner. |
| **Seed** | `npm run seed` | `development` | Executes a script (`seed.js`) to populate the database with initial data. |

-----

## API Endpoints (REST) 🌐

| Method | Route | Description | Authentication |
| :--- | :--- | :--- | :--- |
| **Blogs** | `GET /api/blogs` | Retrieve all blogs with populated user and like data. | None |
| | `POST /api/blogs` | Create a new blog post. | Required (`userExtractor`) |
| | `DELETE /api/blogs/:id` | Delete a blog post. | Required & **Ownership** Check |
| | `PATCH/PUT /api/blogs/:id` | Update or replace a blog post. | None (Updates like counts, comments, etc.) |
| **Users** | `POST /api/users` | Register a new user account. | None |
| | `GET /api/users` | Retrieve all users with populated liked posts. | None |
| **Auth** | `POST /api/login` | Authenticate and receive a JWT token and user profile data. | None |

-----

## Real-time Events (Socket.IO) 🔔

The server broadcasts the following events to all connected clients to facilitate real-time UI updates:

| Event Name | Payload | Source Controller |
| :--- | :--- | :--- |
| `blogCreated` | Full `Blog` object | `blogs.js` |
| `blogUpdated` | Full updated `Blog` object | `blogs.js` |
| `blogDeleted` | Deleted blog's `id` (string) | `blogs.js` |
| `userLoggedIn` | Minimal User Payload (id, name, etc.) | `login.js` |