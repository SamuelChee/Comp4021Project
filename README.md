# Metal Mayhem

A 2D multiplayer platform shooter game built with JavaScript and Express.js.

![gameplay.png][]

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

Got it, I've updated the TODO section with the requirement for a stateless server and an external database for containerization:

## TODO

### Fix Server Bugs

- [ ] Investigate and fix the server crash issue when a client closes the window and reconnects.
  - [ ] Implement proper disconnect handling on the server-side.
  - [ ] Handle reconnection scenarios gracefully.
  - [ ] Ensure game state is correctly updated and synchronized for reconnecting players.

### Enhance Queueing System

- [ ] Refactor the queueing system to handle more players efficiently.
  - [ ] Implement a scalable queuing mechanism 
  - [ ] Handle queue overflows and player timeouts.
  - [ ] Ensure fair matchmaking and load balancing across game instances.

### Explore Deployment Methods

- [ ] Test and evaluate different deployment methods for the game server.
  - [ ] Test and deploy the game server on an Amazon EC2 instance.
  - [ ] Investigate and implement a container architecture (e.g., Docker) for the game server.
    - [ ] Explore a stateless server architecture and an external database for storing game state.
        - [ ] Decouple game state from server instances.
        - [ ] Set up a suitable external database to store game state and user info
    - [ ] Containerize the stateless server instances.

