import React from 'react';
import './Group.css';

interface GroupProps {
  groupName: string;
  unreadCount?: number;
  timestamp: string;
  onClick?: () => void;
}

const Group: React.FC<GroupProps> = ({ 
  groupName, 
  unreadCount, 
  timestamp,
  onClick 
}) => {
  return (
    <div className="group" onClick={onClick}>
      <div className="group-icon">
        <span>{groupName.charAt(0).toUpperCase()}</span>
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
  );
};

export default Group;
