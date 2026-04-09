import { FaTrash, FaRupeeSign } from "react-icons/fa";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function MyProductCard({ product, onDelete }) {
  const { userInformation } = useAuth();
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const resp = api.delete(`/purchase/product/${product._id}`);
      toast.promise(resp, {
        loading: "Deleting product...",
        success: "Product deleted successfully!",
        error: "Failed to delete product.",
      });

      await resp;
      if (onDelete) onDelete(product._id);
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row gap-4 p-3 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <img
        src={product.productImage}
        alt={product.productName}
        className="w-full sm:w-32 h-32 object-cover rounded-lg"
      />

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-800 leading-tight">
              {product.productName}
            </h3>
            {/* Delete Button (Visible to owner OR Admin) */}
            {(userInformation?._id === product.userId?._id || userInformation?.role === "admin") && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                title="Delete Product"
              >
                <FaTrash size={16} />
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {product.productDescription}
          </p>
        </div>

        <div className="flex items-center text-green-600 font-bold text-lg mt-2">
          <FaRupeeSign size={14} className="mr-0.5" />
          {product.price}
        </div>
      </div>
    </div>
  );
}
