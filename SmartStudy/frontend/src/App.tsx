import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import SchedulePage from './pages/Schedule';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import Documents from './pages/Documents';
import Chat from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/chat" element={<Chat />} /> 
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;