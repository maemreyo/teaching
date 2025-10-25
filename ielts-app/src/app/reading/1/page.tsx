import { promises as fs } from 'fs';
import path from 'path';
import { LexicalItem } from '@/components/lexical-item';
import { ReadingView } from '@/components/reading-view';
import React from 'react';

async function getPassageData() {
  const passagePath = path.join(process.cwd(), 'data', '17', 'reading', 'test-1', 'passage-1.md');
  const lexicalDataPath = path.join(process.cwd(), 'data', '17', 'reading', 'test-1', '1__.json');

  const passageText = await fs.readFile(passagePath, 'utf8');
  const lexicalData = JSON.parse(await fs.readFile(lexicalDataPath, 'utf8'));

  return { passageText, lexicalData };
}

function processParagraph(paragraph: string, lexicalItems: any[]) {
  // Sort items by length of targetLexeme to handle nested cases correctly
  lexicalItems.sort((a, b) => b.targetLexeme.length - a.targetLexeme.length);

  let finalNodes: React.ReactNode[] = [paragraph];

  lexicalItems.forEach(item => {
    const newNodes: React.ReactNode[] = [];
    let lexeme = item.targetLexeme;

    // Clean up lexeme and create regex
    let regex: RegExp;
    if (lexeme.includes(' ... ')) {
      const parts = lexeme.split(' ... ').map((part: string) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      regex = new RegExp(`${parts[0]}(.*?)${parts[1]}`, 'gi');
    } else {
      lexeme = lexeme.replace(/\s*\((adj|n|v|adv|prep|conj|pl)\.?\)/gi, '').trim();
      lexeme = lexeme.replace(/[()]/g, '');
      const escapedLexeme = lexeme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escapedLexeme, 'gi');
    }

    finalNodes.forEach(node => {
      if (typeof node !== 'string') {
        newNodes.push(node);
        return;
      }

      const matches = Array.from(node.matchAll(regex));
      if (matches.length === 0) {
        newNodes.push(node);
        return;
      }

      let lastIndex = 0;
      matches.forEach((match, matchIndex) => {
        const startIndex = match.index!;
        const matchedText = match[0];

        // Push text before the match
        if (startIndex > lastIndex) {
          newNodes.push(node.substring(lastIndex, startIndex));
        }

        // Push the highlighted item
        newNodes.push(
          <LexicalItem key={`${item.id}-${matchIndex}`} item={item}>
            {matchedText}
          </LexicalItem>
        );

        lastIndex = startIndex + matchedText.length;
      });

      // Push text after the last match
      if (lastIndex < node.length) {
        newNodes.push(node.substring(lastIndex));
      }
    });

    finalNodes = newNodes;
  });

  return finalNodes.map((node, index) => <React.Fragment key={index}>{node}</React.Fragment>);
}


export default async function ReadingPage() {
  const { passageText, lexicalData } = await getPassageData();
  const lines = passageText.split('\n');
  const title = lines[0].replace(/## /g, '');
  const paragraphs = lines.slice(1).join('\n').split('\n\n');

  return (
    <div className="container mx-auto p-4">
      <ReadingView title={title}>
        {paragraphs.map((p, index) => (
          <p key={index} className="text-2xl">
            {processParagraph(p, lexicalData.lexicalItems)}
          </p>
        ))}
      </ReadingView>
    </div>
  );
}
