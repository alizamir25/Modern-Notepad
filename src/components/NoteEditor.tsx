
import React, { useState, useEffect, useRef } from 'react';
import { Note, AppSettings } from '../types/theme';

interface NoteEditorProps {
  note: Note | null;
  onNoteChange: (note: Note) => void;
  settings: AppSettings;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onNoteChange, settings }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [animatedTitleChars, setAnimatedTitleChars] = useState<Set<number>>(new Set());
  const [animatedContentChars, setAnimatedContentChars] = useState<Set<number>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const prevTitleRef = useRef(title);
  const prevContentRef = useRef(content);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      prevTitleRef.current = note.title;
      prevContentRef.current = note.content;
    }
  }, [note]);

  useEffect(() => {
    if (settings.autoSave && note) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        const updatedNote: Note = {
          ...note,
          title: title || 'Untitled',
          content,
          updatedAt: new Date(),
        };
        onNoteChange(updatedNote);
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, settings.autoSave, note, onNoteChange]);

  const animateNewChars = (newText: string, oldText: string, setAnimatedChars: React.Dispatch<React.SetStateAction<Set<number>>>) => {
    const newChars = new Set<number>();
    
    // Find which characters are new or changed
    for (let i = 0; i < newText.length; i++) {
      if (i >= oldText.length || newText[i] !== oldText[i]) {
        newChars.add(i);
      }
    }
    
    if (newChars.size > 0) {
      setAnimatedChars(newChars);
      
      // Clear animations after a short delay
      setTimeout(() => {
        setAnimatedChars(new Set());
      }, 600);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    animateNewChars(newTitle, prevTitleRef.current, setAnimatedTitleChars);
    setTitle(newTitle);
    prevTitleRef.current = newTitle;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    animateNewChars(newContent, prevContentRef.current, setAnimatedContentChars);
    setContent(newContent);
    prevContentRef.current = newContent;
  };

  const renderAnimatedText = (text: string, animatedChars: Set<number>, className: string = '') => {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ padding: 'inherit' }}>
        {text.split('').map((char, index) => (
          <span
            key={`${index}-${char}`}
            className={`inline-block ${animatedChars.has(index) ? 'animate-bounce-subtle' : ''}`}
            style={{
              animationDelay: `${index * 20}ms`,
              animationDuration: '0.6s',
              transform: animatedChars.has(index) ? 'translateY(-2px) scale(1.1)' : 'none',
              color: animatedChars.has(index) ? 'var(--neo-accent)' : 'transparent',
              transition: 'all 0.3s ease-out',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    );
  };

  const getLineNumbers = () => {
    if (!settings.lineNumbers) return null;
    
    const lines = content.split('\n');
    return (
      <div className="flex flex-col text-sm text-neo-text/40 pr-4 select-none">
        {lines.map((_, index) => (
          <div key={index} className="leading-6">
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="neo-panel text-center max-w-md">
          <h2 className="text-xl font-semibold text-neo-text mb-2">
            Welcome to Neomorphism Notepad
          </h2>
          <p className="text-neo-text/70">
            Select a note from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in">
      {/* Title Input */}
      <div className="p-6 border-b border-neo-text/10">
        <div className="relative">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            placeholder="Note title..."
            className={`neo-input w-full text-xl font-semibold transition-all duration-300 relative z-10 ${
              isTitleFocused 
                ? 'scale-[1.01] shadow-neo-pressed' 
                : 'shadow-neo-inset hover:shadow-neo-flat'
            }`}
            style={{ 
              fontSize: settings.fontSize + 4,
              fontFamily: settings.fontFamily,
              backgroundColor: 'transparent',
            }}
          />
          <div 
            className="absolute inset-0 neo-input pointer-events-none"
            style={{ 
              fontSize: settings.fontSize + 4,
              fontFamily: settings.fontFamily,
            }}
          />
          {renderAnimatedText(title, animatedTitleChars, 'text-xl font-semibold')}
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-6 flex">
        {settings.lineNumbers && (
          <div className="neo-panel mr-4 p-3 min-h-full">
            {getLineNumbers()}
          </div>
        )}
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onFocus={() => setIsContentFocused(true)}
            onBlur={() => setIsContentFocused(false)}
            placeholder="Start writing your note..."
            className={`neo-textarea w-full h-full min-h-[400px] transition-all duration-300 relative z-10 ${
              isContentFocused 
                ? 'scale-[1.005] shadow-neo-pressed' 
                : 'shadow-neo-inset hover:shadow-neo-flat'
            }`}
            style={{
              fontSize: settings.fontSize,
              fontFamily: settings.fontFamily,
              whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre',
              wordWrap: settings.wordWrap ? 'break-word' : 'normal',
              backgroundColor: 'transparent',
            }}
          />
          <div 
            className="absolute inset-0 neo-textarea pointer-events-none"
            style={{
              fontSize: settings.fontSize,
              fontFamily: settings.fontFamily,
              whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre',
              wordWrap: settings.wordWrap ? 'break-word' : 'normal',
            }}
          />
          {renderAnimatedText(content, animatedContentChars)}
        </div>
      </div>
    </div>
  );
};
