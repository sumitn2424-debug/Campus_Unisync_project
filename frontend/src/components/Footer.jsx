import {useNavigate} from 'react-router-dom'
export default function Footer() {
  const navigate = useNavigate()
  
  return (
    <div className="bg-white shadow-inner p-3 flex justify-around fixed bottom-0 w-full">
      <button onClick={() => navigate('/home')}>🏠</button>
      <button onClick={() => navigate('/marketPlace')}>🛒</button>
      <button onClick={() => navigate('/createPost')} className="text-2xl">➕</button>
      <button onClick={() => navigate('/Message')}>💬</button>
      <button onClick={() => navigate('/Profile')}>👤</button>
    </div>
  );
}