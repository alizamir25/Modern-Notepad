
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
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
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

  const handleTypingAnimation = () => {
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 150);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    handleTypingAnimation();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    handleTypingAnimation();
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
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={() => setIsTitleFocused(false)}
          placeholder="Note title..."
          className={`neo-input w-full text-xl font-semibold transition-all duration-300 ${
            isTitleFocused 
              ? 'scale-[1.01] shadow-neo-pressed' 
              : 'shadow-neo-inset hover:shadow-neo-flat'
          } ${
            isTyping 
              ? 'animate-pulse-neo shadow-neo-pressed scale-[1.01]' 
              : ''
          }`}
          style={{ 
            fontSize: settings.fontSize + 4,
            fontFamily: settings.fontFamily 
          }}
        />
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-6 flex">
        {settings.lineNumbers && (
          <div className="neo-panel mr-4 p-3 min-h-full">
            {getLineNumbers()}
          </div>
        )}
        
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onFocus={() => setIsContentFocused(true)}
            onBlur={() => setIsContentFocused(false)}
            placeholder="Start writing your note..."
            className={`neo-textarea w-full h-full min-h-[400px] transition-all duration-300 ${
              isContentFocused 
                ? 'scale-[1.005] shadow-neo-pressed' 
                : 'shadow-neo-inset hover:shadow-neo-flat'
            } ${
              isTyping 
                ? 'animate-pulse-neo shadow-neo-pressed scale-[1.005]' 
                : ''
            }`}
            style={{
              fontSize: settings.fontSize,
              fontFamily: settings.fontFamily,
              whiteSpace: settings.wordWrap ? 'pre-wrap' : 'pre',
              wordWrap: settings.wordWrap ? 'break-word' : 'normal',
            }}
          />
        </div>
      </div>
    </div>
  );
};
