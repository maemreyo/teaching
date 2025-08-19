import { promises as fs } from 'fs';
import path from 'path';

// Hàm để lấy và phân tích dữ liệu từ các file log
async function getSubmissions() {
  const logsDir = path.join(process.cwd(), 'logs');
  try {
    const filenames = await fs.readdir(logsDir);
    const logFiles = filenames.filter(fn => fn.endsWith('.log'));
    
    let allSubmissions = [];

    for (const filename of logFiles) {
      const filePath = path.join(logsDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      const lines = data.trim().split('\n');
      
      const submissions = lines.map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.error(`Lỗi phân tích JSON trên dòng: ${line}`, e);
          return null; // Bỏ qua dòng bị lỗi
        }
      }).filter(Boolean); // Lọc ra các giá trị null

      allSubmissions = allSubmissions.concat(submissions);
    }

    // Sắp xếp tất cả bài làm theo thời gian, mới nhất lên đầu
    allSubmissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return allSubmissions;
  } catch (error) {
    console.error("Không thể đọc thư mục logs:", error);
    // Nếu thư mục logs không tồn tại, trả về mảng rỗng
    return [];
  }
}

// Component React để hiển thị dữ liệu
export default async function LogsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800">Lịch sử bài làm của học sinh</h1>
          <p className="text-xl text-gray-600 mt-2">Tổng số bài đã nộp: {submissions.length}</p>
        </header>

        {submissions.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-2xl text-gray-500">Chưa có bài làm nào được nộp.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {submissions.map((submission, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Học sinh</p>
                    <p className="font-bold text-lg text-blue-600">{submission.studentName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lớp</p>
                    <p className="font-bold text-lg">{submission.studentClass || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Thời gian nộp</p>
                    <p className="font-bold text-lg">{new Date(submission.submittedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Điểm trắc nghiệm</p>
                    <p className="font-bold text-2xl text-green-600">{submission.score || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Chi tiết câu trả lời:</h3>
                  <div className="space-y-4">
                    {submission.answers && submission.answers.map((item, qIndex) => (
                      <div key={qIndex} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="font-medium text-gray-800">{item.questionText}</p>
                        <div className="mt-2 pl-4 border-l-4 border-gray-300">
                            {item.answers.map((ans, aIndex) => (
                                <div key={aIndex} className={`mt-1 ${ans.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                    <p><strong>Câu trả lời: </strong> 
                                        <span className="font-mono p-1 bg-gray-200 rounded text-sm">{ans.answer || '[Bỏ trống]'}</span>
                                        {!ans.isCorrect && 
                                            <span className="font-mono p-1 bg-green-100 rounded text-sm ml-2">Đáp án đúng: {ans.correctAnswer}</span>
                                        }
                                    </p>
                                </div>
                            ))}
                            <p className="text-sm text-gray-600 mt-1 italic"><strong>Lý do của học sinh:</strong> {item.reason || '[Không có lý do]'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Bắt buộc revalidate mỗi khi có request để đảm bảo dữ liệu luôn mới
export const revalidate = 0;
