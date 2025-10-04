# Moreko High School – Official Website & Learning Portal

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It serves as the official digital platform for **Moreko High School**, a public secondary school in rural Limpopo, South Africa.

The platform is designed to promote the school’s achievements, enhance learning access for students, and support limited technical infrastructure (no IT department). It is built to be lightweight, mobile-friendly, and easy for staff to manage.

---

## 🎯 Project Goals

- Showcase **Moreko High School’s values, performance, and achievements**
- Provide an **open-access digital library** of academic resources
- Create a **dynamic school magazine/newsroom** to tell the school's story
- Enable simple backend management for non-technical staff

---

## 🚀 Key Features

> These are the core modules to be implemented and refined during development.

### 🔐 Admin Dashboard
- Secure login for select staff (Principal, HoD, or delegated teacher)
- Upload academic content, news articles, and performance data
- Manage the site calendar, downloads, and staff profiles

### 📚 Learning Resource Library
- Organized by **Grade**, **Subject**, and **Content Type** (e.g. Past Paper, Notes)
- Public access without login for students and parents
- Supports PDFs, video links, notes, and textbooks

### 📰 School Magazine / Newsroom
- Dynamic articles such as:
  - "Principal wins Teacher of the Year"
  - "School secures R150k infrastructure grant"
  - "Top 3 Grade 12 performers this term"
- Includes title, content, author, date, and optional images

### 📊 School Performance Dashboard
- Upload performance stats by year and subject
- Auto-generate graphs and trendlines for:
  - Matric results
  - Subject averages
  - Pass rates
- Display school improvement progress to stakeholders

### 📅 Calendar & Announcements
- School terms, test weeks, events, and parent meetings
- Easy update from the Admin Panel
- Public view for learners and families

### 🧑‍🏫 Staff Showcase
- Monthly feature: “Educator of the Month”
- List of current staff with subjects and short bios
- Optional profile photos

### 🧠 Study Support Section
- Study techniques, revision tips, self-study guides
- Articles that promote learner independence
- Mental health & motivation support

### 📝 Downloads Hub
- Printable school documents:
  - Application forms (PDF)
  - Code of Conduct
  - Book & stationery lists
  - Uniform policy

### 🌍 About Moreko High
- Mission and vision
- History of the school
- Gallery of student life and events
- Contact details and location info

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Auth:** (Planned) Simple role-based access with optional NextAuth
- **State Management:** React Context or Zustand (TBD)
- **Data Storage:** Local file system or S3-compatible bucket
- **Visualization:** Chart.js or Recharts for performance stats

---

## 🧪 Local Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
