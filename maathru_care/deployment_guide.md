# Maathru Care: Deployment Guide

Follow these steps to deploy the Maathru Care platform to production.

## 1. Web Application (Next.js)
The frontend and AI bridge are located in `maathru_care/packages/web`.

### **Vercel Deployment**
1. **Connect Repository**: Import the `Moms-Care` repository into Vercel.
2. **Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `maathru_care/packages/web`
3. **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `next`
   - Install Command: `pnpm install` (or `npm install`)
4. **Environment Variables**:
   Add the following variables to Vercel (found in your `.env.local`):
   - `GROQ_API_KEY`: Your Groq Cloud API key.
   - `GEMINI_API_KEY`: Your Google AI Studio (Gemini) key.
   - `APILAGE_API_KEY`: Your Apilage Sinhala API key.

## 2. Firebase Integration
The app uses Firebase for Auth and Identity.
1. **Authorized Domains**: Go to **Firebase Console > Auth > Settings** and add your production domain (e.g., `your-app.vercel.app`) to the authorized domains list.
2. **Google Sign-In**: Ensure Google is enabled as a sign-in provider.

## 3. PWA (Progressive Web App)
Maathru Care is configured as a PWA for offline-first support.
- **HTTPS**: PWAs require a secure connection. Vercel provides this by default.
- **Service Workers**: The build process generates `sw.js` automatically. No manual setup is required.
- **Models**: The mood detection models are located in `public/models` and will be cached by the PWA for offline use.

## 4. Troubleshooting
- **Login Issues**: If Google login fails after deployment, check the "Authorized Domains" in Firebase.
- **AI Not Responding**: Verify that your API keys are correctly entered in the Vercel "Environment Variables" section.
- **Camera Access**: Ensure the production site is served over `https://`, otherwise the browser will block camera access for mood detection.

---
**Maathru Care Production Ready** 🌸🚀
