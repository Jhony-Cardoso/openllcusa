import { renderToString } from 'react-dom/server';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import * as React from 'react';

function Test() {
  const chat = useChat({ 
    transport: new DefaultChatTransport({ api: '/api/chat' }) 
  });
  console.log(Object.keys(chat));
  return <div>Test</div>;
}
renderToString(<Test />);
