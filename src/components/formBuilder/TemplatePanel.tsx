import { useState } from "react";
import { X, Check, Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { FormTemplate } from "@/types/formBuilder";

interface DesignTemplate {
  id: string;
  name: string;
  category: 'minimal' | 'professional' | 'creative' | 'elegant' | 'bold' | 'corporate';
  description: string;
  preview: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    cardBackground: string;
  };
  styles: {
    accentColor: string;
    mode: 'light' | 'dark';
    backgroundColor: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
    inputBackground: string;
    buttonStyle: 'solid' | 'gradient' | 'outlined' | 'soft';
    borderRadius: 'sharp' | 'rounded' | 'pill';
    fontFamily: string;
    spacing: 'compact' | 'normal' | 'spacious';
  };
}

const designTemplates: DesignTemplate[] = [
  // MINIMAL TEMPLATES
  {
    id: 'minimal-white',
    name: 'Pure Minimal',
    category: 'minimal',
    description: 'Clean white canvas with subtle accents',
    preview: {
      primaryColor: '#000000',
      secondaryColor: '#6B7280',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      cardBackground: '#F9FAFB'
    },
    styles: {
      accentColor: '#000000',
      mode: 'light',
      backgroundColor: '#FFFFFF',
      cardBackground: '#F9FAFB',
      textPrimary: '#000000',
      textSecondary: '#6B7280',
      borderColor: '#E5E7EB',
      inputBackground: '#FFFFFF',
      buttonStyle: 'solid',
      borderRadius: 'rounded',
      fontFamily: 'Inter',
      spacing: 'spacious'
    }
  },
  {
    id: 'minimal-blue',
    name: 'Soft Blue',
    category: 'minimal',
    description: 'Calming blue with clean design',
    preview: {
      primaryColor: '#3B82F6',
      secondaryColor: '#60A5FA',
      backgroundColor: '#F0F9FF',
      textColor: '#1E3A8A',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#3B82F6',
      mode: 'light',
      backgroundColor: '#F0F9FF',
      cardBackground: '#FFFFFF',
      textPrimary: '#1E3A8A',
      textSecondary: '#3B82F6',
      borderColor: '#BFDBFE',
      inputBackground: '#FFFFFF',
      buttonStyle: 'soft',
      borderRadius: 'rounded',
      fontFamily: 'Inter',
      spacing: 'normal'
    }
  },

  // PROFESSIONAL TEMPLATES
  {
    id: 'pro-corporate',
    name: 'Corporate Blue',
    category: 'professional',
    description: 'Professional and trustworthy',
    preview: {
      primaryColor: '#1E40AF',
      secondaryColor: '#3B82F6',
      backgroundColor: '#F8FAFC',
      textColor: '#0F172A',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#1E40AF',
      mode: 'light',
      backgroundColor: '#F8FAFC',
      cardBackground: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      borderColor: '#CBD5E1',
      inputBackground: '#F8FAFC',
      buttonStyle: 'solid',
      borderRadius: 'sharp',
      fontFamily: 'Roboto',
      spacing: 'normal'
    }
  },
  {
    id: 'pro-green',
    name: 'Business Green',
    category: 'professional',
    description: 'Growth-focused and stable',
    preview: {
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      backgroundColor: '#F0FDF4',
      textColor: '#064E3B',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#059669',
      mode: 'light',
      backgroundColor: '#F0FDF4',
      cardBackground: '#FFFFFF',
      textPrimary: '#064E3B',
      textSecondary: '#047857',
      borderColor: '#BBF7D0',
      inputBackground: '#FFFFFF',
      buttonStyle: 'solid',
      borderRadius: 'rounded',
      fontFamily: 'Roboto',
      spacing: 'normal'
    }
  },

  // CREATIVE TEMPLATES
  {
    id: 'creative-gradient',
    name: 'Vibrant Gradient',
    category: 'creative',
    description: 'Eye-catching gradient design',
    preview: {
      primaryColor: '#EC4899',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#FDF4FF',
      textColor: '#831843',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#EC4899',
      mode: 'light',
      backgroundColor: 'linear-gradient(135deg, #FDF4FF 0%, #F0F9FF 100%)',
      cardBackground: '#FFFFFF',
      textPrimary: '#831843',
      textSecondary: '#A855F7',
      borderColor: '#F9A8D4',
      inputBackground: '#FFFFFF',
      buttonStyle: 'gradient',
      borderRadius: 'pill',
      fontFamily: 'Poppins',
      spacing: 'spacious'
    }
  },
  {
    id: 'creative-sunset',
    name: 'Sunset Vibes',
    category: 'creative',
    description: 'Warm and inviting atmosphere',
    preview: {
      primaryColor: '#F97316',
      secondaryColor: '#FBBF24',
      backgroundColor: '#FFF7ED',
      textColor: '#7C2D12',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#F97316',
      mode: 'light',
      backgroundColor: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)',
      cardBackground: '#FFFFFF',
      textPrimary: '#7C2D12',
      textSecondary: '#EA580C',
      borderColor: '#FED7AA',
      inputBackground: '#FFFFFF',
      buttonStyle: 'gradient',
      borderRadius: 'rounded',
      fontFamily: 'Poppins',
      spacing: 'normal'
    }
  },

  // ELEGANT TEMPLATES
  {
    id: 'elegant-purple',
    name: 'Royal Purple',
    category: 'elegant',
    description: 'Luxurious and sophisticated',
    preview: {
      primaryColor: '#7C3AED',
      secondaryColor: '#A78BFA',
      backgroundColor: '#FAF5FF',
      textColor: '#581C87',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#7C3AED',
      mode: 'light',
      backgroundColor: '#FAF5FF',
      cardBackground: '#FFFFFF',
      textPrimary: '#581C87',
      textSecondary: '#7C3AED',
      borderColor: '#DDD6FE',
      inputBackground: '#FFFFFF',
      buttonStyle: 'soft',
      borderRadius: 'rounded',
      fontFamily: 'Playfair Display',
      spacing: 'spacious'
    }
  },
  {
    id: 'elegant-rose',
    name: 'Rose Gold',
    category: 'elegant',
    description: 'Refined and feminine touch',
    preview: {
      primaryColor: '#BE185D',
      secondaryColor: '#EC4899',
      backgroundColor: '#FFF1F2',
      textColor: '#881337',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#BE185D',
      mode: 'light',
      backgroundColor: '#FFF1F2',
      cardBackground: '#FFFFFF',
      textPrimary: '#881337',
      textSecondary: '#BE185D',
      borderColor: '#FECDD3',
      inputBackground: '#FFFFFF',
      buttonStyle: 'soft',
      borderRadius: 'pill',
      fontFamily: 'Playfair Display',
      spacing: 'spacious'
    }
  },

  // BOLD TEMPLATES
  {
    id: 'bold-red',
    name: 'Bold Red',
    category: 'bold',
    description: 'Energetic and attention-grabbing',
    preview: {
      primaryColor: '#DC2626',
      secondaryColor: '#EF4444',
      backgroundColor: '#FEF2F2',
      textColor: '#7F1D1D',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#DC2626',
      mode: 'light',
      backgroundColor: '#FEF2F2',
      cardBackground: '#FFFFFF',
      textPrimary: '#7F1D1D',
      textSecondary: '#DC2626',
      borderColor: '#FECACA',
      inputBackground: '#FFFFFF',
      buttonStyle: 'solid',
      borderRadius: 'sharp',
      fontFamily: 'Montserrat',
      spacing: 'compact'
    }
  },
  {
    id: 'bold-cyan',
    name: 'Electric Cyan',
    category: 'bold',
    description: 'Modern and tech-forward',
    preview: {
      primaryColor: '#0891B2',
      secondaryColor: '#06B6D4',
      backgroundColor: '#ECFEFF',
      textColor: '#164E63',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#0891B2',
      mode: 'light',
      backgroundColor: '#ECFEFF',
      cardBackground: '#FFFFFF',
      textPrimary: '#164E63',
      textSecondary: '#0891B2',
      borderColor: '#A5F3FC',
      inputBackground: '#FFFFFF',
      buttonStyle: 'solid',
      borderRadius: 'rounded',
      fontFamily: 'Montserrat',
      spacing: 'normal'
    }
  },

  // CORPORATE TEMPLATES
  {
    id: 'corporate-navy',
    name: 'Navy Corporate',
    category: 'corporate',
    description: 'Traditional and authoritative',
    preview: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#3B82F6',
      backgroundColor: '#EFF6FF',
      textColor: '#1E3A8A',
      cardBackground: '#FFFFFF'
    },
    styles: {
      accentColor: '#1E3A8A',
      mode: 'light',
      backgroundColor: '#EFF6FF',
      cardBackground: '#FFFFFF',
      textPrimary: '#1E3A8A',
      textSecondary: '#3B82F6',
      borderColor: '#DBEAFE',
      inputBackground: '#F9FAFB',
      buttonStyle: 'solid',
      borderRadius: 'sharp',
      fontFamily: 'Arial',
      spacing: 'normal'
    }
  },
  {
    id: 'corporate-dark',
    name: 'Dark Professional',
    category: 'corporate',
    description: 'Sleek dark mode design',
    preview: {
      primaryColor: '#10B981',
      secondaryColor: '#34D399',
      backgroundColor: '#0F172A',
      textColor: '#F1F5F9',
      cardBackground: '#1E293B'
    },
    styles: {
      accentColor: '#10B981',
      mode: 'dark',
      backgroundColor: '#0F172A',
      cardBackground: '#1E293B',
      textPrimary: '#F1F5F9',
      textSecondary: '#CBD5E1',
      borderColor: '#334155',
      inputBackground: '#1E293B',
      buttonStyle: 'solid',
      borderRadius: 'rounded',
      fontFamily: 'Roboto',
      spacing: 'normal'
    }
  },
];

