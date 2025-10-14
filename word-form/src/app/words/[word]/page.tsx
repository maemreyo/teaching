import { getWordByRoot, getAllWordForms } from '@/lib/words';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const words = getAllWordForms();
  return words.map((word) => ({
    word: word.root,
  }));
}

export default function WordPage({ params }: { params: { word: string } }) {
  const word = getWordByRoot(params.word);

  if (!word) {
    notFound();
  }

  return (
    <div className="font-sans p-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to all words
        </Link>
        <h1 className="text-4xl font-bold mt-4">{word.root}</h1>
        <p className="text-lg text-gray-600 mt-2">{word.notes.en}</p>
        <p className="text-lg text-gray-500">{word.notes.vi}</p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Word Forms</h2>
            <ul>
              {Object.entries(word.forms).map(([type, forms]: [string, any[]]) => (
                <li key={type} className="mb-4">
                  <h3 className="text-xl font-medium capitalize">{type}</h3>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    {forms.map((form) => (
                      <li key={form.word} className="mb-2">
                        <p className="font-semibold">{form.word}</p>
                        <p className="text-gray-600">{form.meaning.en}</p>
                        <p className="text-gray-500">{form.meaning.vi}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
