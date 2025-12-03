import React from 'react'
import './Messages.css'

interface SuccessMessageProps {
  message: string
  onDismiss?: () => void
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="message message-success">
      <div className="message-content">
        <span className="message-icon">✓</span>
        <p className="message-text">{message}</p>
        {onDismiss && (
          <button onClick={onDismiss} className="message-close">
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default SuccessMessage
