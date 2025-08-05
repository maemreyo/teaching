#!/usr/bin/env node

// Script để xem log files một cách dễ dàng
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, 'logs');

function viewLogs(date) {
  const logFileName = date ? `quiz-submissions-${date}.log` : null;
  
  if (!fs.existsSync(logsDir)) {
    console.log('❌ Thư mục logs không tồn tại.');
    return;
  }

  const logFiles = fs.readdirSync(logsDir).filter(file => file.endsWith('.log'));
  
  if (logFiles.length === 0) {
    console.log('❌ Không có file log nào.');
    return;
  }

  if (logFileName && fs.existsSync(path.join(logsDir, logFileName))) {
    // Xem log của ngày cụ thể
    console.log(`\n📋 LOG FILE: ${logFileName}`);
    console.log('='.repeat(50));
    const content = fs.readFileSync(path.join(logsDir, logFileName), 'utf8');
    const lines = content.trim().split('\n');
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        const entry = JSON.parse(line);
        console.log(`\n${index + 1}. 👨‍🎓 ${entry.studentName}`);
        console.log(`   🗓️  ${entry.submittedAt}`);
        console.log(`   💯 Điểm: ${entry.score}/10.0`);
        console.log(`   📝 Số câu trả lời: ${Object.keys(entry.answers).length}`);
      }
    });
  } else {
    // Liệt kê tất cả log files
    console.log('\n📁 CÁC FILE LOG CÓ SẴN:');
    console.log('='.repeat(30));
    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const lineCount = content.trim().split('\n').filter(line => line.trim()).length;
      
      console.log(`📄 ${file}`);
      console.log(`   📊 ${lineCount} bài làm`);
      console.log(`   📅 ${stats.mtime.toLocaleString('vi-VN')}`);
      console.log('');
    });
    
    console.log('💡 Để xem chi tiết log của ngày cụ thể:');
    console.log('   node view-logs.js YYYY-MM-DD');
    console.log('   Ví dụ: node view-logs.js 2024-01-15');
  }
}

// Lấy tham số ngày từ command line
const date = process.argv[2];
viewLogs(date);