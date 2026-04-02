import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Store from './pages/Store';
import Chat from './pages/Chat';
import Feedback from './pages/Feedback';
import PostMessage from './components/post';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <PostMessage/>
      {/* <AuthProvider>
        <div className="min-h-screen pt-4 pb-12">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider> */}
    </Router>
  );
}

export default App;
