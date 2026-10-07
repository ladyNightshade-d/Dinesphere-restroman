# Dinesphere-restroman

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-c3ys8yev)

## Local development

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Create a `.env` file from `.env.example` and set both URLs to the backend you want to use:

- `VITE_API_URL`: REST API base URL, including `/api`
- `VITE_SOCKET_URL`: Socket.IO server URL, without `/api`

Restaurant discovery is focused on Rwanda. The backend seeds MongoDB from the checked-in OpenStreetMap snapshot at `Dinesphere-backend/src/data/rwandaRestaurantSnapshot.json`; this makes the directory available even when the live map service is unavailable. The snapshot contains 55 named restaurant, cafe, and fast-food listings mapped across 15 districts (coverage varies and is not a popularity ranking). Users can search the listings or choose any Rwandan district to find nearby venues. Booking and ordering buttons appear only when a listing provides a direct tagged link. Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License (ODbL).

## Vercel deployment

Use these settings when importing the repository into Vercel:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Add `VITE_API_URL` and `VITE_SOCKET_URL` as environment variables for Production, Preview, and Development. The included `vercel.json` keeps direct links to React Router pages working after deployment.
