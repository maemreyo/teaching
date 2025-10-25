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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="underline decoration-dotted cursor-pointer bg-yellow-200/50">
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-lg">{targetLexeme}</h4>
            <p className="text-base font-semibold text-blue-600">
              ({translationVI})
            </p>
          </div>
          <p className="text-base">{definitionEN}</p>

          {relatedCollocates && relatedCollocates.length > 0 && (
            <div>
              <h5 className="font-semibold">Collocates:</h5>
              <ul className="list-disc list-inside text-sm">
                {relatedCollocates.map((collocate, index) => (
                  <li key={index}>{collocate}</li>
                ))}
              </ul>
            </div>
          )}

          {wordForms && (
            <div>
              <h5 className="font-semibold">Word Forms:</h5>
              <div className="text-sm">
                {Object.entries(wordForms).map(
                  ([type, forms]) =>
                    forms &&
                    (forms as any[]).length > 0 && (
                      <div key={type}>
                        <strong>{type}:</strong>
                        {", "}
                        {(forms as any[])
                          .map((form) => `${form.form} (${form.meaning})`)
                          .join(", ")}
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
