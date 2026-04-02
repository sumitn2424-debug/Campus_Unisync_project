import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function CreatePost() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage('');
      const formData = new FormData();
      if (data.image[0]) formData.append('image', data.image[0]);
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);

      await api.post('/post/create-Post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Post created successfully!');
      reset();
      setPreview(null);
    } catch (err) {
      setMessage('Error creating post: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent mb-8">
        Create New Post
      </h1>

      {message && (
        <div className={`p-4 mb-6 rounded-xl border ${message.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
          <input {...register('title')} className="input-field" placeholder="A catchy title..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
          <textarea {...register('description')} className="input-field min-h-[120px]" placeholder="What are you thinking about?" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Upload Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl hover:border-primary-500/50 transition-colors">
            <div className="space-y-1 text-center">
              {preview ? (
                <img src={preview} alt="preview" className="mx-auto h-32 w-auto rounded-lg object-cover mb-4" />
              ) : (
                <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div className="flex text-sm text-slate-400 justify-center">
                <label className="relative cursor-pointer rounded-md font-medium text-primary-400 hover:text-primary-300">
                  <span>Upload a file</span>
                  <input {...register('image', { onChange: onImageChange })} type="file" className="sr-only" accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary py-3">
          {loading ? 'Uploading...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}
