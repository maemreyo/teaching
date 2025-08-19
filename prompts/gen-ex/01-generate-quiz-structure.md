# Prompt để tạo cấu trúc bài kiểm tra JSON

## Bối cảnh

Bạn là một AI chuyên gia trong việc tạo nội dung giáo dục, có nhiệm vụ tạo ra một đối tượng JSON hoàn chỉnh cho một bài kiểm tra trực tuyến. Đối tượng JSON này sẽ được sử dụng trực tiếp trong một ứng dụng web để hiển thị các câu hỏi, ví dụ, và lý do giải thích cho học sinh lớp 6 học tiếng Anh.

## Mục tiêu

Tạo ra một đối tượng JSON duy nhất, hợp lệ, tuân thủ nghiêm ngặt cấu trúc được chỉ định dưới đây. Đối tượng này sẽ đại diện cho một phần (Part) của bài kiểm tra, tập trung vào một chủ đề ngữ pháp và một danh sách từ vựng cụ thể.

## Dữ liệu đầu vào

Bạn sẽ nhận được 3 thông tin đầu vào:

1.  **Chủ đề ngữ pháp (Grammar Topic):** Ví dụ: "Thì Hiện tại Đơn & Hiện tại Tiếp diễn", "Câu so sánh hơn", "Giới từ chỉ thời gian".
2.  **Danh sách từ vựng (Vocabulary List):** Một danh sách các từ và cụm từ tiếng Anh cần được ưu tiên sử dụng trong các câu hỏi và ví dụ.
3.  **Số lượng câu hỏi (Number of Questions):** Số lượng câu hỏi học sinh cần trả lời (thường là 8-10 câu).

## Cấu trúc JSON đầu ra (BẮT BUỘC TUÂN THỦ)

