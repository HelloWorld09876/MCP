import React from 'react';

const ChatMessage = ({ message }) => {
    const isBot = message.sender === 'bot';

    const getMessageStyle = () => {
        if (!isBot) {
            return 'bg-primary text-white ml-auto';
        }

        switch (message.responseType) {
            case 'red_flag':
                return 'bg-red-50 border-2 border-danger text-gray-800';
            case 'concern':
                return 'bg-orange-50 border-2 border-warning text-gray-800';
            case 'error':
                return 'bg-gray-100 border-2 border-gray-300 text-gray-800';
            default:
                return 'bg-white border border-gray-200 text-gray-800';
        }
    };

    const getIcon = () => {
        if (!isBot) return '👤';

        switch (message.responseType) {
            case 'red_flag':
                return '🏥';
            case 'concern':
                return '💡';
            case 'error':
                return '⚠️';
            default:
                return '🤖';
        }
    };

    const formatMessageText = (text) => {
        // Split by newlines and format
        return text.split('\n').map((line, index) => {
            // Check for bold markdown
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <p key={index} className="mb-2">
                        {parts.map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                    </p>
                );
            }

            // Regular line
            return line.trim() ? <p key={index} className="mb-2">{line}</p> : <br key={index} />;
        });
    };

    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-start space-x-2`}>
            {isBot && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xl shadow-md">
                    {getIcon()}
                </div>
            )}

            <div className={`max-w-xl md:max-w-2xl rounded-2xl px-4 py-3 shadow-md ${getMessageStyle()}`}>
                <div className="text-sm md:text-base whitespace-pre-wrap break-words">
                    {formatMessageText(message.text)}
                </div>

                {message.referralNeeded && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                        <div className="flex items-center space-x-2 text-danger font-semibold">
                            <span>⚠️</span>
                            <span className="text-sm">Referral Recommended</span>
                        </div>
                    </div>
                )}

                <div className={`text-xs mt-2 ${isBot ? 'text-gray-500' : 'text-green-100'}`}>
                    {message.timestamp.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>

            {!isBot && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white text-xl shadow-md">
                    {getIcon()}
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
