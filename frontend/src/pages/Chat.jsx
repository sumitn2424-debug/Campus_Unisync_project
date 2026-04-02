import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const messagesEndRef = useRef(null);

  const myId = user?._id || user?.id || user?.email; // Assuming fallback unique identifiers

  useEffect(() => {
    socket.connect();
    
    if (myId) {
      socket.emit('join', myId);
    }

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, { ...data, isMe: false }]);
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [myId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !receiverId.trim()) return;

    const payload = {
      senderId: myId,
      receiverId: receiverId.trim(),
      message: inputMsg
    };

    socket.emit('send_message', payload);
    setMessages((prev) => [...prev, { ...payload, isMe: true }]);
    setInputMsg('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col glass-panel rounded-2xl overflow-hidden mt-8">
      {/* Chat header */}
      <div className="bg-slate-800/80 p-4 border-b border-slate-700/50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-white">Live Chat</h2>
        <div className="flex items-center gap-2 text-sm w-full md:w-auto">
          <span className="text-slate-400">Target User ID:</span>
          <input 
            value={receiverId} 
            onChange={e => setReceiverId(e.target.value)}
            className="input-field py-1 px-3 text-sm flex-1 md:w-48 bg-slate-900 focus:bg-slate-800" 
            placeholder="Receiver ID..." 
          />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic">
            No messages yet. Set a receiver and say hi!
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                m.isMe 
                  ? 'bg-primary-600 text-white rounded-br-sm' 
                  : 'bg-slate-700/60 text-slate-200 rounded-bl-sm border border-slate-600/50'
              }`}>
                {!m.isMe && <div className="text-xs text-primary-300 font-semibold mb-1">{m.senderId}</div>}
                <div className="leading-relaxed">{m.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={sendMessage} className="p-4 bg-slate-800/50 border-t border-slate-700/50 flex gap-2">
        <input 
          value={inputMsg}
          onChange={e => setInputMsg(e.target.value)}
          className="input-field flex-1"
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!inputMsg.trim() || !receiverId.trim()} className="btn-primary w-auto flex-shrink-0 px-8">
          Send
        </button>
      </form>
    </div>
  );
}
