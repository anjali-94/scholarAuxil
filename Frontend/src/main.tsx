// // src/main.tsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
// import Login from './Login.tsx';
// import Signup from './Signup.tsx';
// import ProfilePage from './DashboardWrapper/pages/ProfilePage.tsx';
// import LandingPage from './LandingPage.tsx';
// import Repository from './DashboardWrapper/Repository.tsx';
// import Home from './DashboardWrapper/pages/Home.tsx';
// import NewRepository from './DashboardWrapper/pages/NewRepository.tsx';
// import RepositoryDetail from './DashboardWrapper/pages/RepositoryDetail.tsx';
// import PaperDetail from './DashboardWrapper/pages/PaperDetail.tsx';
// import './index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AuthRoute from './AuthRoute.tsx';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={<AuthRoute><App /></AuthRoute>}
//         >
//           {/* Nested routes for Repository */}
//           <Route path="repository" element={<Repository />}>
//             <Route index element={<Home />} />
//             <Route path="new" element={<NewRepository />} />
//             <Route path=":repoId" element={<RepositoryDetail />} />
//             <Route path="paper/:paperId" element={<PaperDetail />} />
//           </Route>
//         </Route>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/LandingPage" element={<LandingPage />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   </React.StrictMode>
// );











// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Login from './Login.tsx';
import Signup from './Signup.tsx';
import ProfilePage from './DashboardWrapper/pages/ProfilePage.tsx';
import LandingPage from './LandingPage.tsx';
import Repository from './DashboardWrapper/Repository.tsx';
import Home from './DashboardWrapper/pages/Home.tsx';
import NewRepository from './DashboardWrapper/pages/NewRepository.tsx';
import RepositoryDetail from './DashboardWrapper/pages/RepositoryDetail.tsx';
import PaperDetail from './DashboardWrapper/pages/PaperDetail.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoute from './AuthRoute.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
  <Routes>
    {/* Always open LandingPage at "/" */}
    <Route path="/" element={<LandingPage />} />

    {/* Login & Signup remain accessible */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Protected Routes */}
    <Route
      path="/app"
      element={<AuthRoute><App /></AuthRoute>}
    >
      <Route path="repository" element={<Repository />}>
        <Route index element={<Home />} />
        <Route path="new" element={<NewRepository />} />
        <Route path=":repoId" element={<RepositoryDetail />} />
        <Route path="paper/:paperId" element={<PaperDetail />} />
      </Route>
    </Route>

    <Route path="/profile" element={<AuthRoute><ProfilePage /></AuthRoute>} />

    {/* Catch all route */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
</Router>

  </React.StrictMode>
);









