'use client';

import { useState } from 'react';
import { Copy, Download, FileText, FileJson, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard, exportToPDF, exportToCSV, exportToJSON } from '@/lib/tools/shared/exportUtils';
import { ExportOptions } from '@/types/tools';

interface ExportButtonsProps {
  data: any;
  filename: string;
  options?: ExportOptions;
  textToCopy?: string;
  pdfTitle?: string;
  pdfContent?: string;
}

export function ExportButtons({
  data,
  filename,
  options = { copy: true, pdf: true, csv: false, json: false },
  textToCopy,
  pdfTitle,
  pdfContent
}: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = textToCopy || (typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePDF = () => {
    exportToPDF({
      title: pdfTitle || filename,
      content: pdfContent || (typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    });
  };

  const handleCSV = () => {
    const csvData = Array.isArray(data) ? data : [data];
    exportToCSV(csvData, `${filename}.csv`);
  };

  const handleJSON = () => {
    exportToJSON(data, `${filename}.json`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.copy && (
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      )}
      
      {options.pdf && (
        <Button
          onClick={handlePDF}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Export PDF
        </Button>
      )}
      
      {options.csv && (
        <Button
          onClick={handleCSV}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      )}
      
      {options.json && (
        <Button
          onClick={handleJSON}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <FileJson className="w-4 h-4" />
          Export JSON
        </Button>
      )}
    </div>
  );
}

