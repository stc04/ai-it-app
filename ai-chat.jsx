import React, { useState } from 'react';

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    setLoading(true);
    const messages = [...conversation, { role: 'user', content: inputValue }];

    const req = await fetch('REACT_APP_API', {
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

    const result = res.choices[0].message.content;
    setConversation([...messages, { role: 'assistant', content: result }]);
    setInputValue('');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-scroll">
          {conversation.map((message, index) => (
            <div key={index} className={`my-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
