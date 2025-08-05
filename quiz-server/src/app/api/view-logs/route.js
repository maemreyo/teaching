import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    const logsDir = path.join(process.cwd(), 'logs');
    
    if (!existsSync(logsDir)) {
      return NextResponse.json(
        { error: 'Logs directory not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    if (date) {
      // Lấy log của ngày cụ thể
      const logFileName = `quiz-submissions-${date}.log`;
      const logFilePath = path.join(logsDir, logFileName);
      
      if (!existsSync(logFilePath)) {
        return NextResponse.json(
          { error: 'Log file not found for this date' },
          { status: 404, headers: corsHeaders }
        );
      }

      const content = await readFile(logFilePath, 'utf8');
      const submissions = content.trim().split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));

      return NextResponse.json(
        { date, submissions },
        { headers: corsHeaders }
      );
    } else {
      // Lấy danh sách tất cả log files
      const files = await readdir(logsDir);
      const logFiles = files.filter(file => file.endsWith('.log'));
      
      const fileStats = await Promise.all(
        logFiles.map(async (file) => {
          const filePath = path.join(logsDir, file);
          const content = await readFile(filePath, 'utf8');
          const submissionCount = content.trim().split('\n').filter(line => line.trim()).length;
          const date = file.replace('quiz-submissions-', '').replace('.log', '');
          
          return {
            fileName: file,
            date,
            submissionCount,
          };
        })
      );

      return NextResponse.json(
        { files: fileStats.sort((a, b) => b.date.localeCompare(a.date)) },
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { error: 'Error reading logs', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}