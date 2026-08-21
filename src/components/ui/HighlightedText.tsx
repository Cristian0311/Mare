import React from 'react';
import { normalizeText } from '../../utils/search';

interface HighlightedTextProps {
  text: string;
  highlight: string;
  className?: string;
  highlightClassName?: string;
}

export function HighlightedText({ 
  text, 
  highlight, 
  className = '', 
  highlightClassName = 'font-extrabold text-mare-green bg-mare-green/10 px-0.5 rounded' 
}: HighlightedTextProps) {
  if (!highlight.trim()) return <span className={className}>{text}</span>;

  const normalizedText = normalizeText(text);
  const normalizedHighlight = normalizeText(highlight);

  const index = normalizedText.indexOf(normalizedHighlight);
  
  if (index === -1) {
    return <span className={className}>{text}</span>;
  }

  const before = text.substring(0, index);
  const match = text.substring(index, index + highlight.length);
  const after = text.substring(index + highlight.length);

  return (
    <span className={className}>
      {before}
      <span className={highlightClassName}>{match}</span>
      {after}
    </span>
  );
}
