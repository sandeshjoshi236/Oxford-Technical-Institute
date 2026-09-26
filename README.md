# Oxford Technical Institute website

Standalone Vercel export for the Oxford Technical Institute website.

## Deploy with Vercel

1. Extract this ZIP file.
2. Open Vercel and choose **Add New Project**.
3. Import the extracted project folder, or push the folder to a GitHub repository first.
4. Keep the detected framework as **Vite**.
5. Use these settings if Vercel asks:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
6. Click **Deploy**.

The project does not require environment variables for the current static website.

## Run locally

```bash
npm install
npm run dev
```

To verify a production build locally:

```bash
npm run build
npm run preview
```