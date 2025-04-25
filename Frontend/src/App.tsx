// import React from 'react';
// import { FaRobot } from 'react-icons/fa';

// const App: React.FC = () => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col p-6">
//         <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
//         <nav className="flex flex-col gap-4">
//           <a href="#" className="hover:text-gray-300">Home</a>
//           <a href="#" className="hover:text-gray-300">Profile</a>
//           <a href="#" className="hover:text-gray-300">Settings</a>
//         </nav>
//         <div className="mt-auto">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full flex items-center justify-center gap-2 mt-10">
//             <FaRobot />
//             Ask Bot
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-10">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">You're currently logged in.</h1>
//         <p className="text-gray-600">Welcome to your dashboard!</p>
//       </main>
//     </div>
//   );
// };

// export default App;




import React from 'react';
import Dashboard from './Dashboard'; // Adjust path if needed

const App: React.FC = () => {
  return <Dashboard />;
};

export default App;

