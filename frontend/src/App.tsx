import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import RanklistPage from './pages/RanklistPage';
import SignUp from './pages/SignUp';
import { Toaster } from '@/components/ui/sonner';
import Questions from './pages/Questions';
import TaskFetcher from './pages/TaskFetcher';
import AddQuestionForm from './pages/AddQuestionForm';
import { v4 as uuidv4 } from 'uuid';
import Contests from './pages/ContestHomepage';
import ContestDetailsPage from './pages/Contest';
import Navbar from './components/Navbar';
import { QuestionProvider } from './contexts/questionContext/questionContext';
import PolygonHomePage from './pages/polygonHomePage';
import PolygonProblem from './pages/polygonProblem';
import CreateProblem from './components/polygonpages/CreateProblem';
import Profile from './pages/Profile';
import ContestQuestionsEditor from './pages/ContestQuestionsEditor';
import ContestPage from './pages/ContestPage';
import RealTimeEditorWithSidebar from './pages/RealTimeEditorQ';

function App() {
  return (
    <QuestionProvider>
      <Navbar />
      <Router>
        <Routes>
        <Route path = "/contest/:id/ranklist" element={<RanklistPage />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:id" element={<ContestDetailsPage />} />
          <Route path="/contestPage/:id" element={<ContestPage/>}/>
          <Route path="/" element={<SignIn />} />
          <Route path="/user/signup" element={<SignUp />} />
          <Route path="/user/signin" element={<SignIn />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/editor"  element={<Navigate to={`/editor/${uuidv4()}`} replace />}/>
          <Route path="/editor/:id" element={<RealTimeEditorWithSidebar />} />
          <Route path="/solve/:questionId" element={<TaskFetcher />} />
          <Route path="/contest/:contestId/solve/:questionId" element={<TaskFetcher />} />
          <Route path="/addquestion/:id" element={<AddQuestionForm />} />
          <Route path="/polygon" element={<PolygonHomePage/>} />
          <Route path="/polygon/:problemId" element={<PolygonProblem/>} />
          <Route path="/polygon/create" element={<CreateProblem/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contest/editor/:id" element={<ContestQuestionsEditor />} />
        </Routes>
      <Toaster />
    </Router>
    </QuestionProvider>
  );
}

export default App;