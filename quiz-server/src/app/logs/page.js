'use client';

import { useState, useEffect } from 'react';

export default function LogsPage() {
  const [files, setFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch danh sách log files
  useEffect(() => {
    fetchLogFiles();
  }, []);

  const fetchLogFiles = async () => {
    try {
      const response = await fetch('/api/view-logs');
      const data = await response.json();
      setFiles(data.files || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching log files:', error);
      setLoading(false);
    }
  };

  // Fetch submissions của ngày được chọn
  const fetchSubmissions = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/view-logs?date=${date}`);
      const data = await response.json();
      setSubmissions(data.submissions || []);
      setSelectedDate(date);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'text-green-600 font-bold';
    if (numScore >= 6.5) return 'text-yellow-600 font-bold';
    if (numScore >= 5) return 'text-orange-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const getAnsweredCount = (answers) => {
    return Object.values(answers).filter(answer => answer !== 'Chưa trả lời').length;
  };

  if (loading && files.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📊 Quản lý Kết quả Bài làm
        </h1>

        {!selectedDate ? (
          // Hiển thị danh sách log files
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📁 Danh sách Log Files ({files.length} files)
            </h2>
            
            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có file log nào.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {files.map((file) => (
                  <div
                    key={file.date}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
                    onClick={() => fetchSubmissions(file.date)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        📅 {file.date}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                        {file.submissionCount} bài
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Nhấn để xem chi tiết
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Hiển thị submissions của ngày được chọn
          <div>
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedDate('');
                  setSubmissions([]);
                  setSelectedSubmission(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Quay lại
              </button>
              <h2 className="text-xl font-semibold text-gray-700">
                📅 Ngày {selectedDate} ({submissions.length} bài làm)
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Không có bài làm nào trong ngày này.</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Danh sách submissions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    👥 Danh sách học sinh
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {submissions.map((submission, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedSubmission === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSubmission(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">
                              👨‍🎓 {submission.studentName}
                            </p>
                            <p className="text-sm text-gray-600">
                              🕐 {submission.submittedAt}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg ${getScoreColor(submission.score)}`}>
                              {submission.score}/10.0
                            </p>
                            <p className="text-xs text-gray-500">
                              {getAnsweredCount(submission.answers)}/{Object.keys(submission.answers).length} câu
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chi tiết submission được chọn */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  {selectedSubmission !== null ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-700">
                        📝 Chi tiết bài làm
                      </h3>
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-800 mb-2">
                          👨‍🎓 {submissions[selectedSubmission].studentName}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          🕐 {submissions[selectedSubmission].submittedAt}
                        </p>
                        <p className={`text-lg ${getScoreColor(submissions[selectedSubmission].score)}`}>
                          💯 Điểm: {submissions[selectedSubmission].score}/10.0
                        </p>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        <h4 className="font-semibold mb-2 text-gray-700">Câu trả lời:</h4>
                        <div className="grid gap-2">
                          {Object.entries(submissions[selectedSubmission].answers).map(([question, answer]) => (
                            <div key={question} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                              <span className="font-medium text-gray-700">{question}:</span>
                              <span className={`${
                                answer === 'Chưa trả lời' 
                                  ? 'text-red-500 italic' 
                                  : 'text-green-600 font-medium'
                              }`}>
                                {answer}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>👆 Chọn một bài làm để xem chi tiết</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}