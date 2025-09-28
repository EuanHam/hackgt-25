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
              {/* Hardcoded messages from group.json */}
              {groupName === "Free Food @ Tech (READ DESCRIPTION)" && (
                <>
                  <div className="chat-message">
                    <div className="chat-sender">GroupMe</div>
                    <div className="chat-text">Ranya Khan edited to: "Some leftover free food (halal) from Marrakech express right outside kirkwood room exhibition hall"</div>
                    <div className="chat-timestamp">{new Date(1759021532 * 1000).toLocaleTimeString()}</div>
                  </div>
                  <div className="chat-message">
                    <div className="chat-sender">Ranya Khan</div>
                    <div className="chat-text">Some leftover free food (halal) from Marrakech express right outside kirkwood room exhibition hall</div>
                    <div className="chat-timestamp">{new Date(1759021107 * 1000).toLocaleTimeString()}</div>
                  </div>
                  <div className="chat-message">
                    <div className="chat-sender">Ryder Johnson</div>
                    <div className="chat-text">Free Food at COC lobby right now</div>
                    <div className="chat-timestamp">{new Date(1759019982 * 1000).toLocaleTimeString()}</div>
                  </div>
                </>
              )}
              {groupName === "Hackgt25" && (
                <>
                  <div className="chat-message">
                    <div className="chat-sender">GroupMe</div>
                    <div className="chat-text">Euan Ham changed the group's avatar</div>
                    <div className="chat-timestamp">{new Date(1759011054 * 1000).toLocaleTimeString()}</div>
                  </div>
                  <div className="chat-message">
                    <div className="chat-sender">Annabelle Lee</div>
                    <div className="chat-text">Don’t read this message either</div>
                    <div className="chat-timestamp">{new Date(1758992672 * 1000).toLocaleTimeString()}</div>
                  </div>
                  <div className="chat-message">
                    <div className="chat-sender">Euan Ham</div>
                    <div className="chat-text">Don’t read this message</div>
                    <div className="chat-timestamp">{new Date(1758992564 * 1000).toLocaleTimeString()}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Group;
