import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, disabled }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !disabled) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="bg-white border-t border-gray-200 px-4 py-4">
            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                <div className="flex-1">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question here... (e.g., 'My child is 10 months old but not crawling yet')"
                        disabled={disabled}
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={disabled || !inputValue.trim()}
                    className="flex-shrink-0 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                >
                    <div className="flex items-center space-x-2">
                        <span>Send</span>
                        <span>📤</span>
                    </div>
                </button>
            </form>

            {/* Quick Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    onClick={() => setInputValue("My child is 10 months old but not crawling yet")}
                    disabled={disabled}
                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                    💡 Not crawling at 10 months
                </button>
                <button
                    onClick={() => setInputValue("My 2-year-old is not talking much")}
                    disabled={disabled}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                    💡 Not talking at 2 years
                </button>
                <button
                    onClick={() => setInputValue("My 12-month-old cannot stand alone")}
                    disabled={disabled}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                    💡 Not standing at 12 months
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
