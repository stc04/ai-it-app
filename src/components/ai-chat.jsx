import { useState } from 'react';

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    setLoading(true);
    const messages = [...conversation, { role: 'user', content: inputValue }];

    try {
      const req = await fetch('http://47.195.18.209:11434/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tinyllama:latest',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1.0,
          frequency_penalty: 0.5,
          presence_penalty: 0.6
        })
      });

      const res = await req.json();

      if (!res.choices || res.choices.length === 0) {
        console.error('No choices returned from the API');
        setLoading(false);
        return;
      }

      console.log('API Response:', res); // Log the API response
      if (res.choices && res.choices.length > 0) {
        const result = res.choices[0].message.content; 
        console.log('Updated Conversation:', [...messages, { role: 'assistant', content: result }]); // Log the updated conversation
        setConversation([...messages, { role: 'assistant', content: result }]);
      } else {
        console.error('No valid choices returned from the API');
      }
      setConversation([...messages, { role: 'assistant', content: result }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setInputValue('');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {conversation.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
                <p>Thinking...</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 border-t pt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className={`px-4 py-2 rounded-lg font-medium ${
              loading || !inputValue.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
