import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import BusinessDetailPage from './pages/BusinessDetailPage.jsx';
import BusinessListPage from './pages/BusinessListPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OwnerDashboardPage from './pages/OwnerDashboardPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TopRatedPage from './pages/TopRatedPage.jsx';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/businesses"
            element={
              <PrivateRoute>
                <BusinessListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/businesses/:id"
            element={
              <PrivateRoute>
                <BusinessDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/top-rated"
            element={
              <PrivateRoute>
                <TopRatedPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <PrivateRoute requiredRole="owner">
                <OwnerDashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
