import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function Feedback() {
  const { register, handleSubmit, reset } = useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const loadFeedbacks = async () => {
    try {
      const res = await api.get('/feedback/get');
      if (res.data) {
        // Assume array comes back
        setFeedbacks(Array.isArray(res.data) ? res.data : (res.data.feedbacks || []));
      }
    } catch (err) {
      console.error('Error loading feedback:', err);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMsg('');
      await api.post('/feedback/', data);
      setMsg('Feedback submitted successfully!');
      reset();
      loadFeedbacks();
    } catch (err) {
      setMsg('Failed to submit feedback: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form side */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent mb-8">
          We value your feedback
        </h1>

        {msg && (
          <div className={`p-4 mb-6 rounded-xl border ${msg.includes('Failed') ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
            <textarea {...register('message')} className="input-field min-h-[120px]" placeholder="Tell us what you think..." required />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Rating (1-5)</label>
             <input {...register('rating')} type="number" min="1" max="5" className="input-field w-32" placeholder="5" required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary bg-rose-600 hover:bg-rose-500 shadow-rose-500/20 py-3">
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* List side */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Feedback</h2>
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <p className="text-slate-500 italic">No feedback submitted yet.</p>
          ) : (
            feedbacks.map((fb, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-xl border-l-4 border-l-orange-500">
                 <div className="flex justify-between items-start mb-2">
                   <span className="text-orange-300 font-bold">★ {fb.rating} / 5</span>
                   <span className="text-xs text-slate-500">{new Date(fb.createdAt || Date.now()).toLocaleDateString()}</span>
                 </div>
                 <p className="text-slate-300">{fb.message}</p>
                 {fb.user && <p className="text-xs text-slate-500 mt-2">— User: {fb.user}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
