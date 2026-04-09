import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function PurchaseFeed() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await api.get("/purchase/products");
            setProducts(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 🔥 Handle Chat Button
    const handleChat = (item) => {
        if (!item.userId) {
            console.error("❌ User not found");
            return;
        }
        navigate("/Message", {
            state: {
                userId: item.userId._id,
                username: item.userId.username,
                image: item.userId.image,
                sharedPost: {
                  title: item.productName,
                  image: item.productImage,
                  price: item.price
                }
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
                            onClick={() => handleChat(item)}
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