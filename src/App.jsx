import { useState } from 'react'
import {Route, Routes} from "react-router-dom";
import OverviewPage from "./Pages/OverviewPage.jsx";
import ProductsPage from "./Pages/ProductsPage.jsx";
import UsersPage from "./Pages/UsersPage.jsx";
import HomePage from "./Pages/HomePage.jsx";
import AdminPage from "./Pages/AdminPage.jsx";

import Sidebar from "./components/common/Sidebar.jsx";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Header from "./components/common/Header.jsx";
import Home from "./components/home"
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/common/Layout.jsx"

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from 'react-router-dom';


function App() {
    const routesArray = [
        // Public Routes
        {
            path: "*",
            element: <Login />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        // Private Routes
        {
            path: "/home",
            element:(
                <ProtectedRoute>
                    <Layout>
                        <HomePage />
                    </Layout>

                </ProtectedRoute>
            ),
        },
        {
            path: "/overview",
            element: (
                <ProtectedRoute>
                    <Layout>
                        <OverviewPage />
                    </Layout>
                </ProtectedRoute>
            ),
        },
        {
            path: "/users",
            element: (
                <ProtectedRoute>
                    <Layout>
                        <UsersPage />
                    </Layout>
                </ProtectedRoute>
            ),
        },
        {
            path: "/adminpage",
            element: (
                <ProtectedRoute>
                    <Layout>
                        <AdminPage />
                    </Layout>
                </ProtectedRoute>
            ),
        },
        {
            path: "/products",
            element: (
                <ProtectedRoute>
                    <Layout>
                        <ProductsPage />
                    </Layout>
                </ProtectedRoute>
            ),
        },
    ];
    let routesElement = useRoutes(routesArray);
    return (
        <AuthProvider>
            {/*<Header />*/}

            <div className="w-full h-screen flex flex-col">{routesElement}</div>

        </AuthProvider>
    );
}

//   return (
//       <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
//           {/* BG */}
//           <div className="fixed inset-0 z-0">
//               <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80'/>
//               <div className='absolute inset-0 backgrop-blur-sm'/>
//           </div>
//
//           <Sidebar />
//           <Routes>
//               <Route path="/overview" element={<OverviewPage />} />
//               <Route path="/products" element={<ProductsPage />} />
//               <Route path="/users" element={<UsersPage />} />
//               {/*<Route path="/loginpage" element={<LoginPage />} />*/}
//               <Route path="/home" element={<HomePage />} />
//           </Routes>
//       </div>
//      );
// }

export default App

//
// overlay each categories answer to a question over a radar chart
// pychart with needle
//     simple radial bar chartt
