import { promises as fs } from 'fs';
import path from 'path';
import { EnhancedReadingView } from '@/components/enhanced-reading-view';
import React from 'react';

async function getPassageData() {
  const passagePath = path.join(process.cwd(), 'data', '17', 'reading', 'test-1', 'passage-1.md');
  const lexicalDataPath = path.join(process.cwd(), 'data', '17', 'reading', 'test-1', '1__.json');

  const passageText = await fs.readFile(passagePath, 'utf8');
  const lexicalData = JSON.parse(await fs.readFile(lexicalDataPath, 'utf8'));

  return { passageText, lexicalData };
}

export default async function ReadingPage() {
  const { passageText, lexicalData } = await getPassageData();

  return (
    <EnhancedReadingView passageText={passageText} lexicalData={lexicalData} />
  );
}
