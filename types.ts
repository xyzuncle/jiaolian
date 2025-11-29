
export interface Column {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  fkTable?: string;
  nullable?: boolean;
  default?: string;
  description: string;
}

export interface Table {
  name: string;
  description: string;
  columns: Column[];
}

export enum ViewMode {
  SYSTEM_DESIGN = 'system_design',
  DB_DESIGN = 'db_design',
  
  // Functional Modules
  MEMBER_MGT = 'member_mgt',
  TRAINER_MGT = 'trainer_mgt',
  COURSE_MGT = 'course_mgt',
  COURSE_MOD = 'course_mod'
}

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  children?: NavItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
