import React from 'react'
import './Messages.css'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="message message-error">
      <div className="message-content">
        <span className="message-icon">⚠</span>
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

export default ErrorMessage
