import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'by-parts');

export function getWordByRoot(root: string) {
  const allWords = getAllWordForms();
  return allWords.find((word) => word.root === root);
}

export function getAllWordForms() {
  const fileNames = fs.readdirSync(dataDirectory);
  let allWords = [];

  for (const fileName of fileNames) {
    if (path.extname(fileName) === '.json') {
      const fullPath = path.join(dataDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const data = JSON.parse(fileContents);
      allWords.push(...data);
    }
  }

  return allWords;
}