Đầu ra của bạn PHẢI là một đối tượng JSON duy nhất nằm trong một khối mã ```json. KHÔNG có bất kỳ văn bản nào khác bên ngoài khối mã này. Cấu trúc phải như sau:

```json
{
  "instruction": "(String) Lời hướng dẫn rõ ràng cho học sinh, ví dụ: \"Chọn dạng đúng của động từ và từ vựng cho sẵn.\"",
  "example": {
    "q": "(String) Một chuỗi HTML chứa câu hỏi ví dụ. Các đáp án ĐÚNG phải được điền sẵn và các thẻ input/select phải bị vô hiệu hóa (disabled) hoặc được thay thế bằng thẻ <span>.",
    "reason": "(String) Lời giải thích ngắn gọn, rõ ràng bằng tiếng Việt cho câu trả lời của ví dụ."
  },
  "questions": [
    {
      "q": "(String) Một chuỗi HTML chứa câu hỏi. Các yếu tố cần học sinh trả lời (input, select) PHẢI chứa class \'student-answer\' và thuộc tính \'data-answer\' với câu trả lời đúng.",
      "reason": "(String) Lời giải thích bằng tiếng Việt cho đáp án đúng của câu hỏi này. Lời giải thích này sẽ được hiển thị trong chế độ giáo viên."
    }
  ]
}
```

## Các quy tắc nghiêm ngặt

1.  **Sử dụng từ vựng:** TOÀN BỘ các câu hỏi và ví dụ phải được xây dựng dựa trên **Danh sách từ vựng** được cung cấp.
2.  **HTML trong câu hỏi (`q`):**
    *   Đối với câu hỏi trắc nghiệm, sử dụng thẻ `<select>`.
    *   Đối với câu hỏi điền từ, sử dụng thẻ `<input type="text">`.
    *   Mỗi thẻ `<select>` hoặc `<input>` mà học sinh cần trả lời **BẮT BUỘC** phải có `class="student-answer"` và `data-answer="câu_trả_lời_đúng"`.
3.  **Lý do (`reason`):** Lời giải thích phải ngắn gọn, tập trung vào quy tắc ngữ pháp và lựa chọn từ vựng. Luôn viết bằng tiếng Việt.
4.  **Tính nhất quán:** Đảm bảo `data-answer` trong câu hỏi khớp với logic trong `reason`.
5.  **Định dạng đầu ra:** Chỉ trả về một khối mã JSON. Không có lời chào, không có giải thích thêm.

---

## Ví dụ hoàn chỉnh

**Dữ liệu đầu vào mẫu:**

*   **Grammar Topic:** Thì Hiện tại Đơn & Hiện tại Tiếp diễn
*   **Vocabulary List:** `classmate`, `share`, `knock`, `excited`, `international`, `poem`, `help`, `living room`, `creative`, `art`, `remember`, `compass`, `equipment`, `smart`
*   **Number of Questions:** 8

**Đầu ra JSON mẫu:**

```json
{
  "instruction": "Chọn dạng đúng của động từ và từ vựng cho sẵn.",
  "example": {
    "q": "My new <span class=\"student-answer-container\">classmate</span> often <span class=\"student-answer-container\">shares</span> his lunch with me.",
    "reason": "Dùng thì hiện tại đơn (shares) vì có \"often\" chỉ thói quen. \"classmate\" là danh từ phù hợp."
  },
  "questions": [
    {
      "q": "Listen! Someone <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"is knocking\"><option></option><option value=\"knocks\">knocks</option><option value=\"is knocking\">is knocking</option></select> on the door.",
      "reason": "Dùng HTTD (is knocking) vì có dấu hiệu \"Listen!\" chỉ hành động đang diễn ra."
    },
    {
      "q": "I <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"am feeling\"><option></option><option value=\"feel\">feel</option><option value=\"am feeling\">am feeling</option></select> very <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"excited\"><option></option><option value=\"excited\">excited</option><option value=\"creative\">creative</option></select> about the first day at my <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"international\"><option></option><option value=\"international\">international</option><option value=\"boarding school\">boarding school</option></select> school.",
      "reason": "Dùng HTTD để diễn tả cảm xúc tạm thời. \'excited\' (phấn khích) và \'international\' (quốc tế) là từ vựng phù hợp."
    },
    {
      "q": "We <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"are learning\"><option></option><option value=\"learn\">learn</option><option value=\"are learning\">are learning</option></select> how to write a <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"poem\"><option></option><option value=\"poem\">poem</option><option value=\"judo\">judo</option></select> in Literature class right now.",
      "reason": "Dùng HTTD (are learning) vì có \'right now\'. \'Poem\' (bài thơ) là từ phù hợp với môn Văn."
    },
    {
      "q": "My brother <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"is helping\"><option></option><option value=\"helps\">helps</option><option value=\"is helping\">is helping</option></select> me with my homework in the <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"living room\"><option></option><option value=\"living room\">living room</option><option value=\"greenhouse\">greenhouse</option></select>.",
      "reason": "HTTD (is helping) diễn tả hành động đang xảy ra. \'Living room\' (phòng khách) là nơi hợp lý."
    },
    {
      "q": "She is very <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"creative\"><option></option><option value=\"creative\">creative</option><option value=\"smart\">smart</option></select>; she always <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"has\"><option></option><option value=\"has\">has</option><option value=\"is having\">is having</option></select> new ideas for the <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"art\"><option></option><option value=\"art\">art</option><option value=\"activity\">activity</option></select> club.",
      "reason": "Dùng HTĐ (has) vì có \'always\'. \'Creative\' (sáng tạo) và \'art\' (nghệ thuật) là các từ liên quan."
    },
    {
      "q": "They usually <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"remember\"><option></option><option value=\"remember\">remember</option><option value=\"are remembering\">are remembering</option></select> to bring their <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"compass\"><option></option><option value=\"compass\">compass</option><option value=\"pocket money\">pocket money</option></select> for the Geography lesson.",
      "reason": "Dùng HTĐ (remember) vì có \'usually\'. \'Compass\' (compa) cần cho môn Địa lý."
    },
    {
      "q": "What <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"are you doing\"><option></option><option value=\"do you do\">do you do</option><option value=\"are you doing\">are you doing</option></select>? I\'m looking for my <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"equipment\"><option></option><option value=\"equipment\">equipment</option><option value=\"interview\">interview</option></select>.",
      "reason": "Câu trả lời ở HTTD (I\'m looking for) nên câu hỏi cũng ở HTTD. \'Equipment\' (thiết bị) là từ phù hợp."
    },
    {
      "q": "He looks <select class=\"p-1 rounded border-gray-300 student-answer\" data-answer=\"smart\"><option></option><option value=\"smart\">smart</option><option value=\"messy\">messy</option></select> in his new school uniform.",
      "reason": "\'Look\' là động từ chỉ tri giác, đi với tính từ. \'Smart\' (bảnh bao) phù hợp với đồng phục mới."
    }
  ]
}
```