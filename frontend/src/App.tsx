import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/signin" element={<SignIn />} />
        <Route path="/user/signup" element={<SignUp />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;