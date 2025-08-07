# 🏠 Rentable Houses Web App

This is a full-stack web application for browsing and managing rental houses. Users can sign up as either **House Owners** or **Normal Users**. The app also features an **Admin Panel** to manage listings and ensure quality control.

---

## 🚀 Features

### 👤 User Roles

- **Normal User**
  - Browse all available houses.
  - View detailed house information.
  - Contact the house owner.

- **House Owner**
  - Add new house listings.
  - Manage (edit/delete) existing listings.

- **Admin**
  - View pending house submissions.
  - Approve or reject listings before they go public.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Prisma + PostgreSQL
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (or specify if different)

---


🧑‍💻 Getting Started 

1. Clone the repository: 
Use SSH to clone the project to your local machine
git clone git@github.com:Mustapha-who/kre.git

2. Install dependencies: 
npm install

3. Configure environment variables: 
Create a .env file in the root of the project with the following content
DATABASE_URL=your_postgresql_database_url

4. Generate the Prisma client:
This will create the necessary types and database client
npx prisma generate

5. Run database migrations:
Apply your Prisma schema to the database
npx prisma migrate dev

6. Start the development server:
npm run dev

🔐 Note:
To access the Admin Section, you need to manually insert an admin user directly into the PostgreSQL database
