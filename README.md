# DevTracker

DevTracker is a modern, role-based project and task management dashboard built with Next.js. It is designed to help teams track projects, manage tasks, and monitor progress for different user roles such as admin, developer, and trainee.

## Overview

This project provides a clean and responsive web interface for:
- Authentication and role-based access
- Admin dashboards for monitoring the whole team
- Developer dashboards for managing assigned projects and tasks
- Trainee dashboards for tracking personal assignments
- Project and task progress visualization

## Features

### Authentication
- User login with JWT-based auth flow
- Token stored in local storage
- Protected routes and role-based redirection

### Admin Views
- Team overview dashboard
- User management
- Project management
- Task management
- Team progress monitoring

### Developer Views
- Personal dashboard
- Assigned projects
- Assigned tasks
- Trainee progress tracking

### Trainee Views
- Personal dashboard
- Assigned tasks

### UI/UX
- Responsive layout
- Sidebar-based navigation
- Reusable dashboard cards and badges
- Clean dark/light-friendly styling with Tailwind CSS

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- shadcn-style UI components
- Axios for API calls
- Lucide React for icons
- dotenv support

## Project Structure

```bash
app/                 # App routes and pages
components/          # Reusable UI components
context/             # Auth and theme context providers
lib/                 # Shared utilities and API client setup
services/            # API service modules for auth, projects, tasks, users, etc.
public/              # Static assets
```

## Prerequisites

Make sure you have the following installed:
- Node.js 20.18+ (recommended)
- pnpm

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create an environment file:

```bash
cp .env.example .env.local
```

4. Configure the API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> The frontend expects a backend API for authentication and dashboard data. Update the URL to match your backend server.

## Running the Project

Start the development server:

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Build for Production

```bash
pnpm build
```

Run the production build:

```bash
pnpm start
```

## Environment Variables

| Variable | Description |
| --- | --- |
| NEXT_PUBLIC_API_URL | Base URL for the backend API |

## API Integration

The project uses Axios through the shared client in the lib folder. API calls are organized in separate service files under the services directory, including:
- authService.js
- dashboardService.js
- developerService.js
- projectServices.js
- taskServices.js
- userService.js
- traineeService.js
- teamProgressService.js

## Role-Based Navigation

The app routes users to different dashboards based on their assigned role:
- Admin → /admin/dashboard
- Developer → /developer/dashboard
- Trainee → /trainee/dashboard

## Current Status

This repository is currently structured as a frontend application with a role-based dashboard experience. It is designed to work with a connected backend API for real data, while the UI is already organized around the main management workflows.

## Notes

- The login page is the default entry point.
- The app uses local storage for the auth token and some profile overrides.
- Some features depend on the backend returning the expected fields for users, projects, tasks, and activity logs.

## License

No license file is currently included in the repository.
