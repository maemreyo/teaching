import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LexicalItemProps {
  item: {
    targetLexeme: string;
    phase2Annotation: {
      definitionEN: string;
      translationVI: string;
      relatedCollocates?: string[];
      wordForms?: any;
    };
  };
  children: React.ReactNode;
}

export function LexicalItem({ item, children }: LexicalItemProps) {
  const {
    targetLexeme,
    phase2Annotation: {
      definitionEN,
      translationVI,
      relatedCollocates,
      wordForms,
    },
  } = item;

  const formattedTranslation = translationVI.charAt(0).toLowerCase() + translationVI.slice(1);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="underline decoration-dotted cursor-pointer bg-yellow-200/50">
          <strong>{children}</strong> ({formattedTranslation})
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96 shadow-lg rounded-lg">
        <div className="p-4 bg-blue-500 text-white rounded-t-lg">
          <h4 className="font-bold text-xl">{targetLexeme}</h4>
          <p className="text-lg">({formattedTranslation})</p>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-base text-gray-700">{definitionEN}</p>
          <hr />
          {relatedCollocates && relatedCollocates.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-800">Collocates:</h5>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                {relatedCollocates.map((collocate, index) => (
                  <li key={index}>{collocate}</li>
                ))}
              </ul>
            </div>
          )}

          {wordForms && (
            <div>
              <h5 className="font-semibold text-gray-800">Word Forms:</h5>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                {Object.entries(wordForms).map(
                  ([type, forms]) =>
                    forms &&
                    (forms as any[]).length > 0 && (
                      <div key={type}>
                        <strong className="text-gray-700">{type}:</strong>
                        {' '}
                        {(forms as any[])
                          .map((form) => `${form.form} (${form.meaning})`)
                          .join(', ')}
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
