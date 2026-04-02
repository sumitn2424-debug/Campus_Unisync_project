import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function Store() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage('');
      const formData = new FormData();
      if (data.productImage[0]) formData.append('productImage', data.productImage[0]);
      if (data.name) formData.append('name', data.name);
      if (data.price) formData.append('price', data.price);

      await api.post('/purchase/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Product submitted successfully!');
      reset();
    } catch (err) {
      setMessage('Error submitting product: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-8">
        Add Product to Store
      </h1>

      {message && (
        <div className={`p-4 mb-6 rounded-xl border ${message.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Product Name</label>
          <input {...register('name')} className="input-field" placeholder="e.g. Wireless Headphones" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Price</label>
          <input {...register('price')} type="number" step="0.01" className="input-field" placeholder="0.00" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Product Image (Required)</label>
          <input {...register('productImage')} type="file" accept="image/*" className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30" required />
        </div>

        <button type="submit" disabled={loading} className="btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 focus:ring-emerald-500/50 py-3 mt-4">
          {loading ? 'Processing...' : 'Submit Product'}
        </button>
      </form>
    </div>
  );
}
