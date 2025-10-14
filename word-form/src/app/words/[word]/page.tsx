import { getWordByRoot, getAllWordForms } from "@/lib/words";
import { notFound } from "next/navigation";
import Link from "next/link";
import WordTable from "./WordTable";

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

  const forms = Object.entries(word.forms).flatMap(([type, formArray]) =>
    formArray.map((form: any) => ({ type, ...form }))
  );

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
        <WordTable forms={forms} />
      </main>
    </div>
  );
}
