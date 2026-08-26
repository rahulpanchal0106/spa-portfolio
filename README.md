# Rahul Panchal — Portfolio

Non-scrolling desktop SPA, stacked mobile layout. Next.js App Router, Tailwind, Framer Motion, optional Upstash Redis for the shared chess board.

```bash
npm install
cp .env.example .env.local   # add Upstash keys to persist chess + contact
npm run dev
```

Without Redis, chess still works for the current Node process using an in-memory board and SSE.
