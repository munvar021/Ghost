import React, { useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../CodeBlock/CodeBlock';
import './TranscriptDisplay.css';

const TranscriptDisplay = ({ transcript }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="transcript-display">
      {transcript.map((item, index) => (
        <div key={index} className={`transcript-item ${item.type}`}>
          <ReactMarkdown components={components}>{item.text}</ReactMarkdown>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(TranscriptDisplay);
