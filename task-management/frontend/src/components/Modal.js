import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 text-xl font-bold">×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
