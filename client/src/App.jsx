const App = () => {
  return (
    <div>Hello World</div>
  )
}

export default App;



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignUp from './routes/SignUp/SignUp';
// import Login from './routes/Login/Login';
// import Homepage from './routes/Home/Homepage';
// import Dashboard from './routes/Dashboard/Dashboard';
// import Chat from './routes/Chat/Chat';
// import RootLayout from './layouts/RootLayout/RootLayout';
// import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
// import './index.css';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<RootLayout />}>
//           <Route index element={<Homepage />} />
//           <Route path="login/*" element={<Login />} />
//           <Route path="sign-up/*" element={<SignUp />} />
//           <Route element={<DashboardLayout />}>
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="dashboard/chats/:id" element={<Chat />} />
//           </Route>
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );