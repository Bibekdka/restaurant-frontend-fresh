# Deployment Guide - Fine Dining App

Your app is now ready for the world! Since you've upgraded to a dynamic system, here is how you deploy it properly.

## 1. Setup Environment Variables
I've moved your secret keys to a protected format. To make the app work locally, you MUST create a file named `.env` in the root folder and paste this:

```env
VITE_FIREBASE_API_KEY=AIzaSyB3F9I9IqAesY5b-m79UB4EVqUq7nw6PIQ
VITE_FIREBASE_AUTH_DOMAIN=restaurant-app-4cb13.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=restaurant-app-4cb13
VITE_FIREBASE_STORAGE_BUCKET=restaurant-app-4cb13.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=755258756240
VITE_FIREBASE_APP_ID=1:755258756240:web:3f6a23041bf04473309c15
VITE_FIREBASE_MEASUREMENT_ID=G-ZB2SBX8503
```

## 2. Deploy to Netlify (Recommended)
Netlify is the easiest way to host this app for free.

1.  **Commit & Push**: Push your code to GitHub.
2.  **Connect to Netlify**: Go to [Netlify](https://www.netlify.com/), click "Add new site" -> "Import from Git".
3.  **Build Settings**:
    -   **Build command**: `npm run build`
    -   **Publish directory**: `dist`
4.  **Environment Variables**: 
    -   Go to **Site Settings** -> **Environment variables**.
    -   Add each of the keys from the `.env` list above (e.g., Key: `VITE_FIREBASE_API_KEY`, Value: `AIzaSyB3...`).
5.  **Redirects**: I've already added the `_redirects` file so your page links won't break when you refresh.

## 3. Final Check
Once deployed, verify:
- [ ] You can sign in / sign up.
- [ ] You can add a food item with a local image.
- [ ] You can leave a review.

**Your app is officially ready!** 🚀
