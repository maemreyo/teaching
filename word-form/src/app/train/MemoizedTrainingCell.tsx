'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Form {
  word: string;
  meaning: { vi: string; en: string };
  hidden: boolean;
  isCorrect: boolean | null;
}

interface Props {
  form: Form;
  userInput: string;
  hint: boolean;
  inputKey: string;
  onInputChange: (key: string, value: string) => void;
}

const TrainingCell = ({ form, userInput, hint, inputKey, onInputChange }: Props) => {
  return (
    <div className="mb-2">
      <Tooltip>
        <TooltipTrigger>
          {form.hidden ? (
            <Input
              value={userInput}
              onChange={(e) => onInputChange(inputKey, e.target.value)}
              placeholder={hint ? '_ '.repeat(form.word.length) : ''}
              className={
                form.isCorrect === true
                  ? 'border-green-500'
                  : form.isCorrect === false
                  ? 'border-red-500'
                  : ''
              }
            />
          ) : (
            <span>{form.word}</span>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{form.meaning.en}</p>
          <p>{form.meaning.vi}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const MemoizedTrainingCell = React.memo(TrainingCell);
