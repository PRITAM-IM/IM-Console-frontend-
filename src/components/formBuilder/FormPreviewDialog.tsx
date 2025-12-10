import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FormTemplate, FormField } from '@/types/formBuilder';
import { useState } from 'react';

interface FormPreviewDialogProps {
    template: FormTemplate;
    isOpen: boolean;
    onClose: () => void;
}

export const FormPreviewDialog: React.FC<FormPreviewDialogProps> = ({ template, isOpen, onClose }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});

    if (!isOpen) return null;

    const currentPage = template.pages[currentPageIndex];
    const totalPages = template.pages.length;
    const progressPercentage = ((currentPageIndex + 1) / totalPages) * 100;

    // Theme settings
    const accentColor = template.theme?.accentColor || '#f97316';
    const isDarkMode = template.theme?.mode === 'dark';
    const backgroundColor = template.theme?.backgroundColor;

    const textPrimary = template.theme?.textPrimary || (isDarkMode ? '#F1F5F9' : '#0F172A');

    const borderColor = template.theme?.borderColor || (isDarkMode ? '#334155' : '#E2E8F0');
    const inputBackground = template.theme?.inputBackground || (isDarkMode ? '#1E293B' : '#F9FAFB');

    const borderRadius = template.theme?.borderRadius || 'rounded';

    
    // Border radius classes
    const radiusMap = {
        'sharp': 'rounded-none',
        'rounded': 'rounded-xl',
        'pill': 'rounded-3xl'
    };
    const borderRadiusClass = radiusMap[borderRadius];

    


    
    // Generate theme background - full page background based on theme
    const getThemeBackground = () => {
        // Use custom background if provided
        if (backgroundColor) {
            return { background: backgroundColor };
        }
        
        if (isDarkMode) {
            // For dark themes, create a dark gradient background
            return {
                background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`
            };
        } else {
            // For light themes, use a very subtle gradient with the accent color
            return {
                background: `linear-gradient(135deg, #ffffff 0%, ${accentColor}08 50%, #ffffff 100%)`
            };
        }
    };
    
    

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
    };

    const handleNext = () => {
        if (currentPageIndex < totalPages - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderField = (field: FormField) => {
        const value = formData[field.id] || '';

        switch (field.type) {
            case 'short-text':
            case 'email':
            case 'phone':
            case 'url':
                return (
                    <div 
                        className={`border-2 focus-within:shadow-sm transition-all ${borderRadiusClass}`}
                        style={{ 
                            backgroundColor: inputBackground,
                            borderColor: borderColor
                        }}
                        onFocus={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
                        }}
                        onBlur={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
                        }}
                    >
                        <input
                            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text'}
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder || 'Type your answer...'}
                            className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none"
                            style={{ color: textPrimary }}
                        />
                    </div>
                );

            case 'long-text':
                return (
                    <div 
                        className={`border-2 focus-within:shadow-sm transition-all ${borderRadiusClass}`}
                        style={{ 
                            backgroundColor: inputBackground,
                            borderColor: borderColor
                        }}
                        onFocus={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
                        }}
                        onBlur={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
                        }}
                    >
                        <textarea
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder || 'Type your answer...'}
                            rows={4}
                            className="w-full px-4 py-3 bg-transparent border-0 focus:outline-none resize-none"
                            style={{ color: textPrimary }}
                        />
                    </div>
                );

            case 'number':
                return (
                    <div className="bg-white rounded-lg border-2 border-slate-200 focus-within:border-orange-400 focus-within:shadow-sm transition-all">
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            min={field.validation?.min}
                            max={field.validation?.max}
                            className="w-full px-4 py-3.5 bg-transparent border-0 focus:outline-none text-slate-900 placeholder:text-slate-400 text-base"
                            required={field.validation?.required}
                        />
                    </div>
                );

            case 'multiple-choice':
                return (
                    <div className="space-y-2.5 mt-3">
                        {field.options?.map((option) => {
                            const isSelected = value === option.value;
                            return (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-3.5 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        isSelected
                                            ? 'shadow-sm'
                                            : (isDarkMode ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50')
                                    }`}
                                    style={{
                                        borderColor: isSelected ? accentColor : undefined,
                                        backgroundColor: isSelected ? `${accentColor}15` : undefined,
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={field.id}
                                        value={option.value}
                                        checked={isSelected}
                                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        className="w-4 h-4 focus:ring-2 cursor-pointer"
                                        style={{
                                            accentColor: accentColor,
                                        }}
                                        required={field.validation?.required}
                                    />
                                    <span className={`text-base font-medium flex-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{option.label}</span>
                                </label>
                            );
                        })}
                    </div>
                );

            case 'checkboxes':
                return (
                    <div className="space-y-2.5 mt-3">
                        {field.options?.map((option) => {
                            const isChecked = Array.isArray(value) && value.includes(option.value);
                            return (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-3.5 p-4 rounded-lg border-2 cursor-pointer transition-all ${isChecked
                                            ? 'border-orange-500 bg-orange-50 shadow-sm'
                                            : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={option.value}
                                        checked={isChecked}
                                        onChange={(e) => {
                                            const currentValues = Array.isArray(value) ? value : [];
                                            if (e.target.checked) {
                                                handleFieldChange(field.id, [...currentValues, option.value]);
                                            } else {
                                                handleFieldChange(field.id, currentValues.filter((v: string) => v !== option.value));
                                            }
                                        }}
                                        className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                    />
                                    <span className="text-slate-800 text-base font-medium flex-1">{option.label}</span>
                                </label>
                            );
                        })}
                    </div>
                );

            case 'dropdown':
                return (
                    <div className="bg-white rounded-lg border-2 border-slate-200 focus-within:border-orange-400 focus-within:shadow-sm transition-all">
                        <select
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-4 py-3.5 bg-transparent border-0 focus:outline-none text-slate-900 text-base cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23475569%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12"
                            required={field.validation?.required}
                        >
                            <option value="" className="text-slate-400">Select an option...</option>
                            {field.options?.map((option) => (
                                <option key={option.id} value={option.value} className="text-slate-900">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'date':
                return (
                    <div className="bg-white rounded-lg border-2 border-slate-200 focus-within:border-orange-400 focus-within:shadow-sm transition-all">
                        <input
                            type="date"
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-4 py-3.5 bg-transparent border-0 focus:outline-none text-slate-900 text-base"
                            required={field.validation?.required}
                        />
                    </div>
                );

            case 'time':
                return (
                    <div className="bg-white rounded-lg border-2 border-slate-200 focus-within:border-orange-400 focus-within:shadow-sm transition-all">
                        <input
                            type="time"
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-4 py-3.5 bg-transparent border-0 focus:outline-none text-slate-900 text-base"
                            required={field.validation?.required}
                        />
                    </div>
                );

            case 'heading':
                return <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{field.label}</h3>;

            case 'paragraph':
                return <p className="text-slate-600 leading-relaxed text-base">{field.description}</p>;

            case 'divider':
                return <div className="my-8"><hr className="border-slate-200" /></div>;

            default:
                return (
                    <div className="bg-white rounded-lg border-2 border-slate-200 focus-within:border-orange-400 focus-within:shadow-sm transition-all">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3.5 bg-transparent border-0 focus:outline-none text-slate-900 placeholder:text-slate-400 text-base"
                            autoComplete="off"
                        />
                    </div>
                );
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className={`flex-shrink-0 border-b shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className={`flex items-center gap-2 transition-colors ${
                            isDarkMode 
                                ? 'text-slate-400 hover:text-slate-200' 
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <X className="h-5 w-5" />
                        <span className="font-medium text-sm">Close Preview</span>
                    </button>

                    {/* Progress indicator */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {currentPageIndex + 1} / {totalPages}
                            </span>
                            <div className={`w-32 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                <div
                                    className="h-full transition-all duration-500 ease-out"
                                    style={{ 
                                        width: `${progressPercentage}%`,
                                        background: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)`
                                    }}
                                />
                            </div>
                            <span className="text-sm font-bold min-w-[2.5rem] text-right" style={{ color: accentColor }}>
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto" style={getThemeBackground()}>
                <div className="min-h-full">
                    <div className="max-w-2xl mx-auto px-6 py-10">
                        {/* Cover Page */}
                        {currentPageIndex === 0 && template.coverPage?.showCover && (
                            <div className={`mb-12 rounded-2xl p-8 shadow-sm border ${
                                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                            }`}>
                                {template.coverPage.imageUrl && (
                                    <img
                                        src={template.coverPage.imageUrl}
                                        alt="Form cover"
                                        className="w-full h-64 object-cover rounded-xl mb-6"
                                    />
                                )}
                                <h1 className={`text-4xl font-bold mb-4 leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                    {template.coverPage.title || template.name}
                                </h1>
                                {template.coverPage.description && (
                                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{template.coverPage.description}</p>
                                )}
                            </div>
                        )}

                        {/* Page Content */}
                        <div className="space-y-6">
                            {/* Page Title */}
                            {!(currentPageIndex === 0 && template.coverPage?.showCover) && (
                                <div className={`rounded-2xl p-8 shadow-sm border mb-6 ${
                                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                }`}>
                                    <h2 className={`text-3xl font-bold mb-2 leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{currentPage.name}</h2>
                                    {currentPage.description && (
                                        <p className={`text-base leading-relaxed mt-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{currentPage.description}</p>
                                    )}
                                </div>
                            )}

                            {/* Fields */}
                            {currentPage.fields.length === 0 ? (
                                <div className={`rounded-2xl p-16 shadow-sm border text-center ${
                                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                }`}>
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                                        isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                                    }`}>
                                        <span className="text-3xl">📝</span>
                                    </div>
                                    <p className={`text-base ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No fields on this page</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {currentPage.fields
                                        .sort((a, b) => a.order - b.order)
                                        .map((field, index) => (
                                            <div key={field.id} className={`rounded-xl p-6 shadow-sm border ${
                                                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                            }`}>
                                                {field.type !== 'heading' && field.type !== 'paragraph' && field.type !== 'divider' ? (
                                                    <div className="space-y-3">
                                                        <label className="block">
                                                            <div className="flex items-start gap-2 mb-3">
                                                                <span className="font-bold text-sm mt-0.5" style={{ color: accentColor }}>
                                                                    {index + 1}.
                                                                </span>
                                                                <div className="flex-1">
                                                                    <span className={`text-base font-semibold block leading-relaxed ${
                                                                        isDarkMode ? 'text-slate-100' : 'text-slate-900'
                                                                    }`}>
                                                                        {field.label}
                                                                        {field.validation?.required && (
                                                                            <span style={{ color: accentColor }} className="ml-1">*</span>
                                                                        )}
                                                                    </span>
                                                                    {field.description && (
                                                                        <p className={`text-sm mt-1.5 leading-relaxed ${
                                                                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                                                        }`}>
                                                                            {field.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </label>
                                                        <div>{renderField(field)}</div>
                                                    </div>
                                                ) : (
                                                    <div>{renderField(field)}</div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            )}

                            {/* Bottom spacing */}
                            <div className="h-20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer Navigation */}
            <div className={`flex-shrink-0 border-t shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    {currentPageIndex > 0 ? (
                        <button
                            onClick={handlePrevious}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
                                isDarkMode
                                    ? 'text-slate-300 hover:bg-slate-700'
                                    : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentPageIndex < totalPages - 1 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                            style={{ 
                                background: `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`,
                            }}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => alert('Form preview - submission disabled')}
                            className="px-6 py-2.5 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                            style={{ 
                                background: `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`,
                            }}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
