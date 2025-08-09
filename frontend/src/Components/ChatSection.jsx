import { useState, useEffect, useRef } from 'react';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import { format } from 'date-fns';
import { SendHorizonalIcon, User2Icon, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import useChatStore, { useViewStore } from '../store/store';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const socket = io(`${API_BASE_URL}`) // ✅ Change to your server URL

function ChatSection() {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setShowChat = useViewStore((state) => state.setShowChat);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch history when a user is selected
  useEffect(() => {
    if (!selectedUser?._id) return;

    axios
      .get(`${API_BASE_URL}/api/messages/${selectedUser._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Failed to fetch messages', err));

    // Join socket room for real-time chat
    socket.emit('join_room', selectedUser._id);

    // Listen for new incoming messages
    socket.on('receive_message', (msg) => {
      if (msg.wa_id === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [selectedUser]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !selectedUser?._id) return;
    const nowSec = Math.floor(Date.now() / 1000);

    const newMsg = {
      id: `wamid.${Date.now()}-${Math.random().toString(36).slice(2)}`, // simple wamid generator
      contact_name: selectedUser.name,
      direction: 'outbound',
      from: '918329446654', // ✅ Your number
      status: 'sent',
      text: input,
      timestamp: nowSec,
      to: selectedUser._id,
      type: 'text',
      wa_id: selectedUser._id,
      status_timestamp: nowSec
    };

    // Show instantly
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Save to DB
    axios.post(`${API_BASE_URL}/api/messages/insert`, newMsg)
      .catch((err) => console.error('Send failed', err));

    // Send via WebSocket
    socket.emit('send_message', newMsg);
  };

  const renderStatusIcon = (status) => {
    if (status === 'read') return <BsCheck2All className="text-blue-500 inline-block ml-1" />;
    if (status === 'delivered') return <BsCheck2All className="inline-block ml-1" />;
    if (status === 'sent') return <BsCheck2 className="inline-block ml-1" />;
    return null;
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = format(new Date(msg.timestamp * 1000), 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="chat-section flex-1 flex flex-col h-screen bg-[url('/bg-whatsapp.png')] bg-cover">
      {/* Header */}
      <div className="bg-zinc-800 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-full hover:bg-zinc-700"
            onClick={() => setShowChat(false)}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="rounded-full p-3 border">
            <User2Icon />
          </div>
          <h2 className="text-lg font-semibold">{selectedUser.name || 'Unknown'}</h2>
        </div>
        <span className="text-xs text-gray-300">last seen today at 20:29</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {Object.entries(groupedMessages).map(([date, msgs], index) => (
          <div key={index}>
            <div className="text-center text-xs text-gray-400 mb-2">
              {format(new Date(date), 'dd-MM-yyyy')}
            </div>
            {msgs.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.direction === 'outbound' ? 'justify-end pt-2' : 'justify-start pt-2'}`}
              >
                <div
                  className={`max-w-[300px] md:max-w-[500px] flex-wrap break-words px-3 py-2 flex gap-2 rounded-lg relative ${
                    msg.direction === 'outbound'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <span>{msg.text}</span>
                  <div className="text-[10px] text-right mt-1 flex items-center gap-1">
                    {format(new Date(msg.timestamp * 1000), 'HH:mm')}
                    {msg.direction === 'outbound' && renderStatusIcon(msg.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-gray-100 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-full px-4 py-2 outline-none"
          value={input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
              e.preventDefault();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        {input && (
          <button
            className="text-black px-4 py-2 cursor-pointer rounded-full"
            onClick={handleSend}
          >
            <SendHorizonalIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatSection;
