
export interface Theme {
  id: string;
  name: string;
  className: string;
  colors: {
    bg: string;
    light: string;
    dark: string;
    text: string;
    accent: string;
  };
}

export interface AppSettings {
  theme: string;
  fontSize: number;
  fontFamily: string;
  autoSave: boolean;
  wordWrap: boolean;
  lineNumbers: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
