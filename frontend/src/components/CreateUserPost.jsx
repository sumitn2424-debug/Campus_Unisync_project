import { useState } from "react";
import axios from "axios";
import api from "../services/api";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", title);
    formData.append("productDescription", description);
    formData.append("image", image);

    try {
      const res = await api.post("/purchase/product", formData);

      const data = await res.json();
      console.log(data);

      // reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Post</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          className="border p-2 rounded-lg outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Enter description"
          className="border p-2 rounded-lg outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Image Preview */}
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
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 active:scale-95"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}