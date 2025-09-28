import React, { useState } from 'react';
import './Group.css';

interface GroupProps {
  groupName: string;
  unreadCount?: number;
  timestamp: string;
  groupIconUrl?: string;
}

const Group: React.FC<GroupProps> = ({ 
  groupName, 
  unreadCount, 
  timestamp,
  groupIconUrl
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const hasImage = groupIconUrl && groupIconUrl.length > 0;

  return (
    <>
      {/* Group card */}
      <div className="group" onClick={() => setModalOpen(true)}>
        <div className={`group-icon ${hasImage ? 'has-image' : ''}`}>
          {hasImage ? (
            <img src={groupIconUrl} alt={groupName} className="group-icon-img" />
          ) : (
            <span>{groupName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="group-content">
          <div className="group-header">
            <div className="group-name">{groupName}</div>
            <div className="group-timestamp">{timestamp}</div>
          </div>
          <div className="group-unread">
            {(unreadCount ?? 0) > 0 ? (
              <span className="unread-badge">
                {unreadCount} new message{unreadCount !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="no-messages">No new messages</span>
            )}
          </div>
        </div>
      </div>

      {/* Overlay modal (built-in, no extra title box) */}
      {isModalOpen && (
        <>
          <div className="group-modal-backdrop" onClick={() => setModalOpen(false)} />
          <div className="group-modal">
            <div className="group-modal-header">
              <h3>{groupName}</h3>
              <button 
                className="group-modal-close" 
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="group-modal-body">
              <div className="chat-message">
                <div className="chat-sender">Jane</div>
                <div className="chat-text">Hey, are we meeting later?</div>
                <div className="chat-timestamp">9:45 AM</div>
              </div>
              <div className="chat-message">
                <div className="chat-sender">Alex</div>
                <div className="chat-text">Yep, see you at the library 📚</div>
                <div className="chat-timestamp">9:47 AM</div>
              </div>
              <div className="chat-message">
                <div className="chat-sender">You</div>
                <div className="chat-text">Perfect, I’ll bring snacks 😋</div>
                <div className="chat-timestamp">9:49 AM</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Group;
