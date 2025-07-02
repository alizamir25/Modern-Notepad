
import React, { useState } from 'react';
import { Plus, Search, FileText, Trash2, Settings, Palette, Archive, ArchiveRestore, RotateCcw } from 'lucide-react';
import { Note } from '../types/theme';
import { formatDistanceToNow } from 'date-fns';

interface NoteSidebarProps {
  notes: Note[];
  currentNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
  onNoteArchive: (noteId: string) => void;
  onNoteRestore: (noteId: string) => void;
  onShowSettings: () => void;
  onShowThemes: () => void;
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  notes,
  currentNote,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNoteArchive,
  onNoteRestore,
  onShowSettings,
  onShowThemes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'trash'>('active');

  const getFilteredNotes = () => {
    let filteredNotes = notes;
    
    // Filter by status
    switch (activeTab) {
      case 'active':
        filteredNotes = notes.filter(note => !note.archived && !note.deleted);
        break;
      case 'archived':
        filteredNotes = notes.filter(note => note.archived && !note.deleted);
        break;
      case 'trash':
        filteredNotes = notes.filter(note => note.deleted);
        break;
    }

    // Filter by search term
    return filteredNotes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredNotes = getFilteredNotes();

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'active': return <FileText className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      case 'trash': return <Trash2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'active': return notes.filter(note => !note.archived && !note.deleted).length;
      case 'archived': return notes.filter(note => note.archived && !note.deleted).length;
      case 'trash': return notes.filter(note => note.deleted).length;
      default: return 0;
    }
  };

  return (
    <div className="h-full bg-neo-bg border-r border-neo-text/10 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-neo-text/10 animate-fade-in flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-neo-text mb-3 sm:mb-4 animate-bounce-subtle">
          📝 Notepad
        </h1>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mb-3 sm:mb-4">
          <button
            onClick={onNoteCreate}
            className="neo-button flex-1 flex items-center justify-center gap-2 animate-pulse-neo text-sm sm:text-base py-2"
          >
            <Plus className="w-4 h-4 animate-rotate-slow" />
            <span className="hidden sm:inline">New Note</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-3 sm:mb-4">
          {(['active', 'archived', 'trash'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`neo-button flex-1 flex items-center justify-center gap-1 text-xs ${
                activeTab === tab ? 'bg-neo-accent/20 shadow-neo-inset' : ''
              } p-2`}
            >
              <span className="w-3 h-3 sm:w-4 sm:h-4">
                {getTabIcon(tab)}
              </span>
              <span className="capitalize hidden sm:inline">{tab}</span>
              <span className="text-xs opacity-60">({getTabCount(tab)})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neo-text/50 animate-pulse" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neo-input w-full pl-10 text-sm"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredNotes.map((note, index) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note)}
            className={`neo-sidebar-item neo-note-card p-3 sm:p-4 border-b border-neo-text/10 cursor-pointer group ${
              currentNote?.id === note.id ? 'bg-neo-accent/10 shadow-neo-inset' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-medium text-neo-text truncate group-hover:text-neo-accent transition-colors duration-300 text-sm sm:text-base">
                  {note.title || 'Untitled'}
                </h3>
                <p className="text-xs sm:text-sm text-neo-text/70 mt-1 line-clamp-2">
                  {note.content || 'No content'}
                </p>
                <p className="text-xs text-neo-text/50 mt-2">
                  {activeTab === 'trash' && note.deletedAt 
                    ? `Deleted ${formatDistanceToNow(new Date(note.deletedAt), { addSuffix: true })}`
                    : formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
                  }
                </p>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                {activeTab === 'active' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteArchive(note.id);
                      }}
                      className="neo-button p-1 hover:text-yellow-500 transition-all duration-300 hover:scale-110"
                      title="Archive"
                    >
                      <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteDelete(note.id);
                      }}
                      className="neo-button p-1 hover:text-red-500 transition-all duration-300 hover:scale-110"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </>
                )}
                {activeTab === 'archived' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteRestore(note.id);
                    }}
                    className="neo-button p-1 hover:text-green-500 transition-all duration-300 hover:scale-110"
                    title="Restore"
                  >
                    <ArchiveRestore className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
                {activeTab === 'trash' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteRestore(note.id);
                    }}
                    className="neo-button p-1 hover:text-green-500 transition-all duration-300 hover:scale-110"
                    title="Restore"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="p-6 sm:p-8 text-center animate-fade-in">
            <div className="w-12 h-12 sm:w-16 sm:h-16 text-neo-text/30 mx-auto mb-4 animate-float flex items-center justify-center">
              {getTabIcon(activeTab)}
            </div>
            <p className="text-neo-text/70 text-base sm:text-lg">
              {searchTerm ? 'No notes found' : `No ${activeTab} notes`}
            </p>
            <p className="text-neo-text/50 text-sm mt-2">
              {searchTerm ? 'Try a different search term' : 
               activeTab === 'active' ? 'Create your first note to get started!' :
               activeTab === 'archived' ? 'Archive notes to see them here' :
               'Deleted notes will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-neo-text/10 flex gap-2 animate-slide-in-right flex-shrink-0">
        <button
          onClick={onShowThemes}
          className="neo-button flex-1 flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-neo-accent/10 hover:to-neo-accent/5 text-sm py-2"
        >
          <Palette className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">Themes</span>
        </button>
        <button
          onClick={onShowSettings}
          className="neo-button flex-1 flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-neo-accent/10 hover:to-neo-accent/5 text-sm py-2"
        >
          <Settings className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </div>
  );
};
