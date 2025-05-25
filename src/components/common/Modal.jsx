import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({
  onClose,
  title,
  children,
  className = '',
  showClose = true,
  overlayClassName = '',
  ...props
}) => {
  // Close modal when clicking on overlay (but not modal content)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      {...props}
    >
      <div className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all scale-100 opacity-100 ${className}`} onClick={e => e.stopPropagation()}>
        {(title || showClose) && (
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
            {showClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                aria-label="Close modal"
                type="button"
              >
                &times;
              </button>
            )}
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('root')
  );
};

export default Modal;