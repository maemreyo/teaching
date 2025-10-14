import { getAllWordForms } from '@/lib/words';
import Link from 'next/link';

interface WordForm {
  root: string;
  forms: any;
  notes: any;
}

export default function Home() {
  const allWords: WordForm[] = getAllWordForms();

  return (
    <div className="font-sans p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Word Forms</h1>
        <p className="text-lg text-gray-600">Your personal dictionary to master word formations.</p>
      </header>
      <main>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allWords.map((word) => (
            <li key={word.root}>
              <Link href={`/words/${word.root}`} className="block p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <h2 className="text-xl font-semibold">{word.root}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}