'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { MemoizedTrainingCell } from './MemoizedTrainingCell';

interface WordForm {
  root: string;
  forms: {
    [key: string]: { word: string; meaning: { vi: string; en: string } }[];
  };
  notes: any;
}

interface TrainingItem {
  root: string;
  forms: {
    [key: string]: {
      word: string;
      meaning: { vi: string; en: string };
      hidden: boolean;
      isCorrect: boolean | null;
    }[];
  };
}

const FORM_TYPES = ['noun', 'verb', 'adjective', 'adverb'];

export default function TrainingGrid({ allWords }: { allWords: WordForm[] }) {
  const [trainingData, setTrainingData] = useState<TrainingItem[]>([]);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [hints, setHints] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newTrainingData = allWords.map((word) => {
      const trainingItem: TrainingItem = {
        root: word.root,
        forms: {},
      };

      FORM_TYPES.forEach((type) => {
        const formsOfType = word.forms[type] || [];
        trainingItem.forms[type] = formsOfType.map((form) => ({
          ...form,
          hidden: Math.random() > 0.5,
          isCorrect: null,
        }));
      });

      return trainingItem;
    });
    setTrainingData(newTrainingData);
  }, [allWords]);

  const handleInputChange = useCallback((key: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCheckRow = (root: string) => {
    setTrainingData((prevData) =>
      prevData.map((item) => {
        if (item.root === root) {
          const newForms = { ...item.forms };
          FORM_TYPES.forEach((type) => {
            newForms[type] = newForms[type].map((form) => {
              if (form.hidden) {
                const inputKey = `${root}-${type}-${form.word}`;
                const userInput = userInputs[inputKey] || '';
                const isCorrect = userInput.trim().toLowerCase() === form.word.toLowerCase();
                return { ...form, isCorrect };
              }
              return form;
            });
          });
          return { ...item, forms: newForms };
        }
        return item;
      })
    );
  };

  const handleHint = (root: string) => {
    setHints((prev) => ({ ...prev, [root]: true }));
  };

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Root</TableHead>
            {FORM_TYPES.map((type) => (
              <TableHead key={type} className="capitalize">{type}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainingData.map((item) => (
            <TableRow key={item.root}>
              <TableCell className="font-semibold">{item.root}</TableCell>
              {FORM_TYPES.map((type) => (
                <TableCell key={type}>
                  {item.forms[type]?.map((form) => {
                    const inputKey = `${item.root}-${type}-${form.word}`;
                    return (
                      <MemoizedTrainingCell
                        key={form.word}
                        form={form}
                        userInput={userInputs[inputKey] || ''}
                        hint={hints[item.root] || false}
                        onInputChange={handleInputChange}
                        inputKey={inputKey}
                      />
                    );
                  })}
                </TableCell>
              ))}
              <TableCell className="space-x-2">
                <Button onClick={() => handleCheckRow(item.root)}>Check</Button>
                <Button variant="outline" onClick={() => handleHint(item.root)}>Hint</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}