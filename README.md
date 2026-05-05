# TechFeed

An aesthetically pleasing feed that collates tech articles we care about — aggregating the best stories from **Hacker News**, **Dev.to**, and **Lobste.rs** into a single, beautiful dark-themed interface.

![TechFeed UI](https://github.com/user-attachments/assets/116fcdf7-beaf-4cbf-ab09-385d0e7c9744)

## Features

- 🌐 **Multi-source aggregation** — pulls articles from Hacker News, Dev.to, and Lobste.rs
- 🔍 **Live search** — filter by title, author, tag, or domain instantly
- 🗂️ **Source tabs** — browse all sources together or drill into one at a time
- 💀 **Skeleton loading** — animated shimmer placeholders while articles load
- ⚡ **5-minute cache** — avoids redundant API calls within a session
- ♿ **Accessible** — proper ARIA roles, labels, and keyboard navigation
- 📱 **Responsive** — works on all screen sizes

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) — fast modern tooling
- Plain CSS modules — no framework, full control over design
- [Hacker News Firebase API](https://github.com/HackerNews/API) — free, no auth
- [Dev.to API](https://developers.forem.com/api) — free, no auth
- [Lobste.rs JSON API](https://lobste.rs/s/cqnzl5/lobsters_api) — free, no auth

## Getting Started

```bash
npm install
npm run dev       # start development server at http://localhost:5173
npm run build     # production build
npm test          # run tests
```