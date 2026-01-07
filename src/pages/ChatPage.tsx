import { useState, useRef, useEffect } from 'react';
import { Search, Send, User, Paperclip, MoreVertical, Phone, Video, Info, Check, CheckCheck, Smile, Image as ImageIcon } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
    isMe: boolean;
}

interface ChatSession {
    id: number;
    userName: string;
    userAvatar: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    status: 'online' | 'offline';
    messages: Message[];
}

export default function ChatPage() {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const [chatSessions, setChatSessions] = useState<ChatSession[]>([
        {
            id: 1,
            userName: 'Budi Santoso',
            userAvatar: 'BS',
            lastMessage: 'Halo admin, saya mau tanya soal stok laptop Dell',
            timestamp: '10:30',
            unreadCount: 2,
            status: 'online',
            messages: [
                { id: 1, senderId: 1, text: 'Halo, selamat pagi!', timestamp: '10:25', status: 'read', isMe: false },
                { id: 2, senderId: 100, text: 'Selamat pagi Pak Budi! Ada yang bisa kami bantu?', timestamp: '10:26', status: 'read', isMe: true },
                { id: 3, senderId: 1, text: 'Saya mau tanya soal stok laptop Dell XPS 13 yang baru.', timestamp: '10:28', status: 'read', isMe: false },
                { id: 4, senderId: 1, text: 'Apakah masih tersedia?', timestamp: '10:30', status: 'read', isMe: false },
            ]
        },
        {
            id: 2,
            userName: 'Siti Aminah',
            userAvatar: 'SA',
            lastMessage: 'Terima kasih informasinya',
            timestamp: '09:45',
            unreadCount: 0,
            status: 'offline',
            messages: [
                { id: 1, senderId: 2, text: 'Kapan pesanan saya dikirim?', timestamp: '09:40', status: 'read', isMe: false },
                { id: 2, senderId: 100, text: 'Sudah kami kirim tadi pagi kak, resinya JNE12345678', timestamp: '09:42', status: 'read', isMe: true },
                { id: 3, senderId: 2, text: 'Terima kasih informasinya', timestamp: '09:45', status: 'read', isMe: false },
            ]
        },
        {
            id: 3,
            userName: 'Andi Wijaya',
            userAvatar: 'AW',
            lastMessage: 'Bisa minta foto produk aslinya?',
            timestamp: 'Kemarin',
            unreadCount: 1,
            status: 'online',
            messages: [
                { id: 1, senderId: 3, text: 'Halo, saya naksir tas Gucci nya', timestamp: 'Kemarin', status: 'read', isMe: false },
                { id: 2, senderId: 3, text: 'Bisa minta foto produk aslinya?', timestamp: 'Kemarin', status: 'read', isMe: false },
            ]
        }
    ]);

    const activeChat = chatSessions.find(chat => chat.id === selectedChatId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedChatId, activeChat?.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChatId) return;

        const sentMsg: Message = {
            id: Date.now(),
            senderId: 100,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            isMe: true
        };

        setChatSessions(prev => prev.map(chat => {
            if (chat.id === selectedChatId) {
                return {
                    ...chat,
                    lastMessage: newMessage,
                    timestamp: sentMsg.timestamp,
                    messages: [...chat.messages, sentMsg]
                };
            }
            return chat;
        }));

        setNewMessage('');
    };

    const filteredSessions = chatSessions.filter(chat =>
        chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-64px)] p-6 bg-gray-50 flex flex-col">
                <div className="bg-white rounded-2xl shadow-lg flex-1 flex overflow-hidden border border-gray-100">

                    {/* Sidebar Chat List */}
                    <div className="w-96 border-r flex flex-col bg-white">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Live Chat</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari chat..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all font-medium text-sm"
                                    style={{ '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredSessions.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={`p-4 cursor-pointer flex items-center space-x-4 transition-all hover:bg-gray-50 ${selectedChatId === chat.id ? 'bg-blue-50/50 border-r-4' : ''}`}
                                    style={{ borderRightColor: selectedChatId === chat.id ? 'var(--color-info)' : 'transparent' }}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm bg-linear-to-br from-indigo-500 to-purple-600">
                                            {chat.userAvatar}
                                        </div>
                                        {chat.status === 'online' && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold truncate text-sm" style={{ color: 'var(--color-dark-gray)' }}>{chat.userName}</h3>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{chat.timestamp}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                                            {chat.unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col bg-[#F8F9FD]">
                        {activeChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 bg-white border-b flex items-center justify-between shadow-sm z-10">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs bg-linear-to-br from-indigo-500 to-purple-600 shadow-sm">
                                            {activeChat.userAvatar}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: 'var(--color-dark-gray)' }}>{activeChat.userName}</h3>
                                            <div className="flex items-center space-x-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${activeChat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <span className="text-[10px] text-gray-500 capitalize">{activeChat.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"><Phone className="w-5 h-5" /></button>
                                        {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"><Video className="w-5 h-5" /></button> */}
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"><Info className="w-5 h-5" /></button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"><MoreVertical className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                                    {activeChat.messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] group`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}
                                                    style={msg.isMe ? { backgroundColor: 'var(--color-primary)' } : {}}
                                                >
                                                    {msg.text}
                                                </div>
                                                <div className={`mt-1 flex items-center space-x-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${msg.isMe ? 'justify-end' : 'justify-start'} text-gray-400`}>
                                                    <span>{msg.timestamp}</span>
                                                    {msg.isMe && (
                                                        <span>
                                                            {msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3" />}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className="p-6 bg-white border-t">
                                    <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                                        <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                                        <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Smile className="w-5 h-5" /></button>
                                        <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Tulis pesan..."
                                                className="w-full px-6 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-opacity-50 transition-all font-medium text-sm pr-12"
                                                style={{ '--tw-ring-color': 'var(--color-info)' } as React.CSSProperties}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:shadow-none transition-all"
                                                style={{ backgroundColor: newMessage.trim() ? 'var(--color-primary)' : '' }}
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-10 h-10" />
                                </div>
                                <p className="font-medium">Pilih pesan untuk mulai mengobrol</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
