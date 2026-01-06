// Form Builder Types - Fillout.com style

export type FieldType =
  // Text inputs
  | 'short-text'
  | 'long-text'
  | 'email'
  | 'phone'
  | 'number'
  | 'url'
  | 'password'
  // Choices
  | 'multiple-choice'
  | 'checkboxes'
  | 'dropdown'
  | 'picture-choice'
  // Date & Time
  | 'date'
  | 'time'
  | 'date-time'
  | 'date-range'
  // Rating & Ranking
  | 'rating'
  | 'ranking'
  | 'slider'
  | 'opinion-scale'
  // Special
  | 'file-upload'
  | 'signature'
  | 'color-picker'
  | 'location'
  | 'address'
  | 'currency'
  // Display elements
  | 'heading'
  | 'paragraph'
  | 'banner'
  | 'divider'
  | 'image'
  | 'video';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  fileTypes?: string[];
  maxFileSize?: number; // in MB
}

export interface ConditionalLogic {
  id: string;
  triggerFieldId: string;
  triggerCondition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  triggerValue?: any;
  action: 'show' | 'hide' | 'require' | 'skip_to_page';
  targetFieldIds?: string[];
  targetPageId?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  options?: FieldOption[]; // For multiple-choice, checkboxes, dropdown
  validation?: FieldValidation;
  conditionalLogic?: ConditionalLogic[];
  defaultValue?: string | number | string[];
  order: number;
}

export interface FormPage {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  order: number;
}

export interface FormTheme {
  accentColor: string;
  mode: 'light' | 'dark';
  fontFamily?: string;
  // Extended template styles
  backgroundColor?: string;
  cardBackground?: string;
  textPrimary?: string;
  textSecondary?: string;
  borderColor?: string;
  inputBackground?: string;
  buttonStyle?: 'solid' | 'gradient' | 'outlined' | 'soft';
  borderRadius?: 'sharp' | 'rounded' | 'pill';
  spacing?: 'compact' | 'normal' | 'spacious';
}

export interface FormCoverPage {
  title: string;
  description?: string;
  imageUrl?: string;
  showCover: boolean;
}

export interface FormTemplate {
  _id?: string;
  id?: string;
  projectId: string;
  name: string;
  description?: string;
  slug?: string;
  theme: FormTheme;
  coverPage: FormCoverPage;
  pages: FormPage[];
  isPublished: boolean;
  isCpsTemplate?: boolean; // Flag for CPS templates
  publishedUrl?: string;
  publishedAt?: string;
  viewCount?: number;
  submissionCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface FormSubmission {
  _id?: string;
  id?: string;
  templateId: string;
  projectId: string;
  data: Record<string, Record<string, unknown>>; // pageId -> fieldId -> value
  submittedAt: string;
  submittedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface FormSubmissionSummary {
  templateId: string;
  totalSubmissions: number;
  lastSubmittedAt?: string;
  averageCompletionTime?: number;
  fieldAnalytics?: Record<string, {
    fieldId: string;
    fieldLabel: string;
    responses: Array<{ value: unknown; count: number }>;
  }>;
}

// Drag and drop types
export interface DraggableFieldType {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
}
