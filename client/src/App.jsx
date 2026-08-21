import { Flex, Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import AdminRoute from "./utils/AdminRoute";
import ProtectedRoute from "./utils/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdrawal from "./pages/Withdrawal";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Admin from "./pages/Admin";
import Investments from "./pages/Investments";
import MyInvestments from "./pages/MyInvestments";
import ActivityLogs from "./pages/ActivityLogs";
import AdminPlans from "./pages/AdminPlans";
import AdminInvestments from "./pages/AdminInvestments";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Testimonials from "./pages/Testimonials";
import ResetPassword from "./pages/ResetPassword";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminUsers from "./pages/AdminUsers";
import AdminDeposits from "./pages/AdminDeposits";
import AdminWithdrawals from "./pages/AdminWithdrawals";

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 768);

  return (
    <Flex minH="100vh" bg="#0f172a">
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Box flex="1" minW="0" bg="#0b1220" color="white">
        <Navbar
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
        {children}
      </Box>
    </Flex>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <Layout>
              <Deposit />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/investments"
        element={
          <ProtectedRoute>
            <Layout>
              <Investments />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-investments"
        element={
          <ProtectedRoute>
            <Layout>
              <MyInvestments />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/withdrawal"
        element={
          <ProtectedRoute>
            <Layout>
              <Withdrawal />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/testimonials"
        element={
          <ProtectedRoute>
            <Layout>
              <Testimonials />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Layout>
              <Admin />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Layout>
              <AdminUsers />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/logs"
        element={
          <AdminRoute>
            <Layout>
              <ActivityLogs />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/deposits"
        element={
          <AdminRoute>
            <Layout>
              <AdminDeposits />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/withdrawals"
        element={
          <AdminRoute>
            <Layout>
              <AdminWithdrawals />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/investments"
        element={
          <AdminRoute>
            <Layout>
              <AdminInvestments />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/plans"
        element={
          <AdminRoute>
            <Layout>
              <AdminPlans />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/testimonials"
        element={
          <AdminRoute>
            <Layout>
              <AdminTestimonials />
            </Layout>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;