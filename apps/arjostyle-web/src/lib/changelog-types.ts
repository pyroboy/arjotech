// Changelog types — imported by the generated changelog-data.ts

export interface Change {
  type: 'feat' | 'fix' | 'chore' | 'misc';
  label: string;
  color: string;
  text: string;
}

export interface Release {
  version: string;
  date: string;
  commit: string;
  changes: Change[];
}
