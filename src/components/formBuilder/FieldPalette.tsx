import { useState } from "react";
import {
  Type,
  AlignLeft,
  Circle,
  CheckSquare,
  ChevronDown,
  Mail,
  Phone,
  Hash,
  Calendar,
  Star,
  Upload,
  PenTool,
  Search,
  Heading1,
  FileText,
  Bell,
  Image as ImageIcon,
  Clock,
  MapPin,
  DollarSign,
  Link2,
  Lock,
  Palette,
  TrendingUp,
  BarChart3,
  Sliders,
  Minus,
  Video,
  Home
} from "lucide-react";
import type { FieldType } from "@/types/formBuilder";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FieldTypeDefinition {
  type: FieldType;
  label: string;
  icon: React.ElementType;
  description: string;
  category: 'frequently-used' | 'text' | 'choice' | 'time' | 'rating' | 'contact' | 'number' | 'display' | 'media' | 'special';
}

const fieldTypes: FieldTypeDefinition[] = [
  // Frequently Used
  {
    type: 'short-text',
    label: 'Short answer',
    icon: Type,
    description: 'Single line text input',
    category: 'frequently-used'
  },
  {
    type: 'multiple-choice',
    label: 'Multiple choice',
    icon: Circle,
    description: 'Select one option',
    category: 'frequently-used'
  },
  {
    type: 'email',
    label: 'Email input',
    icon: Mail,
    description: 'Email address input',
    category: 'frequently-used'
  },

  // Display Text
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading1,
    description: 'Section heading',
    category: 'display'
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: FileText,
    description: 'Text paragraph',
    category: 'display'
  },
  {
    type: 'banner',
    label: 'Banner',
    icon: Bell,
    description: 'Notice banner',
    category: 'display'
  },

  // Choices
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: ChevronDown,
    description: 'Dropdown select',
    category: 'choice'
  },
  {
    type: 'picture-choice',
    label: 'Picture choice',
    icon: ImageIcon,
    description: 'Visual selection',
    category: 'choice'
  },
  {
    type: 'checkboxes',
    label: 'Checkboxes',
    icon: CheckSquare,
    description: 'Select multiple',
    category: 'choice'
  },

  // Time
  {
    type: 'date',
    label: 'Date picker',
    icon: Calendar,
    description: 'Select a date',
    category: 'time'
  },
  {
    type: 'date-time',
    label: 'Date time picker',
    icon: Calendar,
    description: 'Date and time',
    category: 'time'
  },
  {
    type: 'time',
    label: 'Time picker',
    icon: Clock,
    description: 'Select time',
    category: 'time'
  },
  {
    type: 'date-range',
    label: 'Date range',
    icon: Calendar,
    description: 'Select date range',
    category: 'time'
  },

  // Rating & Ranking
  {
    type: 'ranking',
    label: 'Ranking',
    icon: TrendingUp,
    description: 'Order by preference',
    category: 'rating'
  },
  {
    type: 'rating',
    label: 'Star Rating',
    icon: Star,
    description: 'Star rating',
    category: 'rating'
  },
  {
    type: 'slider',
    label: 'Slider',
    icon: Sliders,
    description: 'Slider input',
    category: 'rating'
  },
  {
    type: 'opinion-scale',
    label: 'Opinion scale',
    icon: BarChart3,
    description: 'Scale rating',
    category: 'rating'
  },

  // Text
  {
    type: 'short-text',
    label: 'Short answer',
    icon: Type,
    description: 'Single line text',
    category: 'text'
  },
  {
    type: 'long-text',
    label: 'Long answer',
    icon: AlignLeft,
    description: 'Multi-line text',
    category: 'text'
  },

  // Contact Info
  {
    type: 'email',
    label: 'Email input',
    icon: Mail,
    description: 'Email address',
    category: 'contact'
  },
  {
    type: 'phone',
    label: 'Phone number',
    icon: Phone,
    description: 'Phone input',
    category: 'contact'
  },
  {
    type: 'address',
    label: 'Address',
    icon: Home,
    description: 'Full address',
    category: 'contact'
  },

  // Number
  {
    type: 'number',
    label: 'Number',
    icon: Hash,
    description: 'Numeric input',
    category: 'number'
  },
  {
    type: 'currency',
    label: 'Currency',
    icon: DollarSign,
    description: 'Money amount',
    category: 'number'
  },

  // Miscellaneous
  {
    type: 'url',
    label: 'URL input',
    icon: Link2,
    description: 'Website URL',
    category: 'special'
  },
  {
    type: 'color-picker',
    label: 'Color picker',
    icon: Palette,
    description: 'Select color',
    category: 'special'
  },
  {
    type: 'password',
    label: 'Password',
    icon: Lock,
    description: 'Password input',
    category: 'special'
  },
  {
    type: 'file-upload',
    label: 'File uploader',
    icon: Upload,
    description: 'Upload files',
    category: 'special'
  },
  {
    type: 'signature',
    label: 'Signature',
    icon: PenTool,
    description: 'Capture signature',
    category: 'special'
  },
  {
    type: 'location',
    label: 'Location coordinates',
    icon: MapPin,
    description: 'GPS coordinates',
    category: 'special'
  },

  // Navigation & Layout
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    description: 'Visual separator',
    category: 'display'
  },

  // Media
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    description: 'Display image',
    category: 'media'
  },
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    description: 'Embed video',
    category: 'media'
  }
];

interface FieldPaletteProps {
  onFieldSelect: (fieldType: FieldType) => void;
}

const FieldPalette = ({ onFieldSelect }: FieldPaletteProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = {
    'frequently-used': 'Frequently used',
    'display': 'Display text',
    'choice': 'Choices',
    'time': 'Time',
    'rating': 'Rating & Ranking',
    'text': 'Text',
    'contact': 'Contact Info',
    'number': 'Number',
    'special': 'Miscellaneous',
    'media': 'Media'
  };

  const filteredFields = searchQuery
    ? fieldTypes.filter(field =>
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : fieldTypes;

  return (
    <div className="w-72 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Field Types</h3>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search fields"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-white border-slate-200 focus:border-orange-300 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Fields List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {searchQuery ? (
          // Show filtered results when searching
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Search Results ({filteredFields.length})
            </h4>
            <div className="space-y-2">
              {filteredFields.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No fields found</p>
              ) : (
                filteredFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <button
                      key={field.type}
                      onClick={() => onFieldSelect(field.type)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200",
                        "bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50",
                        "hover:border-orange-300 hover:shadow-md transition-all duration-200",
                        "group cursor-pointer"
                      )}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('fieldType', field.type);
                      }}
                    >
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-orange-100 transition-colors">
                        <Icon className="h-5 w-5 text-slate-600 group-hover:text-orange-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                        <p className="text-xs text-slate-500">{field.description}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          // Show categorized fields when not searching
          Object.entries(categories).map(([category, categoryLabel]) => {
            const categoryFields = fieldTypes.filter(field => field.category === category);
            if (categoryFields.length === 0) return null;

            return (
              <div key={category}>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  {categoryLabel}
                </h4>
                <div className="space-y-2">
                  {categoryFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <button
                        key={field.type}
                        onClick={() => onFieldSelect(field.type)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200",
                          "bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50",
                          "hover:border-orange-300 hover:shadow-md transition-all duration-200",
                          "group cursor-pointer"
                        )}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('fieldType', field.type);
                        }}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-orange-100 transition-colors">
                          <Icon className="h-5 w-5 text-slate-600 group-hover:text-orange-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                          <p className="text-xs text-slate-500">{field.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FieldPalette;
