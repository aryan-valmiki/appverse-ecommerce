import React, { useEffect, useState } from 'react'
import { deleteItem, getCart, updateQuantity } from '../features/cart/cart.js'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createorder } from '../features/order/order.js';
import { toast } from 'react-toastify';


function Cart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const loggedInUser = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!loggedInUser) return navigate("/login");
      try {
        setLoading(true);
        setError(null);
        const response = await getCart();
        setCart(response.data.cart);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedInUser]);

  const calculateTotalAmount = () => {
    const amount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotalAmount(Number(amount));
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [cart]);

  const refreshCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data.cart);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (!loggedInUser) return setError("Login to update quantity");
    try {
      await updateQuantity({ productId, quantity });
      await refreshCart();
      toast.success("Quantity updated");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!loggedInUser) return setError("Login to delete item");
    try {
      await deleteItem(id);
      await refreshCart();
      toast.success("Item removed");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!loggedInUser) return setError("Login to place order");
    try {
      const response = await createorder();
      if (response.status === 201) {
        toast.success("Order placed successfully");
        setCart([]);
        navigate("/orders");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error && cart.length === 0) return <div className="text-red-500 text-center">{error}</div>;
  if (cart.length === 0) return <div className="text-center py-20 text-gray-500 text-xl">Your cart is empty</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Shopping Cart</h2>

      <div className="space-y-6">
        {cart.map((cartItem) => (
          <div
            key={cartItem._id}
            className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-5 w-full md:w-[60%]">
              <img src={cartItem.product.image} alt="" className="w-28 h-28 object-contain rounded-lg border" />
              <div>
                <div className="font-semibold text-lg text-gray-800">{cartItem.product.title}</div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">{cartItem.product.description}</div>
                <div className="text-base font-medium text-gray-700 mt-2">₹{cartItem.product.price.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex flex-col items-end md:items-center gap-3 mt-4 md:mt-0">
              <select
                className="border px-3 py-1 rounded-md text-sm"
                value={cartItem.quantity}
                onChange={(e) => handleUpdateQuantity(cartItem._id, Number(e.target.value))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <button
                onClick={() => handleDeleteItem(cartItem._id)}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xl font-semibold text-gray-800">
          Total: ₹{totalAmount.toFixed(2)}
        </div>
        <button
          onClick={handlePlaceOrder}
          className="mt-4 sm:mt-0 bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Cart;
