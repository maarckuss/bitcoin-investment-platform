import { Flex } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AdminRoute from "./utils/AdminRoute";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Box } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdrawal from "./pages/Withdrawal";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Flex minH="100vh" bg="#0f172a">
      <Sidebar isOpen={isOpen} />

      <Box flex="1" bg="#0b1220" color="white">
        {/* ADD NAVBAR HERE */}
        <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />

        {children}
      </Box>
    </Flex>
  );
}
function AppRoutes() {
  const location = useLocation();

  const isAuthPage = location.pathname === "/login";

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Login />} />

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes WITH layout */}
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
        path="/admin/testimonials"
        element={
          <AdminRoute>
            <Layout>
              <AdminTestimonials />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminPlans />
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
        path="/admin/investments"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminInvestments />
            </Layout>
          </ProtectedRoute>
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