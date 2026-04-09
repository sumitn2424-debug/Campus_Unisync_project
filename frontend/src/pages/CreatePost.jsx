import { Link } from "react-router-dom";

export default function CreatePost() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
      <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-2">Create Something New</h1>
      <p className="text-gray-600 mb-10 text-center max-w-md">What would you like to share with the world today? Choose the type of post you want to create.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link 
          to="/createUserPost" 
          className="group flex flex-col items-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-indigo-400"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.293-1.025l-2.433-3.8A2 2 0 0016.59 4H15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">Social Post</h2>
          <p className="text-gray-500 text-center text-sm">Share an image or thoughts with your followers and friends.</p>
        </Link>
        
        <Link 
          to="/createProductPost" 
          className="group flex flex-col items-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-green-400"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Marketplace Product</h2>
          <p className="text-gray-500 text-center text-sm">List an item for sale in the marketplace to find buyers.</p>
        </Link>
      </div>
    </div>
  );
}
