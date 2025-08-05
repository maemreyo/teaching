import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 Quiz Server
          </h1>
          <p className="text-gray-600 mb-8">
            Server API để nhận và quản lý kết quả bài làm
          </p>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold text-green-800 mb-1">
                API Endpoint
              </h3>
              <p className="text-sm text-green-700">
                POST /api/log-submission
              </p>
              <p className="text-xs text-green-600 mt-1">
                Sẵn sàng nhận dữ liệu bài làm
              </p>
            </div>

            <Link 
              href="/logs"
              className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              📊 Xem Kết quả Bài làm
            </Link>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                📋 Hướng dẫn sử dụng
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Server chạy trên port 3999</li>
                <li>• Log files lưu trong thư mục logs/</li>
                <li>• Hỗ trợ CORS cho cross-origin requests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}