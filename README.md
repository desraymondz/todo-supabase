# Todo App with Next.js and Supabase

This is a simple todo application built with Next.js, Supabase, and Tailwind CSS. It allows users to manage their tasks, including adding tasks with images.

## Features

- User authentication (login/signup)
- Create, read, and update todos
- Upload images for todos
- Real-time updates with Supabase subscriptions

## Live Demo

You can view a live demo of the application [here](https://todo-supabase-rose.vercel.app/).

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm
- A Supabase account

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your environment variables. Create a `.env.local` file in the root of your project and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000/
   ```
4. Run the development server
   ```sh
   npm run dev
   ```

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
