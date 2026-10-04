# Golden Voice Frontend

Frontend application for the Golden Voice anime dub platform.

## Features

- User authentication (login/register)
- View anime works and content
- Browse dubbed and translated versions
- Responsive design for desktop and mobile
- Real-time API integration with backend

## Quick Start

### Prerequisites

- Backend running on `http://localhost:4000`
- Modern web browser

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/MeshDevo/gv-frontend.git
   cd gv-frontend
   ```

2. Configure API endpoint (optional):
   ```bash
   cp .env.example .env.local
   # Edit .env.local to change API_BASE_URL if needed
   ```

3. Start development server:
   ```bash
   npm run dev
   # or
   python3 -m http.server 3000
   ```

4. Open browser:
   ```
   http://localhost:3000
   ```

## Architecture

### Files

- **index.html** - Main HTML structure
- **styles.css** - Styling and responsive design
- **config.js** - Configuration and API endpoints
- **api.js** - API client for backend communication
- **app.js** - Main application logic

### API Integration

The frontend connects to the backend API at `http://localhost:4000`.

**Auth Endpoints:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

**User Endpoints:**
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me` - Update user profile

**Works Endpoints:**
- `GET /api/v1/works` - List works
- `GET /api/v1/works/:workId` - Get work details

**Content Endpoints:**
- `GET /api/v1/dubbed/work/:workId` - Get dubbed versions
- `GET /api/v1/translated/work/:workId` - Get translated versions
- `GET /api/v1/scripts/work/:workId` - Get scripts

## Environment Variables

Create `.env.local` from `.env.example`:

```env
REACT_APP_API_BASE_URL=http://localhost:4000
NODE_ENV=development
```

For production, set:
```env
REACT_APP_API_BASE_URL=https://api.goldenvoice.com
NODE_ENV=production
```

## Development

### Backend Connection

Ensure the backend is running before using the frontend:

```bash
cd ../goldenvoice-backend
npm install
npm run prisma:migrate
npm run dev
```

The backend runs on `http://localhost:4000` and the frontend on `http://localhost:3000`.

### CORS

The backend is configured with CORS enabled for `http://localhost:3000` (dev) and production URLs.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Related

- [Golden Voice Backend](https://github.com/MeshDevo/goldenvoice-backend)
