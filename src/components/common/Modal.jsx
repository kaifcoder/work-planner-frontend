import ReactDOM from 'react-dom';

const Modal = ({ onClose, title, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2"> {/* Added max-height and overflow for scrollable content */}
          {children}
        </div>
        <div className="flex justify-end pt-4 mt-4 border-t">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('root') // Or a dedicated modal root div in public/index.html
  );
};

export default Modal;