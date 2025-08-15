# 🧠 Focus Space

**Focus Space** is a modular, real-time productivity cockpit designed for students, professionals, and anyone seeking deep focus. It combines animated tool panels, persistent layouts, and collaborative workflows to minimize cognitive friction and maximize flow. Beyond productivity, Focus Space introduces a social layer—enabling users to post thoughts, share progress, and engage with a community of like-minded individuals. Think of it as a social platform purpose-built for hustle culture.

## 🚀 Core Features

- 🧩 **Stackable Tool Panels**  
  Includes Pomodoro Timer, Task Prioritizer, and Focus Journal with drag-and-drop, collapsible sections, and resizable containers.

- ⚡ **Real-Time Collaboration**  
  WebSocket-powered updates for synchronized blog editing and shared workspace interactions.

- 🎯 **Registry-Driven UI Architecture**  
  Dynamically rendered panels based on a centralized registry, enabling context-aware transitions and persistent state management.

- 🛠️ **Customizable Layouts**  
  Adjustable widths, hide/show toggles, and ergonomic affordances for frictionless user experience.

- 🔒 **Backend-First Design**  
  Strict schema validation, modular middleware, and scalable API endpoints ensure data integrity and maintainability.

## 🧱 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | React, Redux, Tailwind CSS     |
| Backend      | Express, Mongoose              |
| Real-Time    | Socket.IO                      |
| UI/UX        | Framer Motion, Responsive Layouts |
| Dev Tools    | ESLint, Prettier, Husky        |

## 📦 Installation

```bash
git clone https://github.com/thetripleacoder/focus-space.git
cd focus-space
npm install
```

## 🧪 Development

```bash
# Start frontend
cd client
npm run dev

# Start backend
cd server
npm run dev
```

## 🔄 WebSocket Event Registry

| Event Name         | Description                          |
|--------------------|--------------------------------------|
| `blog:created`     | Broadcasts newly created blog posts  |
| `blog:updated`     | Syncs blog edits across clients      |
| `blog:deleted`     | Propagates blog deletions in real-time|

## 📁 Folder Structure

```
focus-space/
├── client/src
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route-based views
│   ├── reducers/       # Redux state slices
│   ├── services/       # API interaction logic
│   ├── socket/         # WebSocket client setup
│   ├── tools/          # Registry-driven tool panels
│   ├── utils/          # Utility functions
├── server/
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Business logic handlers
│   ├── routes/         # RESTful API endpoints
└── README.md
```

## 🧠 Design Philosophy

Focus Space is engineered for developers who prioritize:
- **Modularity**: Each tool is encapsulated and independently extensible.
- **Ergonomics**: Layouts are optimized for cognitive clarity and minimal friction.
- **Extensibility**: Registry-driven architecture supports dynamic tool injection.
- **Real-Time Feedback**: WebSocket infrastructure ensures instant collaboration.

## 📌 Roadmap

- [ ] Real-Time Chat Messaging
- [ ] Focus Leaderboard with activity metrics
- [ ] Theme toggling (light/dark)
- [ ] Plugin system for third-party tool integration

## 🤝 Contributing

Contributions are welcome! If you plan to introduce major changes, please open an issue first to discuss your proposal.

## 📜 License

[MIT](LICENSE)

---

Crafted for clarity. Built for flow.  
**Focus Space** is your developer cockpit for deep work and meaningful connection.
