'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronsUpDown } from 'lucide-react';

interface Form {
  type: string;
  word: string;
  meaning: {
    vi: string;
    en: string;
  };
}

export default function WordTable({ forms }: { forms: Form[] }) {
  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Word</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <Collapsible asChild key={form.word}>
              <>
                <TableRow>
                  <TableCell>{form.type}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-semibold cursor-pointer">
                          {form.word}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{form.meaning.en}</p>
                        <p>{form.meaning.vi}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">
                    <CollapsibleTrigger asChild>
                      <button className="p-1">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </button>
                    </CollapsibleTrigger>
                  </TableCell>
                </TableRow>
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-semibold">English Meaning:</p>
                        <p>{form.meaning.en}</p>
                        <p className="font-semibold mt-2">Vietnamese Meaning:</p>
                        <p>{form.meaning.vi}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
