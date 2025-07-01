
import React from 'react';
import { Settings, Type, Save, ToggleLeft, ToggleRight, Hash } from 'lucide-react';
import { AppSettings } from '../types/theme';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const fontFamilies = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto Mono', value: 'Roboto Mono, monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="neo-panel animate-fade-in space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-neo-accent" />
        <h3 className="font-semibold text-neo-text">Settings</h3>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-neo-text">
          <Type className="w-4 h-4" />
          Font Size: {settings.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="24"
          value={settings.fontSize}
          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
          className="w-full h-2 bg-neo-bg rounded-lg shadow-neo-inset appearance-none cursor-pointer"
        />
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-neo-text">
          <Type className="w-4 h-4" />
          Font Family
        </label>
        <select
          value={settings.fontFamily}
          onChange={(e) => updateSetting('fontFamily', e.target.value)}
          className="neo-input w-full"
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>{font.name}</option>
          ))}
        </select>
      </div>

      {/* Toggle Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-neo-text">
            <Save className="w-4 h-4" />
            Auto Save
          </label>
          <button
            onClick={() => updateSetting('autoSave', !settings.autoSave)}
            className="neo-button p-2"
          >
            {settings.autoSave ? 
              <ToggleRight className="w-5 h-5 text-neo-accent" /> : 
              <ToggleLeft className="w-5 h-5" />
            }
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-neo-text">
            <Type className="w-4 h-4" />
            Word Wrap
          </label>
          <button
            onClick={() => updateSetting('wordWrap', !settings.wordWrap)}
            className="neo-button p-2"
          >
            {settings.wordWrap ? 
              <ToggleRight className="w-5 h-5 text-neo-accent" /> : 
              <ToggleLeft className="w-5 h-5" />
            }
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-neo-text">
            <Hash className="w-4 h-4" />
            Line Numbers
          </label>
          <button
            onClick={() => updateSetting('lineNumbers', !settings.lineNumbers)}
            className="neo-button p-2"
          >
            {settings.lineNumbers ? 
              <ToggleRight className="w-5 h-5 text-neo-accent" /> : 
              <ToggleLeft className="w-5 h-5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
};
