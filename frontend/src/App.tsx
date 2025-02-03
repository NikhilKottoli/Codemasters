import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import { Toaster } from '@/components/ui/sonner';
import Questions from './pages/Questions';
import TaskFetcher from './pages/TaskFetcher';
import AddQuestionForm from './pages/AddQuestionForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/solve/:questionId" element={<TaskFetcher />} />
        <Route path="/addquestion" element={<AddQuestionForm />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;