import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiUsers, FiTrendingUp, FiEdit2, FiCalendar, FiDollarSign } from "react-icons/fi";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white text-gray-800 px-4 py-12 min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')" }}
      ></div>
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-700 mb-6 animate-fade-in drop-shadow-md">
          DuoTask - Nâng tầm năng suất của bạn
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
          DuoTask là nền tảng toàn diện, tích hợp quản lý nhiệm vụ, ghi chú, lịch trình, giao dịch, và mục tiêu. Dù là học tập cá nhân hay làm việc nhóm, chúng tôi giúp bạn tổ chức mọi thứ một cách dễ dàng và hiệu quả – hoàn toàn miễn phí!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
            <FiCheckCircle className="text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-3">Lên kế hoạch hiệu quả</h3>
            <p className="text-gray-600 text-sm flex-1">
              Quản lý nhiệm vụ cá nhân và nhóm với giao diện trực quan, theo dõi tiến độ từ "chưa" đến "đã" hoàn thành.
            </p>
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
              alt="Task Planning"
              className="mt-4 rounded-lg shadow-md"
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
            <FiUsers className="text-green-600 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-green-700 mb-3">Kết nối và làm việc nhóm</h3>
            <p className="text-gray-600 text-sm flex-1">
              Tạo không gian làm việc chung, quản lý thành viên (editor, viewer), và chia sẻ tài liệu dễ dàng.
            </p>
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
              alt="Team Collaboration"
              className="mt-4 rounded-lg shadow-md"
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
            <FiTrendingUp className="text-yellow-600 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-yellow-700 mb-3">Đạt mục tiêu tài chính</h3>
            <p className="text-gray-600 text-sm flex-1">
              Đặt mục tiêu, theo dõi tiến độ (%), và quản lý giao dịch với báo cáo lợi nhuận chi tiết.
            </p>
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
              alt="Goal Tracking"
              className="mt-4 rounded-lg shadow-md"
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
            <FiEdit2 className="text-purple-600 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-purple-700 mb-3">Ghi chú thông minh</h3>
            <p className="text-gray-600 text-sm flex-1">
              Lưu ý nhanh với thông tin người tạo và thời gian, hỗ trợ quản lý công việc hiệu quả.
            </p>
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
              alt="Note Taking"
              className="mt-4 rounded-lg shadow-md"
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
            <FiCalendar className="text-teal-600 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-teal-700 mb-3">Lịch trình sự kiện</h3>
            <p className="text-gray-600 text-sm flex-1">
              Theo dõi sự kiện với trạng thái (chưa, đang, đã) diễn ra, tổ chức thời gian tối ưu.
            </p>
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
              alt="Event Scheduling"
              className="mt-4 rounded-lg shadow-md"
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
            <FiDollarSign className="text-red-600 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-3">Quản lý giao dịch</h3>
            <p className="text-gray-600 text-sm flex-1">
              Ghi nhận thu chi, tính toán lợi nhuận, và quản lý tài chính cá nhân/nhóm.
            </p>
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
              alt="Transaction Management"
              className="mt-4 rounded-lg shadow-md"
            />
          </div>
        </div>

        <Link
          to="/register"
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-lg font-semibold px-10 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        >
          Khám phá DuoTask ngay hôm nay!
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @media (min-width: 640px) {
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          .sm\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Home;