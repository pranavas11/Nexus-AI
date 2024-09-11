import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './RootLayout.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

// React Query is a powerful library for managing server state in React applications.
const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className='rootLayout'>
          <header>
            <Link to="/" className='logo'>
              <img src="/logo.png" alt="Nexus AI Logo" />
              <span>NEXUS AI</span>
            </Link>
            <div className='user'>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout;


/*
QueryClient and QueryClientProvider from the @tanstack/react-query library are used to
manage and provide the context for React Query operations throughout your application.

1. `QueryClient`: QueryClient is the core instance that manages the cache and configuration
for React Query. It holds and manages all the queries and mutations.

2. `QueryClientProvider`: QueryClientProvider is a React context provider component that makes the
QueryClient instance available throughout your component tree. By wrapping your component tree
with QueryClientProvider, you ensure that all components within the tree can access the React
Query context, enabling them to use hooks like useQuery, useMutation, and others provided by React Query.


In this RootLayout component, QueryClientProvider wraps the entire component tree. This setup means that
any component that uses React Query hooks (like useQuery or useMutation) will have access to the queryClient
instance, enabling them to fetch, cache, and manage server state efficiently. The queryClient instance ensures
consistent behavior and configuration for queries across your entire app. It handles caching, background updates,
and other query-related logic. This setup integrates React Query with Clerk for authentication, so the authenticated
components (like <UserButton />) and other parts of the app that rely on server data can efficiently fetch and manage data.
*/