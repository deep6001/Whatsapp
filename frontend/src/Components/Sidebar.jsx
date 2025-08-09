import { SearchIcon, User2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useChatStore from '../store/store';
import { useViewStore } from '../store/store';

function Sidebar() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const setShowChat = useViewStore((state) => state.setShowChat); // 📌

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/messages/getallusers`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Failed to fetch users', err));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user._id.includes(search)
  );

  const getPreview = (text, wordLimit = 5) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts * 1000);
    const today = new Date();
    const isYesterday =
      today.getDate() - date.getDate() === 1 &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear();

    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-GB');
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowChat(true); // 📌 show chat on mobile
  };

  return (
    <div className="w-full md:w-[380px] bg-[#111b21] text-white h-screen flex flex-col border-r border-[#2e3b42]">
      {/* Header */}
      <div className="p-4 text-xl font-semibold">Chats</div>

      {/* Search */}
      <div className="px-4 pb-2 border-b border-[#202c33]">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#202c33] text-sm text-white placeholder-gray-400 outline-none border border-transparent focus:border-[#00a884] focus:bg-[#2a3942] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a3942] scrollbar-track-transparent">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectUser(user)}
              className="flex justify-center items-center gap-4 px-4 py-3 hover:bg-[#2a3942] cursor-pointer transition-all"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                  <User2Icon className="text-white w-6 h-6" />
                </div>
              )}

              <div className="flex-1 border-b border-[#202c33] pb-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm truncate">
                    {user.name || 'Unknown'}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {formatTimestamp(user.lastTimestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {getPreview(user.lastMessage, 6)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-10">No users found</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
