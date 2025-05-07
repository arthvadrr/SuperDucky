<p>
  <img src="overlay/public/sprites/baby-ducky/baby-ducky-walk.webp" alt="SuperDucky" width="100" />
</p>

SuperDucky is my Twitch bot!

## TODO

- Handle user gets banned
- Handle user timeout (fun ideas...)
- Hatch and grow feature
- Helix emotes
- !lore command
- Possible ideas (custom chat buble, custom text color and effect, custom duck skins, accessoires, hats, different size)
- dynamic nameplate background color
- !followage
- Sprite dance
- sql:setup on clone for db
- Fix unhandled color updates
- Shallow reative on sprites for performance

## Project Structure

Contains the backend built with Node.js, Express, Socket.IO, and TypeScript, and the client-side application built with Vite, React, and TypeScript, meant to be used as an OBS overlay.

- Listens on the port specified in `.env.server.local`
- WebSocket server runs on the server port defined in `.env.server.local` and is initialized using `Socket.IO`
- Handles real-time Twitch chat commands like `!project`
- Connects to the server via `socket.io-client`
- Real-time updates received via `projectMessage` socket event
- Socket client is configured in `socket.ts`

## Getting Started

### Installation

From root, you can install dependencies for both `server/` and `overlay/` using:

```bash
npm run install-all
```

### Running the Application

After setting up the `.env.server.local` and `.env.shared.local`, from root you can run

```bash
npm run dev
```

This uses `concurrently` to run both the server and the overlay.

## Environment Variables

Use `.env.shared.local` and `.env.server.local` files to configure environment variables. Examples are provided as `.env-example` in both the `server` and `overlay` directories.

## Example Environment Variables

Both `.env` files should be in root.

### Shared (`.env.shared.local`)

```env
# Server settings
VITE_SERVER_HOST=localhost
VITE_SERVER_PORT=your_server_port

# Frontend settings
VITE_FRONTEND_HOST=localhost
VITE_FRONTEND_PORT=your_frontend_port

# Channel to join
VITE_TWITCH_CHANNEL=your_twitch_channel
```

### Server-only (`.env.server.local`)

```env
# Twitch auth
CLIENT_ID=your_twitch_client_id
CLIENT_SECRET=your_twitch_client_secret
ACCESS_TOKEN=your_access_token
REFRESH_TOKEN=your_refresh_token
```

## License

Licensed under the [GNU GPLv3](LICENSE)
