import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import ServiceDetail from "./pages/ServiceDetail";
import Inquiry from "./pages/Inquiry";

import AdminDashboard from "./admin/Dashboard";
// import AdminProducts from "./admin/Products";
import AdminServices from "./admin/Services";
import AdminLayout from "./admin/Layout";
import AdminHome from "./admin/Home";
import HomeAbout from "./admin/HomeAbout";
import HomeServices from "./admin/HomeServices";
import HomeProducts from "./admin/HomeProducts";
import FooterAdmin from "./admin/Footer";
import Login from "./admin/Login";
import Category from "./admin/Category";

import React from "react";

// ✅ Inline ProtectedRoute component
function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

// ✅ Public layout
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public login */}
          <Route path="/login" element={<Login />} />

          {/* ✅ Admin (protected) */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              {/* <Route path="products" element={<AdminProducts />} /> */}
              <Route path="services" element={<AdminServices />} />
              <Route path="admin/home" element={<AdminHome />} />
              <Route path="category" element={<Category />} />
              <Route path="home/about" element={<HomeAbout />} />
              <Route path="home/services" element={<HomeServices />} />
              <Route path="home/products" element={<HomeProducts />} />
             
              <Route path="footerAdmin" element={<FooterAdmin />} />
            </Route>
          </Route>

          {/* Public site with layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/serviceDetail/:id" element={<ServiceDetail />} />

<Route path="/shop" element={<Shop />} />
<Route path="/shop/:categoryId" element={<Shop />} />
            <Route path="/inquiry/:id" element={<Inquiry />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
