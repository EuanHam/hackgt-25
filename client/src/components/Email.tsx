import React from 'react';
import './Email.css';

interface EmailProps {
  sender: string;
  senderEmail?: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead?: boolean;
}

const Email: React.FC<EmailProps> = ({ 
  sender, 
  senderEmail,
  subject, 
  preview, 
  timestamp, 
  isRead = false 
}) => {
  return (
    <div className={`email ${isRead ? 'read' : 'unread'}`}>
      <div className="email-header">
        <div 
          className="email-sender" 
          title={senderEmail || undefined}
        >
          {sender}
        </div>
        <div className="email-timestamp">{timestamp}</div>
      </div>
      <div className="email-subject">{subject}</div>
      <div className="email-preview">{preview}</div>
    </div>
  );
};

export default Email;
