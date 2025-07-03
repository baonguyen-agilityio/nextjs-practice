# 📚 Bookstore - Next.js E-commerce Application

A modern, full-featured bookstore e-commerce application built with Next.js 15, TypeScript, and Tailwind CSS. Features include book browsing, shopping cart functionality, user authentication, and responsive design.

## ✨ Features

- 📖 **Book Catalog**: Browse and search through a comprehensive book collection
- 🛒 **Shopping Cart**: Add, remove, and update quantities with optimistic updates
- 🔐 **Authentication**: Secure user authentication with NextAuth.js
- 📱 **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- ⚡ **Performance**: Optimized with Next.js 15 App Router and Turbopack
- 🎨 **Modern UI**: Beautiful interface with HeroUI components and Framer Motion
- 🧪 **Testing**: Comprehensive test suite with Jest and Testing Library
- 📖 **Storybook**: Component documentation and development
- 🔍 **TypeScript**: Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd nextjs-training
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables (see [Environment Variables](#environment-variables))

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Check code formatting with Prettier
- `npm run format:fix` - Fix code formatting issues
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

### Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Authentication routes
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── articles/          # Articles/blog pages
│   ├── books/             # Book catalog pages
│   ├── contact/           # Contact page
│   └── services/          # Service pages
├── components/            # React components
│   ├── features/          # Feature-specific components
│   ├── layouts/           # Layout components
│   ├── ui/                # Reusable UI components
│   └── icons/             # Icon components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── services/              # API service functions
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── constants/             # Application constants
└── assets/                # Static assets
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_STRAPI_URL=your-strapi-url
NEXT_PUBLIC_AUTH_TOKEN=your-strapi-token

# Add other environment variables as needed
```

## 🧪 Testing

The project uses Jest and React Testing Library for testing.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Philosophy

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **Coverage**: Maintain high test coverage for critical functionality

## 📖 Storybook

View and develop components in isolation:

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

Visit [http://localhost:6006](http://localhost:6006) to view the component library.

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **HeroUI**: Modern React component library
- **Framer Motion**: Smooth animations and transitions
- **Custom Fonts**: Cardo and Inter from Google Fonts

## 🔒 Authentication

Authentication is handled by NextAuth.js with support for:

- Email/Password authentication
- Session management
- Protected routes

## 🛒 State Management

- **React Context**: Global state management for cart and user data
- **Optimistic Updates**: Immediate UI updates with server synchronization
- **Server Actions**: Modern data mutations with Next.js

## 📦 Key Dependencies

### Core

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and developer experience

### UI & Styling

- **Tailwind CSS**: Utility-first CSS
- **HeroUI**: Component library
- **Framer Motion**: Animation library
- **Heroicons**: Icon library

### Development

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Jest**: Testing framework
- **Storybook**: Component development

### Account to test

- **Admin**
  - **Email**: `admin.test@gmail.com`
  - **Password**: `admin@test`
- **User**
  - **Email**: `user.test@gmail.com`
  - **Password**: `user@test`
