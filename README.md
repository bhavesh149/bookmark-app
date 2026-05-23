# Linkora — Smart Bookmark Manager

Linkora is a modern, ultra-fast bookmark manager designed for developers and digital creators. It allows users to save, organize, and instantly sync their bookmarks across all devices.

## 🎥 Video Walkthrough

[Insert Loom Video Link Here] *(A short <5min walkthrough of the app's functionality and a brief dive into the architecture).*

---

## 🔐 Auth & Row Level Security (RLS)

### Supabase Authentication
Authentication is handled entirely through Supabase Auth, leveraging **Google One Tap** (Identity Services) and standard email magic links. 

### Row Level Security (RLS)
The database is locked down at the Postgres level. By default, tables are inaccessible unless explicitly opened through RLS policies. The `bookmarks` table enforces strict isolation using the following policies:

```sql
create policy "Users see own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users insert own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users update own bookmarks" on public.bookmarks for update using (auth.uid() = user_id);
create policy "Users delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);
```

**Why these are correct:**
- **Isolation:** The `using (auth.uid() = user_id)` clause ensures that every single `SELECT`, `UPDATE`, and `DELETE` query automatically filters rows to only match the currently authenticated user's ID. It is impossible for a user to fetch or modify someone else's data, even if they explicitly try to query it.
- **Data Integrity on Insert:** The `with check (auth.uid() = user_id)` clause prevents malicious users from forging API requests to create bookmarks that are assigned to a different user's ID.

---

## ⚡ Real-Time Sync Architecture

Linkora feels instantly responsive across multiple tabs and devices without ever requiring a manual refresh.

### Supabase Realtime Features Used
We enabled the `supabase_realtime` publication for the `bookmarks` table. On the frontend, we use `supabase.channel('custom-all-channel')` to subscribe to `postgres_changes` listening to `INSERT`, `UPDATE`, and `DELETE` events.

### State Management & Synchronization
Instead of manually updating arrays when a realtime event fires, we integrated **React Query (`@tanstack/react-query`)**. 
When a real-time event is received, we trigger `queryClient.invalidateQueries({ queryKey: ['bookmarks'] })`. This forces React Query to fetch the freshest data seamlessly in the background, keeping our client state perfectly aligned with the database without writing complex array-splicing logic.

### Subscription Cleanup
To prevent memory leaks and zombie WebSockets, the real-time subscription is bound inside a `useEffect` hook. In the hook's cleanup function (`return () => { ... }`), we explicitly call `supabase.removeChannel(channel)` to safely disconnect the socket when the user navigates away or the component unmounts.

---

## ✨ Bonus Features Added

### 1. Google One Tap Sign-In
**Why:** Standard OAuth flows redirect users away from your site, breaking momentum. By integrating **Google One Tap**, unauthenticated users are greeted with a native, slide-in prompt that authenticates them instantly without ever leaving the page. It dramatically reduces friction for onboarding.

### 2. Optimistic UI Updates via React Query
**Why:** We wanted the app to feel "local-first". When a user adds, deletes, or toggles a favorite, the UI updates **instantly** using React Query's `onMutate` hook to perform optimistic updates. The change is reflected immediately, and if the Supabase request fails, the cache automatically rolls back to its previous state.

### 3. Premium Glassmorphism UI
**Why:** Moving away from standard SaaS templates, we implemented a custom, monochromatic "Premium" design language with backdrop-blur modals, soft nested shadows, and animated hover glows that adapt intelligently to dark/light mode.

---

## 🐛 Problems Ran Into & Solutions

### 1. Google One Tap (FedCM) Network Errors on Localhost
**Problem:** When implementing Google One Tap using the modern FedCM API (`use_fedcm_for_prompt: true`), it would immediately throw a `[GSI_LOGGER]: FedCM get() rejects with NetworkError` on `localhost:3000`. This is because FedCM requires strict secure contexts and explicit Google Cloud OAuth configurations.
**Solution:** We temporarily bypassed this during development by setting `use_fedcm_for_prompt: false`, falling back to Google's legacy iframe-based prompt which handles local dev gracefully. (Note: in production, `http://localhost:3000` was also properly whitelisted in Google Cloud Console's JavaScript Origins).

### 2. Z-Index and CSS Transform Traps
**Problem:** We added a beautiful confirmation modal to the Sidebar's logout button. However, the modal was rendering constrained *inside* the sidebar rather than centering on the screen, because the sidebar uses CSS `transform: translateX(...)` which creates a new containing block for `position: fixed` elements.
**Solution:** We utilized `createPortal` from `react-dom` to render the modal directly into `document.body` at the highest level of the DOM (`z-[9999]`), escaping the sidebar's CSS containment completely.

---

## 🚀 Future Improvements (If we had more time)

**Automated Metadata Extraction:**
Right now, users just provide a URL and a Title. If we had more time, we would implement a serverless Edge Function that takes the provided URL, scrapes the target site's HTML to grab the `<title>`, OpenGraph image (`og:image`), and Favicon, and saves those to the database. This would make the bookmark cards much more visual and reduce the manual data entry required from the user.
