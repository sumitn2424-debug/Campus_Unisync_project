import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

export default function PurchaseFeed() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { userInformation } = useAuth();

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

    // 🔥 Handle Delete Button
    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const loadingToast = toast.loading("Deleting product...");
        try {
            await api.delete(`/purchase/product/${productId}`);
            toast.success("Product deleted successfully!", { id: loadingToast });
            // Remove from feed seamlessly
            setProducts((prev) => prev.filter((p) => p._id !== productId));
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete product", { id: loadingToast });
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-6 pb-20">
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
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-semibold">{item.productName}</h2>
                            
                            {/* Delete Button (Visible to owner OR Admin) */}
                            {(userInformation?._id === item.userId?._id || userInformation?.role === "admin") && (
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-gray-400 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50"
                                    title="Delete Product"
                                >
                                    <FaTrash size={16} />
                                </button>
                            )}
                        </div>

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