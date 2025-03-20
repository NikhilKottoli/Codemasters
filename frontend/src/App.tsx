import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { Toaster } from '@/components/ui/sonner';
import Questions from './pages/Questions';
import TaskFetcher from './pages/TaskFetcher';
import AddQuestionForm from './pages/AddQuestionForm';
import Contests from './pages/Contest';
import RealTimeEditor from './pages/RealTimeEditor';
import Navbar from './components/Navbar';
import { QuestionProvider } from './contexts/questionContext/questionContext';
import PolygonHomePage from './pages/polygonHomePage';
import PolygonProblem from './pages/polygonProblem';
import CreateProblem from './components/polygonpages/CreateProblem';

function App() {
  return (
    <QuestionProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/contests" element={<Contests />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/user/signup" element={<SignUp />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/editor" element={<RealTimeEditor />} />
          <Route path="/solve/:questionId" element={<TaskFetcher />} />
          <Route path="/addquestion" element={<AddQuestionForm />} />
          <Route path="/polygon" element={<PolygonHomePage/>} />
          <Route path="/polygon/:problemId" element={<PolygonProblem/>} />
          <Route path="/polygon/create" element={<CreateProblem/>} />
        </Routes>
      <Toaster />
    </Router>
    </QuestionProvider>
  );
}

export default App;