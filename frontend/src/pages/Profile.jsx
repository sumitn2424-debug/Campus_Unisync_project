import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import PostCard from "../components/PostCard";
import MyProductCard from "../components/MyProductCard";
import Loader from "../components/Loader";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PostProvider from "../context/PostContext";

export default function Profile() {
  const navigate = useNavigate();
  const { userInformation, logOut } = useAuth();
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInformation?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch regular posts
        const postsRes = await api.get(`/data/fetchPosts?userId=${userInformation._id}&limit=50`);
        setPosts(postsRes.data);

        // Fetch product posts
        const productsRes = await api.get(`/purchase/products?userId=${userInformation._id}`);
        setProducts(productsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch user profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInformation]);

  if (!userInformation) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <img 
          src={userInformation.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
          alt="Profile" 
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
        />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{userInformation.username}</h1>
          <p className="text-gray-500 mb-4">{userInformation.email}</p>
          <div className="flex justify-center sm:justify-start gap-4 text-sm font-medium">
             <div className="text-gray-600"><span className="text-gray-900 font-bold">{posts.length}</span> Posts</div>
             <div className="text-gray-600"><span className="text-gray-900 font-bold">{products.length}</span> Products</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {userInformation?.role === "admin" && (
            <button 
              onClick={() => navigate("/admin")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <FaShieldAlt /> Admin Panel
            </button>
          )}
          <button 
            onClick={logOut}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-sm active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* User Products section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            My Marketplace
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{products.length}</span>
          </h2>
          {loading ? (
            <Loader />
          ) : products.length > 0 ? (
            <div className="space-y-4">
              {products.map(product => (
                <MyProductCard 
                  key={product._id} 
                  product={product} 
                  onDelete={(deletedId) => setProducts(products.filter(p => p._id !== deletedId))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400">You haven't listed any items for sale.</p>
            </div>
          )}
        </section>

        {/* User Posts section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            My Social Posts
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{posts.length}</span>
          </h2>
          {loading ? (
            <Loader />
          ) : posts.length > 0 ? (
            <PostProvider>
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onDelete={(deletedId) => setPosts(posts.filter(p => p._id !== deletedId))}
                  />
                ))}
              </div>
            </PostProvider>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400">Your feed is currently empty.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}