interface TemplatePanelProps {
  template: FormTemplate;
  onTemplateApply: (designTemplate: DesignTemplate) => void;
  onClose: () => void;
}

const TemplatePanel = ({ template: _template, onTemplateApply, onClose }: TemplatePanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'bold', name: 'Bold' },
    { id: 'corporate', name: 'Corporate' }
  ];

  const filteredTemplates = designTemplates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApplyTemplate = (designTemplate: DesignTemplate) => {
    setSelectedTemplate(designTemplate.id);
    onTemplateApply(designTemplate);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-b from-orange-50 to-white flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">Design Templates</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Choose from professionally designed templates
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredTemplates.map(designTemplate => (
            <div
              key={designTemplate.id}
              onClick={() => handleApplyTemplate(designTemplate)}
              className={`relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${
                selectedTemplate === designTemplate.id
                  ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              {/* Preview Card */}
              <div
                className="p-4"
                style={{
                  background: designTemplate.preview.backgroundColor
                }}
              >
                {/* Mini Preview */}
                <div
                  className="rounded-lg p-3 mb-2 border"
                  style={{
                    backgroundColor: designTemplate.preview.cardBackground,
                    borderColor: designTemplate.styles.borderColor
                  }}
                >
                  <div
                    className="h-2 rounded mb-2"
                    style={{ backgroundColor: designTemplate.preview.primaryColor, width: '60%' }}
                  />
                  <div
                    className="h-1.5 rounded mb-1"
                    style={{ backgroundColor: designTemplate.preview.secondaryColor, width: '40%' }}
                  />
                  <div
                    className="h-1.5 rounded"
                    style={{ backgroundColor: designTemplate.preview.secondaryColor, width: '30%' }}
                  />
                </div>

                {/* Template Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: designTemplate.preview.textColor }}>
                      {designTemplate.name}
                    </h4>
                    <p className="text-xs mt-0.5" style={{ color: designTemplate.preview.secondaryColor }}>
                      {designTemplate.description}
                    </p>
                  </div>
                  {selectedTemplate === designTemplate.id && (
                    <div className="p-1 rounded-full bg-orange-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Color Palette */}
                <div className="flex gap-1.5 mt-3">
                  <div
                    className="w-6 h-6 rounded-md border border-white/50"
                    style={{ backgroundColor: designTemplate.preview.primaryColor }}
                    title="Primary Color"
                  />
                  <div
                    className="w-6 h-6 rounded-md border border-white/50"
                    style={{ backgroundColor: designTemplate.preview.secondaryColor }}
                    title="Secondary Color"
                  />
                  <div
                    className="w-6 h-6 rounded-md border border-slate-300"
                    style={{ backgroundColor: designTemplate.preview.cardBackground }}
                    title="Card Background"
                  />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  Apply Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No templates found</p>
            <p className="text-xs text-slate-500 mt-1">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
        <p className="text-xs text-slate-600">
          💡 Templates apply complete design including colors, fonts, spacing, and button styles
        </p>
      </div>
    </div>
  );
};

export default TemplatePanel;
export type { DesignTemplate };
