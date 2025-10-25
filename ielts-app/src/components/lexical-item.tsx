import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookText, Spline, Wand2 } from 'lucide-react';

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
        <span className="underline decoration-dotted cursor-pointer bg-highlight text-highlight-foreground">
          <strong>{children}</strong> <em className="text-muted-foreground">({formattedTranslation})</em>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96 shadow-xl rounded-xl border-none bg-background p-0">
        <div className="p-5">
          <h4 className="font-bold text-2xl text-foreground">{targetLexeme}</h4>
          <p className="text-lg text-primary">({formattedTranslation})</p>
        </div>
        <div className="px-5 pb-5 space-y-5">
          <div className="flex items-start space-x-3">
            <BookText className="h-5 w-5 text-muted-foreground mt-1" />
            <p className="flex-1 text-base text-foreground">{definitionEN}</p>
          </div>

          {relatedCollocates && relatedCollocates.length > 0 && (
            <div className="flex items-start space-x-3">
              <Spline className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <h5 className="font-semibold text-foreground">Collocates:</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {relatedCollocates.map((collocate, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm">{collocate}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {wordForms && (
            <div className="flex items-start space-x-3">
               <Wand2 className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <h5 className="font-semibold text-foreground">Word Forms:</h5>
                <div className="text-sm text-muted-foreground mt-2 space-y-1">
                  {Object.entries(wordForms).map(
                    ([type, forms]) =>
                      forms &&
                      (forms as any[]).length > 0 && (
                        <div key={type}>
                          <strong className="text-foreground capitalize">{type}:</strong>
                          {' '}
                          {(forms as any[])
                            .map((form) => `${form.form} (${form.meaning})`)
                            .join(', ')}
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
