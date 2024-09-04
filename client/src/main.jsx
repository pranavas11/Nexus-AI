import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from './routes/SignUp/SignUpPage';
import Login from './routes/Login/Login';
import Homepage from './routes/Home/Homepage';
import Dashboard from './routes/Dashboard/Dashboard';
import Chat from './routes/Chat/Chat';
import RootLayout from './layouts/RootLayout/RootLayout';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import InvalidRoute from './routes/InvalidRoute';
import './index.css';

// NOTE: the "createBrowserRouter" method is part of React Router's newer API that offers more advanced features and finer control over routing.
// It's useful when you need nested layouts, data loaders, or when you want to handle routing more declaratively
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login/*",
        element: <Login />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chat />,
          },
        ],
      },
      {
        path: "*",
        element: <InvalidRoute />
      },
    ],
  },
]);

// NOTE: you can also use "BrowserRouter" from `react-router-dom` as shown in App.jsx as the traditional
// approach but make sure to change the script source to "App.jsx" instead of "main.jsx" in `src/index.html`.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)