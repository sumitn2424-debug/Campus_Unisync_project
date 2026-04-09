import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PurchaseFeed() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/purchase/products", {
                withCredentials: true,
            });
            setProducts(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🔥 Handle Chat Button
    const handleChat = (user) => {
        if (!user) {
            console.error("❌ User not found");
            return;
        }
        navigate("/message", {
            state: {
                userId: user._id,
                username: user.username,
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-6">
            {products.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-xl overflow-hidden">

                    {/* Image */}
                    <img
                        src={item.productImage}
                        alt="product"
                        className="w-full h-64 object-cover"
                    />

                    {/* Content */}
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">{item.productName}</h2>

                        <p className="text-gray-600 mt-2">
                            {item.productDescription}
                        </p>

                        <p className="text-green-600 font-bold mt-2">
                            ₹ {item.price}
                        </p>

                        <div className="mt-3 text-sm text-gray-500">
                            Posted by: {item.userId?.username}
                        </div>

                        {/* ✅ Chat Button */}
                        <button
                            disabled={!item.userId}
                            onClick={() => handleChat(item.userId)}
                            className={`mt-4 px-4 py-2 rounded ${item.userId ? "bg-blue-500 text-white" : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            Chat Seller
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}