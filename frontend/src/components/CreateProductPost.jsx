import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateProductPost() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("price", price);
    formData.append("image", productImage);

    const loadingToast = toast.loading("Listing your product...");

    try {
      const res = await api.post("/purchase/product", formData);
      console.log(res);

      // reset form
      setProductName("");
      setProductDescription("");
      setPrice("");
      setProductImage(null);
      setPreview(null);
      
      toast.success("Product listed successfully!", { id: loadingToast });
      
      // Redirect after 1 second
      setTimeout(() => {
        navigate("/marketPlace");
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error("Failed to list product", { id: loadingToast });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Product Post</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded-lg outline-none"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Product Description"
          className="border p-2 rounded-lg outline-none"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded-lg outline-none"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Post Product
        </button>
      </form>
    </div>
  );
}