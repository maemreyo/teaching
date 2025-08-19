import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// CORS headers để cho phép cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Xử lý preflight OPTIONS request
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Hàm này xử lý các yêu cầu POST đến /api/log-submission
export async function POST(request) {
  try {
    // Đọc và phân tích dữ liệu JSON từ body của yêu cầu
    const submissionData = await request.json();

    // Tạo thư mục logs nếu chưa tồn tại
    const logsDir = path.join(process.cwd(), 'logs');
    if (!existsSync(logsDir)) {
      await mkdir(logsDir, { recursive: true });
    }

    // Tạo tên file log theo ngày
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logFileName = `quiz-submissions-${today}.log`;
    const logFilePath = path.join(logsDir, logFileName);

    // Tạo nội dung log
    const logEntry = {
      timestamp: new Date().toISOString(),
      studentName: submissionData.studentName,
      studentClass: submissionData.studentClass, // Thêm lớp của học sinh
      submittedAt: submissionData.submittedAt,
      score: submissionData.score,
      answers: submissionData.answers
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    // Ghi vào file log
    await writeFile(logFilePath, logLine, { flag: 'a' }); // 'a' để append

    // In dữ liệu ra console của server một cách rõ ràng (vẫn giữ để debug)
    console.log('\n=============================================');
    console.log('✅ BÀI LÀM MỚI VỪA ĐƯỢC NỘP');
    console.log('=============================================');
    console.log(`👨‍🎓 Học sinh: ${submissionData.studentName}`);
    console.log(`🗓️ Thời gian nộp: ${submissionData.submittedAt}`);
    console.log(`💯 Điểm trắc nghiệm: ${submissionData.score}`);
    console.log(`📁 Đã lưu vào file: ${logFilePath}`);
    console.log('---------- CHI TIẾT CÂU TRẢ LỜI ----------');
    // In chi tiết các câu trả lời để dễ theo dõi
    console.log(JSON.stringify(submissionData.answers, null, 2));
    console.log('=============================================\n');

    // Trả về một phản hồi thành công cho trình duyệt của học sinh
    return NextResponse.json(
      { message: 'Submission logged successfully', logFile: logFileName }, 
      { 
        status: 200,
        headers: corsHeaders
      }
    );

  } catch (error) {
    // Nếu có lỗi xảy ra (ví dụ: dữ liệu không phải JSON)
    console.error('❌ Lỗi khi xử lý bài làm:', error);

    // Trả về một phản hồi lỗi
    return NextResponse.json(
      { message: 'Error logging submission', error: error.message }, 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
