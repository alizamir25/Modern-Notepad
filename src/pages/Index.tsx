
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Note, AppSettings } from '../types/theme';
import { NoteSidebar } from '../components/NoteSidebar';
import { NoteEditor } from '../components/NoteEditor';
import { ThemeSelector } from '../components/ThemeSelector';
import { SettingsPanel } from '../components/SettingsPanel';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notepad-notes', []);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useLocalStorage<AppSettings>('notepad-settings', {
    theme: 'light',
    fontSize: 16,
    fontFamily: 'Inter, sans-serif',
    autoSave: true,
    wordWrap: true,
    lineNumbers: false,
  });

  // Load the first active note on initial load
  useEffect(() => {
    const activeNotes = notes.filter(note => !note.archived && !note.deleted);
    if (activeNotes.length > 0 && !currentNote) {
      setCurrentNote(activeNotes[0]);
    }
  }, [notes, currentNote]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      archived: false,
      deleted: false,
    };
    
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    
    toast({
      title: "Note created",
      description: "A new note has been created.",
    });
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setCurrentNote(updatedNote);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, deleted: true, deletedAt: new Date() }
        : note
    ));
    
    if (currentNote?.id === noteId) {
      const remainingActiveNotes = notes.filter(note => 
        note.id !== noteId && !note.archived && !note.deleted
      );
      setCurrentNote(remainingActiveNotes.length > 0 ? remainingActiveNotes[0] : null);
    }
    
    toast({
      title: "Note moved to trash",
      description: "The note has been moved to trash. You can restore it later.",
    });
  };

  const archiveNote = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, archived: true }
        : note
    ));
    
    if (currentNote?.id === noteId) {
      const remainingActiveNotes = notes.filter(note => 
        note.id !== noteId && !note.archived && !note.deleted
      );
      setCurrentNote(remainingActiveNotes.length > 0 ? remainingActiveNotes[0] : null);
    }
    
    toast({
      title: "Note archived",
      description: "The note has been archived.",
    });
  };

  const restoreNote = (noteId: string) => {
    const noteToRestore = notes.find(note => note.id === noteId);
    
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, archived: false, deleted: false, deletedAt: undefined }
        : note
    ));
    
    if (noteToRestore) {
      toast({
        title: "Note restored",
        description: `The note "${noteToRestore.title || 'Untitled'}" has been restored.`,
      });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setSettings(prev => ({ ...prev, theme: newTheme }));
    
    toast({
      title: "Theme changed",
      description: `Switched to ${newTheme} theme.`,
    });
  };

  return (
    <div className="min-h-screen bg-neo-bg flex relative overflow-hidden">
      {/* Main Content - Responsive Layout */}
      <div className="flex w-full min-h-screen">
        {/* Sidebar - Fixed width on larger screens, full width on mobile */}
        <div className="w-full sm:w-80 lg:w-96 xl:w-80 flex-shrink-0">
          <NoteSidebar
            notes={notes}
            currentNote={currentNote}
            onNoteSelect={setCurrentNote}
            onNoteCreate={createNote}
            onNoteDelete={deleteNote}
            onNoteArchive={archiveNote}
            onNoteRestore={restoreNote}
            onShowSettings={() => setShowSettings(true)}
            onShowThemes={() => setShowThemes(true)}
          />
        </div>

        {/* Note Editor - Takes remaining space */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <NoteEditor
            note={currentNote}
            onNoteChange={updateNote}
            settings={settings}
          />
        </div>
      </div>

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full animate-fade-in">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute -top-2 -right-2 neo-button p-2 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <SettingsPanel
              settings={settings}
              onSettingsChange={(newSettings) => {
                setSettings(newSettings);
                toast({
                  title: "Settings updated",
                  description: "Your preferences have been saved.",
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Theme Selector Overlay */}
      {showThemes && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full animate-fade-in">
            <button
              onClick={() => setShowThemes(false)}
              className="absolute -top-2 -right-2 neo-button p-2 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <ThemeSelector
              currentTheme={theme}
              onThemeChange={handleThemeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
