// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
    {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('home-icon-silhouette-svgrepo-com'),
  }, 
  {
    title: 'Questions',
    path: '/dashboard/questions',
    icon: icon('question-mark-svgrepo-com'),
  },
  {
    title: 'Exams',
    path: '/dashboard/exams',
    icon: icon('exam-icon'),
  },
  {
    title: 'Learning Objectives',
    path: '/dashboard/learningobjectives',
    icon: icon('learn-icon'),
  },
  /*  {
     title: 'New Learning Objective',
     path: '/dashboard/learningobjectives/new',
     icon: icon('ic_blog'),
   },
   {
     title: 'New Question',
     path: '/dashboard/questions/new',
     icon: icon('ic_blog'),
   },
   {
     title: 'New Exam',
     path: '/dashboard/exams/new',
     icon: icon('ic_blog'),
   }, */
  /*   {
      title: 'logout',
      path: '/logout',
      icon: icon('ic_lock'),
    }, */
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
