import { getAllWordForms } from '@/lib/words';
import TrainingGrid from './TrainingGrid';
import Link from 'next/link';

export default function TrainPage() {
  const allWords = getAllWordForms();

  return (
    <div className="font-sans p-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to all words
        </Link>
        <h1 className="text-4xl font-bold mt-4">Training Grid</h1>
        <p className="text-lg text-gray-600">Fill in the blanks to practice word forms.</p>
      </header>
      <main>
        <TrainingGrid allWords={allWords} />
      </main>
    </div>
  );
}