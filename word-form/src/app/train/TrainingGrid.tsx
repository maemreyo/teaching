'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Lightbulb, History } from 'lucide-react';

// --- Interfaces ---
interface WordForm {
  root: string;
  forms: {
    [key: string]: { word: string; meaning: { vi: string; en: string } }[];
  };
  notes: any;
}

interface TrainingForm {
  word: string;
  meaning: { vi: string; en: string };
  hidden: boolean;
  isCorrect: boolean | null;
}

interface TrainingItem {
  root: string;
  forms: { [key: string]: TrainingForm[] };
  isRowChecked: boolean;
  isRowCorrect: boolean | null;
}

interface DailyProgress {
  attempted: number;
  correct: number;
}

// --- Constants ---
const FORM_TYPES = ['noun', 'verb', 'adjective', 'adverb'];
const getTodayString = () => new Date().toISOString().split('T')[0];

// --- Main Component ---
export default function TrainingGrid({ allWords }: { allWords: WordForm[] }) {
  // --- State ---
  const [view, setView] = useState('setup'); // 'setup' or 'training'
  const [sessionSize, setSessionSize] = useState('10');
  const [trainingData, setTrainingData] = useState<TrainingItem[]>([]);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [hints, setHints] = useState<{ [key: string]: boolean }>({});
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({ attempted: 0, correct: 0 });
  const [mistakes, setMistakes] = useState<string[]>([]);

  // --- Effects for Loading Data from localStorage ---
  useEffect(() => {
    const today = getTodayString();
    const savedProgress = JSON.parse(localStorage.getItem('dailyProgress') || '{}');
    if (savedProgress[today]) setDailyProgress(savedProgress[today]);

    const savedMistakes = JSON.parse(localStorage.getItem('mistakes') || '[]');
    setMistakes(savedMistakes);
  }, []);

  // --- Core Functions ---
  const generateNewTraining = useCallback((mode: 'new' | 'review', size: number) => {
    let wordsForSession: WordForm[] = [];

    if (mode === 'review') {
      wordsForSession = allWords.filter(word => mistakes.includes(word.root));
    } else {
      wordsForSession = [...allWords].sort(() => 0.5 - Math.random()).slice(0, size);
    }

    const newTrainingData = wordsForSession.map(word => ({
      root: word.root,
      isRowChecked: false,
      isRowCorrect: null,
      forms: FORM_TYPES.reduce((acc, type) => {
        acc[type] = (word.forms[type] || []).map((form) => ({
          ...form,
          hidden: Math.random() > 0.5,
          isCorrect: null,
        }));
        return acc;
      }, {} as { [key: string]: TrainingForm[] }),
    }));

    setTrainingData(newTrainingData);
    setUserInputs({});
    setHints({});
    setView('training');
  }, [allWords, mistakes]);

  const handleCheckRow = (root: string) => {
    let isRowCorrect = true;
    let wasAlreadyChecked = false;

    const updatedTrainingData = trainingData.map((item) => {
      if (item.root === root) {
        wasAlreadyChecked = item.isRowChecked;
        const newForms = { ...item.forms };
        let hasHiddenForms = false;

        FORM_TYPES.forEach((type) => {
          newForms[type] = newForms[type].map((form) => {
            if (form.hidden) {
              hasHiddenForms = true;
              const inputKey = `${root}-${type}-${form.word}`;
              const userInput = userInputs[inputKey] || '';
              const isCorrect = userInput.trim().toLowerCase() === form.word.toLowerCase();
              if (!isCorrect) isRowCorrect = false;
              return { ...form, isCorrect };
            }
            return form;
          });
        });

        if (!hasHiddenForms) isRowCorrect = true;

        return { ...item, forms: newForms, isRowChecked: true, isRowCorrect };
      }
      return item;
    });

    setTrainingData(updatedTrainingData);

    if (!wasAlreadyChecked) {
      const newProgress = {
        attempted: dailyProgress.attempted + 1,
        correct: dailyProgress.correct + (isRowCorrect ? 1 : 0),
      };
      setDailyProgress(newProgress);

      const today = getTodayString();
      const savedProgress = JSON.parse(localStorage.getItem('dailyProgress') || '{}');
      savedProgress[today] = newProgress;
      localStorage.setItem('dailyProgress', JSON.stringify(savedProgress));

      if (!isRowCorrect) {
        const newMistakes = [...mistakes, root];
        if (!mistakes.includes(root)) {
            setMistakes(newMistakes);
            localStorage.setItem('mistakes', JSON.stringify(newMistakes));
        }
      }
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleHint = (root: string) => {
    setHints((prev) => ({ ...prev, [root]: true }));
  };

  // --- Render Logic ---
  if (view === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Set Up Your Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-bold">New Session</Label>
              <p className="text-sm text-muted-foreground">How many words would you like to practice?</p>
              <RadioGroup defaultValue="10" onValueChange={setSessionSize} className="mt-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="5" id="r1" /><Label htmlFor="r1">5</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="10" id="r2" /><Label htmlFor="r2">10</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="20" id="r3" /><Label htmlFor="r3">20</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value={`${allWords.length}`} id="r4" /><Label htmlFor="r4">All ({allWords.length})</Label></div>
              </RadioGroup>
            </div>
            <Button className="w-full" onClick={() => generateNewTraining('new', parseInt(sessionSize))}>Start New Session</Button>
            {mistakes.length > 0 && (
                <div>
                    <Label className="font-bold">Review</Label>
                    <p className="text-sm text-muted-foreground">Practice the words you got wrong before.</p>
                    <Button className="w-full mt-2" variant="secondary" onClick={() => generateNewTraining('review', mistakes.length)}>
                        <History className="h-4 w-4 mr-2" /> Review {mistakes.length} Past Mistake(s)
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-lg">
          <div>
            <h2 className="text-2xl font-bold">Today's Progress</h2>
            <p className="text-lg">{dailyProgress.correct} / {dailyProgress.attempted} correct</p>
          </div>
          <Button onClick={() => setView('setup')}>End & Change Mode</Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {trainingData.map((item) => (
            <Card key={item.root} className={
              item.isRowChecked
                ? item.isRowCorrect ? 'border-green-500' : 'border-red-500'
                : ''
            }>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{item.root}</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleHint(item.root)}>
                      <Lightbulb className="h-4 w-4 mr-2" /> Hint
                    </Button>
                    <Button size="sm" onClick={() => handleCheckRow(item.root)}>Check</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {FORM_TYPES.map((type) => (
                  <div key={type}>
                    <h4 className="font-semibold capitalize mb-2 text-center">{type}</h4>
                    {item.forms[type]?.map((form) => {
                      const inputKey = `${item.root}-${type}-${form.word}`;
                      return (
                        <div key={form.word} className="mb-2 relative">
                          <Tooltip>
                            <TooltipTrigger className="w-full">
                              {form.hidden ? (
                                <Input
                                  value={userInputs[inputKey] || ''}
                                  onChange={(e) => handleInputChange(inputKey, e.target.value)}
                                  placeholder={hints[item.root] ? '_ '.repeat(form.word.length) : ''}
                                  disabled={item.isRowChecked}
                                />
                              ) : (
                                <div className="p-2 text-center">{form.word}</div>
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{form.meaning.en}</p>
                              <p>{form.meaning.vi}</p>
                            </TooltipContent>
                          </Tooltip>
                          {item.isRowChecked && form.hidden && (
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                              {form.isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
