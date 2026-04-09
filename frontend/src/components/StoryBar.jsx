import { useAuth } from "../hooks/useAuth";

export default function StoryBar() {
  const { userInformation, logOut } = useAuth();


  return (
    <div className="flex place-content-between gap-3 overflow-x-auto mb-4">
      
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-1">
        
        <div className="bg-white w-full h-full rounded-full overflow-hidden">
          
          {userInformation?.image ? (
            <img
              src={userInformation.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300"></div>
          )}

        </div>
      </div>
      <button
      onClick={() => logOut()} 
      className="border-2 rounded-2xl bg-gray-600 text-xs mx-2 text-white font-bold px-4 active:scale-95">
        logout
      </button>

    </div>
  );
}