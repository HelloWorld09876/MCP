import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

const API_URL = 'http://localhost:8000';

function App() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "नमस्ते! 🙏 Hello! I'm here to help with your child's developmental milestones. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (messageText) => {
        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: messageText,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Call API
            const response = await axios.post(`${API_URL}/api/chat`, {
                message: messageText,
            });

            const data = response.data;

            // Format bot response
            let botResponseText = data.response;

            if (data.suggested_activities && data.suggested_activities.length > 0) {
                botResponseText += '\n\n';
                data.suggested_activities.forEach((activity, index) => {
                    botResponseText += `${index + 1}. ${activity}\n`;
                });
            }

            if (data.referral_needed) {
                botResponseText += '\n\n🏥 **कृपया स्वास्थ्य कार्यकर्ता से संपर्क करें | Please consult a health worker**';
            }

            // Add bot message
            const botMessage = {
                id: messages.length + 2,
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date(),
                responseType: data.response_type,
                referralNeeded: data.referral_needed,
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: messages.length + 2,
                text: "I'm sorry, I encountered an error. Please try again.",
                sender: 'bot',
                timestamp: new Date(),
                responseType: 'error',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <header className="bg-primary text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="text-4xl">🏥</div>
                        <div>
                            <h1 className="text-2xl font-bold">Child Health Assistant</h1>
                            <p className="text-sm text-green-100">बाल स्वास्थ्य सहायक | Powered by MCP Guidelines</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                    {isLoading && (
                        <div className="flex items-center space-x-2 text-gray-500">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-sm">Typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-3">
                <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                    <p>💡 Example: "My child is 10 months old but not crawling yet"</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
