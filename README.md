# Distributed Tic Tac Toe - Real-Time Multiplayer

A modern, real-time, multiplayer Tic Tac Toe game built using **Node.js**, **Express**, and **Socket.io**. This project demonstrates distributed systems concepts through WebSocket-based synchronization and real-time state management.

---

## 🎨 Features
- **Real-Time Synchronisation**: Moves are instantly reflected on all connected clients.
- **Dynamic Strike-Through**: A visual strike line appears over the winning combination (horizontal, vertical, or diagonal).
- **Premium UI**: Modern dark theme with glassmorphism, responsive layout, and smooth animations.
- **Player Role Management**: Automatically assigns "X" and "O" roles; additional players join as spectators.
- **Turn Enforcement**: Server-side validation ensures players can only move during their respective turns.
- **Auto-Reset Notifications**: Notifies all clients when a session is reset after a win or disconnect.

---

## 🛠️ Technology Stack
- **Backend**: Node.js, Express.js
- **Communication**: WebSockets (Socket.io)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (Modern Vanilla CSS)
- **Font**: [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- `npm` (usually comes with Node.js)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/aryan181004/lp5-mini-project-tic-tac-toe.git
    cd tictactoe-web
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running Locally
1.  Start the server:
    ```bash
    node server.js
    ```
2.  Open your browser to:
    ```
    http://localhost:3000
    ```
3.  Open the same URL in another tab/window/device to play in multiplayer mode.

---

## 📸 Screenshots

### Initial State
![Initial State](https://img.shields.io/badge/Status-Connected-brightgreen)

### Winning View
*A white strike line highlights the winning move.*

---

## 📂 Project Structure
```text
tictactoe-web/
├── node_modules/         # Dependencies
├── public/               # Frontend assets
│   ├── index.html        # Game structure
│   ├── style.css         # Premium UI styles
│   └── script.js         # Client-side WebSocket interaction
├── server.js             # Logic, state management & Socket.io setup
├── package.json          # Project metadata and dependencies
└── .gitignore            # Files excluded from version control
```

---

## 📜 License
This project is open-source and available under the [ISC License](LICENSE).
