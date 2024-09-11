import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteFilled } from '@ant-design/icons';
import "./ChatList.css";

const ChatList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // retrieve all user chats history from the backend to display on the Navbar to the side
    const { isLoading, error, data } = useQuery({
        queryKey: ["userChats"],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/userchats`, {
                credentials: "include",
            }).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch chats");
                }
                return res.json();
            }),
    });

    // mutation to delete a chat
    const deleteChatMutation = useMutation({
        mutationFn: async (chatId) => {
            await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/chats/${chatId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["userChats"]);
            navigate('/dashboard');     // navigate to dashboard after deletion
        },
        onError: (err) => {
            console.log(err);
            alert("Failed to delete the chat. Please try again.");
        }
    });

    // handle chat deletion
    const handleDelete = (chatId) => {
        const confirmed = window.confirm("Are you sure you want to delete this chat and all associated history?");
        if (confirmed) {
            deleteChatMutation.mutate(chatId);
        }
    };
    
    const groupChatsByDate = (chats) => {
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // in milliseconds

        const groups = {
            today: [],
            yesterday: [],
            previous7Days: [],
            previous30Days: [],
            older: {}
        };

        chats.forEach(chat => {
            const chatDate = new Date(chat.createdAt);
            const diffDays = Math.floor((today - chatDate) / oneDay);

            if (diffDays === 0) {
                groups.today.push(chat);
            } else if (diffDays === 1) {
                groups.yesterday.push(chat);
            } else if (diffDays > 1 && diffDays <= 7) {
                groups.previous7Days.push(chat);
            } else if (diffDays > 7 && diffDays <= 30) {
                groups.previous30Days.push(chat);
            } else {
                const monthYear = chatDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                if (!groups.older[monthYear]) {
                    groups.older[monthYear] = [];
                }
                groups.older[monthYear].push(chat);
            }
        });

        return groups;
    };

    const groupedChats = data ? groupChatsByDate(data.toReversed()) : null;

    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a New Chat</Link>
            <Link to="/">Explore Nexus AI</Link>
            <Link to="/contact">Contact</Link>

            <hr />

            <span className="title">RECENT CHATS</span>

            <div className='list'>
                {/* navigate to different chats based on their id from the chat list */}
                { isLoading
                    ? "Loading ..."
                    : error
                    ? "Something went wrong. Please try again!"
                    : !groupedChats || data?.length === 0
                    ? <span className='cl-msg'>Create a new chat to get started!</span>
                    : (
                        <>
                            {groupedChats.today.length > 0 && (
                                <div style={{ paddingTop: '15px' }}>
                                    <h4 style={{ paddingBottom: '11px' }}>Today</h4>
                                    {groupedChats.today.map((chat) => (
                                        <div key={chat._id} className='chatItem'>
                                            <Link to={`/dashboard/chats/${chat._id}`}>{chat.title}</Link>
                                            <span className='deleteIcon' onClick={() => handleDelete(chat._id)}>
                                                <DeleteFilled />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {groupedChats.yesterday.length > 0 && (
                                <div style={{ paddingTop: '35px' }}>
                                    <h4 style={{ paddingBottom: '11px' }}>Yesterday</h4>
                                    {groupedChats.yesterday.map((chat) => (
                                        <div key={chat._id} className='chatItem'>
                                            <Link to={`/dashboard/chats/${chat._id}`}>{chat.title}</Link>
                                            <span className='deleteIcon' onClick={() => handleDelete(chat._id)}>
                                                <DeleteFilled />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {groupedChats.previous7Days.length > 0 && (
                                <div style={{ paddingTop: '35px' }}>
                                    <h4 style={{ paddingBottom: '11px' }}>Previous 7 Days</h4>
                                    {groupedChats.previous7Days.map((chat) => (
                                        <div key={chat._id} className='chatItem'>
                                            <Link to={`/dashboard/chats/${chat._id}`}>{chat.title}</Link>
                                            <span className='deleteIcon' onClick={() => handleDelete(chat._id)}>
                                                <DeleteFilled />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {groupedChats.previous30Days.length > 0 && (
                                <div style={{ paddingTop: '35px' }}>
                                    <h4 style={{ paddingBottom: '11px' }}>Previous 30 Days</h4>
                                    {groupedChats.previous30Days.map((chat) => (
                                        <div key={chat._id} className='chatItem'>
                                            <Link to={`/dashboard/chats/${chat._id}`}>{chat.title}</Link>
                                            <span className='deleteIcon' onClick={() => handleDelete(chat._id)}>
                                                <DeleteFilled />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {Object.keys(groupedChats.older).length > 0 && (
                                Object.keys(groupedChats.older).map((monthYear) => (
                                    <div key={monthYear} style={{ paddingTop: '35px' }}>
                                        <h4 style={{ paddingBottom: '11px' }}>{monthYear}</h4>
                                        {groupedChats.older[monthYear].map((chat) => (
                                            <div key={chat._id} className='chatItem'>
                                                <Link to={`/dashboard/chats/${chat._id}`}>{chat.title}</Link>
                                                <span className='deleteIcon' onClick={() => handleDelete(chat._id)}>
                                                    <DeleteFilled />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                        </>
                    )
                }
            </div>

            <div className="upgrade">
                <img src="/logo.png" alt="Nexus Logo" />
                <div className="texts">
                    <span>Upgrade to Nexus AI Pro</span>
                    <span>Get unlimited access to all features!</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList;