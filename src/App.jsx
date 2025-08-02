import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Shop from "./pages/Shop";
import ServiceDetail from "./pages/ServiceDetail";
import Inquiry from "./pages/Inquiry";

import AdminDashboard from "./admin/Dashboard";
import AdminServices from "./admin/Services";
import AdminLayout from "./admin/Layout";
import AdminHome from "./admin/Home";
import HomeAbout from "./admin/HomeAbout";
import HomeServices from "./admin/HomeServices";
import HomeProducts from "./admin/HomeProducts";
import FooterAdmin from "./admin/Footer";
import Login from "./admin/Login";
import Category from "./admin/Category";
import Notification from "./admin/Notification";

import React from "react";
import ForgotPassword from "./admin/ForgotPassword";

// ✅ Protected Route wrapper
function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

// ✅ Public Layout wrapper
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

          {/* ✅ Login (public) */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ✅ Admin section (protected) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* <Route path="/admin/services" element={<AdminServices />} /> */}
              <Route path="/admin/category" element={<Category />} />
              <Route path="home/about" element={<HomeAbout />} />
              <Route path="home/services" element={<HomeServices />} />
              <Route path="admin/products" element={<HomeProducts />} />
              <Route path="admin/notification" element={<Notification />} />
              <Route path="/admin/footer" element={<FooterAdmin />} />
            </Route>
          </Route>

          {/* ✅ Public site */}
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
