# Metal Mayhem

A 2D multiplayer platform shooter game built with JavaScript and Express.js.

![Gameplay GIF][]

## Description

Metal Mayhem is a 2D multiplayer platform shooter game where players can queue up and play 1-on-1 against an opponent. The game features:

- 10 unique weapons with diverse bullet types
- Random spawns of ammunition, health, and new weapons on the ground
- No game engine; animations are rendered using HTML canvas

## Art Credits

The game's art assets are from [Eragoth's tiny 2D platform shooter](https://eragoth.itch.io/eragoths-tiny-platform-shooter) by Eragoth.

## Course Project

This project was developed as part of the Internet Computing (COMP4021) course. Its implementation highlights the following key concepts:

### Client-Server Architecture
- REST and WebSocket Protocols: REST for initial setup, WebSockets for real-time communication.

### Concurrency and Asynchronous Programming
- Handling Multiple Clients: Managing multiple connections using Node.js's event-driven, non-blocking I/O.
- Synchronization: Using JavaScript promises to ensure consistent game state across clients.

### Networking
- Real-Time Data Transfer: Implementing real-time communication with WebSockets.
- State Management: Developing a system to manage and synchronize game state between the server and clients.

### Data Structures and Algorithms
- Using appropriate data structures for game entities (players, bullets, platforms).
- Implementing collision detection algorithms.

### User Authentication
- Authentication and Authorization: Implementing user authentication and session management to ensure secure access.

## Running the Game

1. Clone the main branch of the repository.
2. Ensure Node.js and npm are installed.
3. Run `npm install` and `npm start`.
4. Connect to the game using `ipaddress:8000` on port 8000.
5. Log in and queue up.

Use these example login credentials:
- Username: `a`, Password: `a`
- Username: `b`, Password: `b`

### Controls
- `W` to jump
- `A`, `D` to walk left and right
- Mouse to aim
- Left-click to shoot
- `E` to equip items spawned on the ground

### Cheats
- Press `C` to gain full health and ammunition
- Press `C` in combination with `=` to cycle through and try all unique weapons
