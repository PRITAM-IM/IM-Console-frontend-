import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FieldOption {
    id: string;
    label: string;
    value: string;
}

interface FormField {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    description?: string;
    options?: FieldOption[];
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
}

interface FormPage {
    id: string;
    name: string;
    description?: string;
    fields: FormField[];
}

interface FormTemplate {
    _id: string;
    name: string;
    description?: string;
    slug: string;
    pages: FormPage[];
    coverPage: {
        title: string;
        description?: string;
        imageUrl?: string;
        showCover: boolean;
    };
    theme: {
        accentColor: string;
        mode: 'light' | 'dark';
    };
}

const PublicFormPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [form, setForm] = useState<FormTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [startTime] = useState(new Date());

    useEffect(() => {
        loadForm();
    }, [slug]);

    const loadForm = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/forms/${slug}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError('This form doesn\'t exist or has been unpublished.');
                } else {
                    setError('Failed to load form. Please try again later.');
                }
                return;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                setError('Invalid response from server.');
                return;
            }

            const data = await response.json();
            setForm(data);

            setCurrentPageIndex(data.coverPage?.showCover ? -1 : 0);
        } catch (error) {
            console.error('Error loading form:', error);
            setError('Failed to load form. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const validateField = (field: FormField, value: any): string | null => {
        if (field.validation?.required && !value) {
            return 'This field is required';
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
            }
        }

        if (field.validation?.minLength && value?.length < field.validation.minLength) {
            return `Minimum ${field.validation.minLength} characters required`;
        }

        if (field.validation?.maxLength && value?.length > field.validation.maxLength) {
            return `Maximum ${field.validation.maxLength} characters allowed`;
        }

        return null;
    };

    const validateCurrentPage = (): boolean => {
        if (!form || currentPageIndex < 0) return true;

        const currentPage = form.pages[currentPageIndex];
        const newErrors: Record<string, string> = {};
        let isValid = true;

        currentPage.fields.forEach((field) => {
            const error = validateField(field, formData[field.id]);
            if (error) {
                newErrors[field.id] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (!form) return;

        if (currentPageIndex >= 0 && !validateCurrentPage()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (currentPageIndex < form.pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
            setErrors({});
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentPageIndex > -1) {
            setCurrentPageIndex(currentPageIndex - 1);
            setErrors({});
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        if (!form || !validateCurrentPage()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);

            // Organize form data by pages
            const organizedData: Record<string, Record<string, any>> = {};

            // Extract respondent email and name
            let respondentEmail: string | undefined;
            let respondentName: string | undefined;

            form.pages.forEach((page) => {
                const pageData: Record<string, any> = {};
                page.fields.forEach((field) => {
                    if (formData[field.id] !== undefined) {
                        pageData[field.id] = formData[field.id];

                        // Extract email from email fields
                        if (field.type === 'email' && formData[field.id]) {
                            respondentEmail = formData[field.id];
                        }

                        // Extract name from fields that look like name fields
                        if (!respondentName && formData[field.id]) {
                            const label = field.label.toLowerCase();
                            if (label.includes('name') || label.includes('username') ||
                                label.includes('full name') || label.includes('your name')) {
                                respondentName = formData[field.id];
                            }
                        }
                    }
                });
                organizedData[page.id] = pageData;
            });

            const response = await fetch(`/api/forms/${slug}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: organizedData,
                    respondentEmail,
                    respondentName,
                    startedAt: startTime.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            setSubmitted(true);
            toast.success('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
        if (errors[fieldId]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    const renderField = (field: FormField) => {
        const value = formData[field.id];
        const error = errors[field.id];
        const accentColor = form?.theme.accentColor || '#f97316';

        const fieldWrapper = (children: React.ReactNode) => (
            <div className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
                    {field.label}
                    {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.description && (
                    <p className="text-xs text-slate-500">{field.description}</p>
                )}
                {children}
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        {error}
                    </p>
                )}
            </div>
        );

        switch (field.type) {
            case 'short_answer':
            case 'short-text':
                return fieldWrapper(
                    <Input
                        id={field.id}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={cn(
                            'focus-visible:ring-2',
                            error && 'border-red-500'
                        )}
                        style={{ '--tw-ring-color': accentColor } as any}
                    />
                );

            case 'long_answer':
            case 'long-text':
                return fieldWrapper(
                    <Textarea
                        id={field.id}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className={cn(
                            'focus-visible:ring-2 resize-none',
                            error && 'border-red-500'
                        )}
                        style={{ '--tw-ring-color': accentColor } as any}
                    />
                );

            case 'email':
                return fieldWrapper(
                    <Input
                        id={field.id}
                        type="email"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || 'your@email.com'}
                        className={cn(
                            'focus-visible:ring-2',
                            error && 'border-red-500'
                        )}
                        style={{ '--tw-ring-color': accentColor } as any}
                    />
                );

            case 'phone':
                return fieldWrapper(
                    <Input
                        id={field.id}
                        type="tel"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || '+1 (555) 000-0000'}
                        className={cn(
                            'focus-visible:ring-2',
                            error && 'border-red-500'
                        )}
                        style={{ '--tw-ring-color': accentColor } as any}
                    />
                );

            case 'multiple_choice':
            case 'multiple-choice':
                return fieldWrapper(
                    <RadioGroup
                        value={value}
                        onValueChange={(val: string) => handleFieldChange(field.id, val)}
                    >
                        {field.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={option.value}
                                    id={`${field.id}-${option.id}`}
                                    style={{ color: accentColor } as any}
                                />
                                <Label
                                    htmlFor={`${field.id}-${option.id}`}
                                    className="font-normal cursor-pointer"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case 'checkboxes':
                return fieldWrapper(
                    <div className="space-y-2">
                        {field.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${field.id}-${option.id}`}
                                    checked={value?.[option.value] || false}
                                    onCheckedChange={(checked: boolean) =>
                                        handleFieldChange(field.id, {
                                            ...value,
                                            [option.value]: checked,
                                        })
                                    }
                                    style={{ borderColor: accentColor } as any}
                                />
                                <Label
                                    htmlFor={`${field.id}-${option.id}`}
                                    className="font-normal cursor-pointer"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                );

            case 'heading':
                return (
                    <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">
                        {field.label}
                    </h3>
                );

            case 'paragraph':
                return (
                    <p className="text-sm text-slate-600 mb-4">
                        {field.description || field.label}
                    </p>
                );

            case 'number':
                return fieldWrapper(
                    <Input
                        id={field.id}
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || '0'}
                        className={cn(
                            'focus-visible:ring-2',
                            error && 'border-red-500'
                        )}
                        style={{ '--tw-ring-color': accentColor } as any}
                    />
                );

            case 'date':
                return fieldWrapper(
                    <Input
                        id={field.id}
                        type="date"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={cn(
                            'focus-visible:ring-2',
                            error && 'border-red-500'
                        )}
                        style={{ '--tw-ring-color': accentColor } as any}
                    />
                );

            case 'dropdown':
                return fieldWrapper(
                    <select
                        id={field.id}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={cn(
                            'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                            error && 'border-red-500'
                        )}
                        style={{ '--tw-ring-color': accentColor } as any}
                    >
                        <option value="">Select an option...</option>
                        {field.options?.map((option) => (
                            <option key={option.id} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'rating':
                return fieldWrapper(
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleFieldChange(field.id, star.toString())}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <svg
                                    className={cn(
                                        'w-8 h-8 transition-colors',
                                        value && parseInt(value) >= star
                                            ? 'fill-current'
                                            : 'fill-none stroke-current'
                                    )}
                                    style={{
                                        color: value && parseInt(value) >= star
                                            ? accentColor
                                            : '#cbd5e1'
                                    }}
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </button>
                        ))}
                        {value && (
                            <span className="ml-2 text-sm text-slate-600">
                                {value} / 5
                            </span>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading form...</p>
                </div>
            </div>
        );
    }

    if (!form || error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Form Not Found</h2>
                        <p className="text-slate-600">
                            {error || "This form doesn't exist or has been unpublished."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="border-2" style={{ borderColor: form.theme.accentColor }}>
                        <CardContent className="pt-6 text-center">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ backgroundColor: `${form.theme.accentColor}20` }}
                            >
                                <CheckCircle2
                                    className="h-8 w-8"
                                    style={{ color: form.theme.accentColor }}
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Thank You!
                            </h2>
                            <p className="text-slate-600">
                                Your response has been recorded successfully.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const currentPage = currentPageIndex >= 0 ? form.pages[currentPageIndex] : null;
    const isLastPage = currentPageIndex === form.pages.length - 1;
    const progress = form.pages.length > 0
        ? ((currentPageIndex + 1) / form.pages.length) * 100
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {currentPageIndex >= 0 && (
                    <div className="mb-6">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: form.theme.accentColor }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            Page {currentPageIndex + 1} of {form.pages.length}
                        </p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {currentPageIndex === -1 && form.coverPage.showCover && (
                        <motion.div
                            key="cover"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="border-2" style={{ borderColor: form.theme.accentColor }}>
                                <CardContent className="pt-8 pb-6">
                                    {form.coverPage.imageUrl && (
                                        <img
                                            src={form.coverPage.imageUrl}
                                            alt="Form cover"
                                            className="w-full h-48 object-cover rounded-lg mb-6"
                                        />
                                    )}
                                    <div
                                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                        style={{ backgroundColor: `${form.theme.accentColor}20` }}
                                    >
                                        <Send
                                            className="h-8 w-8"
                                            style={{ color: form.theme.accentColor }}
                                        />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-3 text-center">
                                        {form.coverPage.title}
                                    </h1>
                                    {form.coverPage.description && (
                                        <p className="text-slate-600 text-center mb-6">
                                            {form.coverPage.description}
                                        </p>
                                    )}
                                    <Button
                                        onClick={handleNext}
                                        className="w-full"
                                        size="lg"
                                        style={{ backgroundColor: form.theme.accentColor }}
                                    >
                                        Start Form
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {currentPage && (
                        <motion.div
                            key={`page-${currentPageIndex}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card>
                                <CardContent className="pt-6 pb-6">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                            {currentPage.name}
                                        </h2>
                                        {currentPage.description && (
                                            <p className="text-slate-600">{currentPage.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        {currentPage.fields.map((field) => (
                                            <div key={field.id}>{renderField(field)}</div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 mt-8 pt-6 border-t">
                                        {(currentPageIndex > 0 || form.coverPage.showCover) && (
                                            <Button
                                                variant="outline"
                                                onClick={handlePrevious}
                                                className="gap-2"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                        )}
                                        <div className="flex-1" />
                                        {isLastPage ? (
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                                className="gap-2"
                                                style={{ backgroundColor: form.theme.accentColor }}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit
                                                        <Send className="h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleNext}
                                                className="gap-2"
                                                style={{ backgroundColor: form.theme.accentColor }}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mt-6">
                    <p className="text-xs text-slate-500">
                        Powered by Hotel Analytics Portal
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PublicFormPage;
