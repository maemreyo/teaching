'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';

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
      userInput: string;
      isCorrect: boolean | null;
    }[];
  };
}

const FORM_TYPES = ['noun', 'verb', 'adjective', 'adverb'];

export default function TrainingGrid({ allWords }: { allWords: WordForm[] }) {
  const [trainingData, setTrainingData] = useState<TrainingItem[]>([]);

  useEffect(() => {
    const newTrainingData = allWords.map((word) => {
      const trainingItem: TrainingItem = {
        root: word.root,
        forms: {},
      };

      FORM_TYPES.forEach((type) => {
        const formsOfType = word.forms[type] || [];
        trainingItem.forms[type] = formsOfType.map((form) => {
          // Randomly hide some forms
          const hidden = Math.random() > 0.5;
          return {
            ...form,
            hidden,
            userInput: '',
            isCorrect: null,
          };
        });
      });

      return trainingItem;
    });
    setTrainingData(newTrainingData);
  }, [allWords]);

  const handleInputChange = (root: string, type: string, word: string, value: string) => {
    setTrainingData((prevData) =>
      prevData.map((item) => {
        if (item.root === root) {
          const newForms = { ...item.forms };
          newForms[type] = newForms[type].map((form) => {
            if (form.word === word) {
              return { ...form, userInput: value };
            }
            return form;
          });
          return { ...item, forms: newForms };
        }
        return item;
      })
    );
  };

  const handleCheckRow = (root: string) => {
    setTrainingData((prevData) =>
      prevData.map((item) => {
        if (item.root === root) {
          const newForms = { ...item.forms };
          FORM_TYPES.forEach((type) => {
            newForms[type] = newForms[type].map((form) => {
              if (form.hidden) {
                const isCorrect = form.userInput.trim().toLowerCase() === form.word.toLowerCase();
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
                  {item.forms[type]?.map((form) => (
                    <div key={form.word} className="mb-2">
                      <Tooltip>
                        <TooltipTrigger>
                          {form.hidden ? (
                            <Input
                              value={form.userInput}
                              onChange={(e) =>
                                handleInputChange(item.root, type, form.word, e.target.value)
                              }
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
                  ))}
                </TableCell>
              ))}
              <TableCell>
                <Button onClick={() => handleCheckRow(item.root)}>Check</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
