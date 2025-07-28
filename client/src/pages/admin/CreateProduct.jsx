import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createProduct } from '../../features/admin/admin.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CreateProduct() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null)
  const user = useSelector((state) => state.auth)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.isLoggedIn) return navigate("login")
    if (!user.user.isAdmin) return setError("Unauthorized request")
    if (!title || !price || !description || !quantity || !category || !image) {
      return setError("All fields are required")
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const response = await createProduct(formData);
      if (response.status === 201) {
        toast.success('Product Created');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="w-full border p-2 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="file"
          className="w-full border p-2 rounded"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {error && <div>{error}</div>}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
