import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import { NewLearningObjective } from './pages/NewLearningObjective';
import ExamsPage from './pages/ExamsPage';
import QuestionsPage from './pages/QuestionsPage';
import LearningObjectivesPage from './pages/LearningObjectivesPage';
import ExamViewPage from './pages/ExamViewPage';
import EditQuestionPage from './pages/EditQuestionPage';
import { NewQuestionPage } from './pages/NewQuestionPage';
import { NewExamPage } from './pages/NewExamPage';
import { TestPage } from './pages/TestPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'learningobjectives', element: <LearningObjectivesPage /> },
        { path: 'exams', element: <ExamsPage /> },
        { path: 'questions', element: <QuestionsPage /> },
      ],
    },
    {
      path: '/dashboard/learningobjectives',
      element: <DashboardLayout />,
      children: [
        { path: 'new', element: <NewLearningObjective /> }
      ]
    },
    {
      path: '/dashboard/exams',
      element: <DashboardLayout />,
      children: [
        { path: 'view', element: <ExamViewPage /> },
        { path: 'new', element: <NewExamPage /> },
        {path: 'test', element: <TestPage/>}
      ]
    },
    {
      path: '/dashboard/questions',
      element: <DashboardLayout />,
      children: [
        { path: 'edit', element: <EditQuestionPage /> },
        { path: 'new', element: <NewQuestionPage /> },
      ]
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '/dashboard/learningobjectives/new', element: <NewLearningObjective /> },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    }

  ]);

  return routes;
}
