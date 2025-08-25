import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 px-6 py-6 border-t">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} DuoTask. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#about" className="hover:underline">Giới thiệu</a>
          <a href="#contact" className="hover:underline">Liên hệ</a>
          <a href="#privacy" className="hover:underline">Chính sách</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
