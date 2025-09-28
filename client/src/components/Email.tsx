import React, { useState } from 'react';
import './Email.css';

interface EmailProps {
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  body?: string; 
  isRead?: boolean;
}

const Email: React.FC<EmailProps> = ({ 
  sender, 
  subject, 
  preview, 
  timestamp, 
  body,
  isRead = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Email Card */}
      <div 
        className={`email ${isRead ? 'read' : 'unread'}`} 
        onClick={() => setIsModalOpen(true)}
      >
        <div className="email-header">
          <div className="email-sender">{sender}</div>
          <div className="email-timestamp">{timestamp}</div>
        </div>
        <div className="email-subject">{subject}</div>
        <div className="email-preview">{preview}</div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div 
            className="modal-backdrop" 
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="email-modal">
            {/* Close button */}
            <button 
              className="modal-close" 
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            {/* Modal content */}
            <div className="email-modal-content">
              <div className="email-modal-header">
                <h1>{subject}</h1>
                <div className="email-modal-sender">{sender}</div>
                <div className="email-modal-timestamp">{timestamp}</div>
              </div>

              <div className="email-modal-body">
                <p>{body}</p> {/*fall back to preview if no body */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Email;
