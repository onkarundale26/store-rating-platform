import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Layout from './components/common/Layout.jsx';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ChangePassword from './pages/ChangePassword.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUserList from './pages/admin/UserList.jsx';
import AdminAddUser from './pages/admin/AddUser.jsx';
import AdminUserDetail from './pages/admin/UserDetail.jsx';
import AdminStoreList from './pages/admin/StoreList.jsx';
import AdminAddStore from './pages/admin/AddStore.jsx';

import UserStoreList from './pages/user/StoreList.jsx';
import OwnerDashboard from './pages/owner/Dashboard.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUserList />} />
              <Route path="/admin/users/add" element={<AdminAddUser />} />
              <Route path="/admin/users/:id" element={<AdminUserDetail />} />
              <Route path="/admin/stores" element={<AdminStoreList />} />
              <Route path="/admin/stores/add" element={<AdminAddStore />} />
            </Route>
          </Route>
          
          {/* Normal User */}
          <Route element={<ProtectedRoute allowedRoles={['NORMAL_USER']} />}>
            <Route element={<Layout />}>
              <Route path="/stores" element={<UserStoreList />} />
            </Route>
          </Route>
          
          {/* Store Owner */}
          <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
            <Route element={<Layout />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Route>
          </Route>

          {/* Shared (Normal User & Store Owner) */}
          <Route element={<ProtectedRoute allowedRoles={['NORMAL_USER', 'STORE_OWNER']} />}>
            <Route element={<Layout />}>
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
          </Route>
          
          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
