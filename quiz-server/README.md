# Quiz Server

Server API để nhận và lưu trữ kết quả bài làm từ các file HTML quiz.

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Server sẽ chạy trên `http://localhost:3999`

## API Endpoints

### POST /api/log-submission

Nhận dữ liệu bài làm từ học sinh và lưu vào file log.

**Request Body:**
```json
{
  "studentName": "Tên học sinh",
  "score": 8.5,
  "answers": {
    "q1": "A",
    "q2": "B",
    "q11": "plays",
    "q12": "are visiting"
  },
  "submittedAt": "15/1/2024, 14:30:25"
}
```

**Response:**
```json
{
  "message": "Submission logged successfully",
  "logFile": "quiz-submissions-2024-01-15.log"
}
```

## Log Files

- Log files được lưu trong thư mục `logs/`
- Mỗi ngày sẽ có một file log riêng: `quiz-submissions-YYYY-MM-DD.log`
- Mỗi dòng trong file log là một JSON object chứa thông tin bài làm

## Xem Log Files

```bash
# Xem danh sách tất cả log files
node view-logs.js

# Xem chi tiết log của ngày cụ thể
node view-logs.js 2024-01-15
```

## CORS

Server đã được cấu hình CORS để cho phép requests từ các domain khác (như ngrok URLs).

## Cấu trúc File HTML

File HTML quiz cần gọi API như sau:

```javascript
const response = await fetch('http://localhost:3999/api/log-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission)
});
```

## Deployment

Khi deploy production, nhớ thay đổi URL trong file HTML từ `localhost:3999` thành domain thực tế của server.