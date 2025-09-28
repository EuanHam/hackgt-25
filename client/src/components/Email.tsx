import React, { useState } from 'react';
import './Email.css';

interface EmailProps {
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead?: boolean;
}

const Email: React.FC<EmailProps> = ({ 
  sender, 
  subject, 
  preview, 
  timestamp, 
  isRead = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Card */}
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
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>{sender}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Subject:</strong> {subject}</p>
              <p>{preview}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Email;
