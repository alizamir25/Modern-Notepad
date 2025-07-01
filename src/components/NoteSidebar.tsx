
import React, { useState } from 'react';
import { Plus, Search, FileText, Trash2, Settings, Palette } from 'lucide-react';
import { Note } from '../types/theme';
import { formatDistanceToNow } from 'date-fns';

interface NoteSidebarProps {
  notes: Note[];
  currentNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
  onShowSettings: () => void;
  onShowThemes: () => void;
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  notes,
  currentNote,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onShowSettings,
  onShowThemes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-neo-bg border-r border-neo-text/10 flex flex-col h-full animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-neo-text/10 animate-fade-in">
        <h1 className="text-2xl font-bold text-neo-text mb-4 animate-bounce-subtle">
          📝 Notepad
        </h1>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={onNoteCreate}
            className="neo-button flex-1 flex items-center justify-center gap-2 animate-pulse-neo"
          >
            <Plus className="w-4 h-4 animate-rotate-slow" />
            New Note
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neo-text/50 animate-pulse" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neo-input w-full pl-10"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.map((note, index) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note)}
            className={`neo-sidebar-item neo-note-card p-4 border-b border-neo-text/10 cursor-pointer group ${
              currentNote?.id === note.id ? 'bg-neo-accent/10 shadow-neo-inset' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neo-text truncate group-hover:text-neo-accent transition-colors duration-300">
                  {note.title || 'Untitled'}
                </h3>
                <p className="text-sm text-neo-text/70 mt-1 line-clamp-2">
                  {note.content || 'No content'}
                </p>
                <p className="text-xs text-neo-text/50 mt-2">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNoteDelete(note.id);
                }}
                className="neo-button p-1 ml-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all duration-300 hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="p-8 text-center animate-fade-in">
            <FileText className="w-16 h-16 text-neo-text/30 mx-auto mb-4 animate-float" />
            <p className="text-neo-text/70 text-lg">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </p>
            <p className="text-neo-text/50 text-sm mt-2">
              {searchTerm ? 'Try a different search term' : 'Create your first note to get started!'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neo-text/10 flex gap-2 animate-slide-in-right">
        <button
          onClick={onShowThemes}
          className="neo-button flex-1 flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-neo-accent/10 hover:to-neo-accent/5"
        >
          <Palette className="w-4 h-4 animate-pulse" />
          Themes
        </button>
        <button
          onClick={onShowSettings}
          className="neo-button flex-1 flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-neo-accent/10 hover:to-neo-accent/5"
        >
          <Settings className="w-4 h-4 animate-pulse" />
          Settings
        </button>
      </div>
    </div>
  );
};
