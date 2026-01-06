import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Download,
    Eye,
    Trash2,
    Calendar,
    User,
    Mail,
    Clock,
    FileText,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FormSubmission {
    _id: string;
    data: Record<string, any>;
    respondentEmail?: string;
    respondentName?: string;
    completedAt: string;
    ipAddress?: string;
    userAgent?: string;
}

interface FormTemplate {
    _id: string;
    name: string;
    description?: string;
    slug: string;
    publishedUrl?: string;
    submissionCount: number;
    viewCount: number;
    pages?: Array<{
        id: string;
        name: string;
        fields: Array<{
            id: string;
            label: string;
            type: string;
        }>;
    }>;
}

const FormResponsesPage = () => {
    const { projectId, templateId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<FormTemplate | null>(null);
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    useEffect(() => {
        loadFormAndSubmissions();
    }, [projectId, templateId]);

    const loadFormAndSubmissions = async () => {
        try {
            setLoading(true);

            const formResponse = await fetch(
                `/api/projects/${projectId}/forms/${templateId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('ha_dashboard_token') || sessionStorage.getItem('ha_dashboard_token')}`,
                    },
                }
            );

            if (!formResponse.ok) {
                throw new Error('Failed to load form');
            }

            const formData = await formResponse.json();
            setForm(formData);

            const submissionsResponse = await fetch(
                `/api/projects/${projectId}/forms/${templateId}/submissions`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('ha_dashboard_token') || sessionStorage.getItem('ha_dashboard_token')}`,
                    },
                }
            );

            if (!submissionsResponse.ok) {
                throw new Error('Failed to load submissions');
            }

            const submissionsData = await submissionsResponse.json();
            setSubmissions(submissionsData.submissions || []);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load form responses');
        } finally {
            setLoading(false);
        }
    };

    const handleViewSubmission = (submission: FormSubmission) => {
        setSelectedSubmission(submission);
        setShowDetailDialog(true);
    };

    const handleDeleteSubmission = async (submissionId: string) => {
        if (!confirm('Are you sure you want to delete this response?')) {
            return;
        }

        try {
            const response = await fetch(
                `/api/projects/${projectId}/forms/${templateId}/submissions/${submissionId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('ha_dashboard_token') || sessionStorage.getItem('ha_dashboard_token')}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete submission');
            }

            toast.success('Response deleted successfully');
            loadFormAndSubmissions();
        } catch (error) {
            console.error('Error deleting submission:', error);
            toast.error('Failed to delete response');
        }
    };

    const handleExportCSV = () => {
        if (submissions.length === 0) {
            toast.error('No responses to export');
            return;
        }

        const allKeys = new Set<string>();
        submissions.forEach((sub) => {
            Object.keys(sub.data).forEach((key) => allKeys.add(key));
        });

        const headers = [
            'Submission ID',
            'Name',
            'Email',
            'Submitted At',
            ...Array.from(allKeys),
        ];

        const rows = submissions.map((sub) => {
            const row = [
                sub._id,
                sub.respondentName || 'N/A',
                sub.respondentEmail || 'N/A',
                new Date(sub.completedAt).toLocaleString(),
            ];

            allKeys.forEach((key) => {
                const value = sub.data[key];
                if (typeof value === 'object') {
                    row.push(JSON.stringify(value));
                } else {
                    row.push(value || '');
                }
            });

            return row;
        });

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form?.name || 'form'}-responses-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success('Responses exported successfully');
    };

    const handleCopyLink = () => {
        if (form?.publishedUrl) {
            navigator.clipboard.writeText(form.publishedUrl);
            toast.success('Form link copied to clipboard!');
        }
    };

    const filteredSubmissions = submissions.filter((sub) => {
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        return (
            sub.respondentName?.toLowerCase().includes(searchLower) ||
            sub.respondentEmail?.toLowerCase().includes(searchLower) ||
            JSON.stringify(sub.data).toLowerCase().includes(searchLower)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
                    <p className="text-slate-600">Loading responses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/dashboard/${projectId}/templates`)}
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Templates
                    </Button>
                    <div className="h-8 w-px bg-slate-300" />
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{form?.name}</h1>
                            <p className="text-xs text-slate-500">Form Responses</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Copy Form Link
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCSV}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {form?.submissionCount || 0}
                                        </p>
                                        <p className="text-xs text-slate-500">Total Responses</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-xl">
                                        <Eye className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {form?.viewCount || 0}
                                        </p>
                                        <p className="text-xs text-slate-500">Form Views</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-100 rounded-xl">
                                        <Clock className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {form?.viewCount && form?.submissionCount
                                                ? Math.round((form.submissionCount / form.viewCount) * 100)
                                                : 0}
                                            %
                                        </p>
                                        <p className="text-xs text-slate-500">Completion Rate</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">All Responses</CardTitle>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search responses..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 w-64"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredSubmissions.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        No responses yet
                                    </h3>
                                    <p className="text-slate-500 mb-4">
                                        Share your form to start collecting responses
                                    </p>
                                    <Button onClick={handleCopyLink} className="gap-2">
                                        <FileText className="h-4 w-4" />
                                        Copy Form Link
                                    </Button>
                                </div>
                            ) : (
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Respondent</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Submitted At</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSubmissions.map((submission, index) => (
                                                <motion.tr
                                                    key={submission._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="group hover:bg-slate-50"
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                                <User className="h-4 w-4 text-orange-600" />
                                                            </div>
                                                            <span className="font-medium">
                                                                {submission.respondentName || 'Anonymous'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Mail className="h-4 w-4" />
                                                            {submission.respondentEmail || 'N/A'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(submission.completedAt).toLocaleDateString()}
                                                            <span className="text-xs text-slate-400">
                                                                {new Date(submission.completedAt).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                            Completed
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewSubmission(submission)}
                                                                className="gap-1"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteSubmission(submission._id)}
                                                                className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Response Details</DialogTitle>
                    </DialogHeader>
                    {selectedSubmission && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Respondent</p>
                                    <p className="font-medium text-slate-900">
                                        {selectedSubmission.respondentName || 'Anonymous'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Email</p>
                                    <p className="font-medium text-slate-900">
                                        {selectedSubmission.respondentEmail || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Submitted At</p>
                                    <p className="font-medium text-slate-900">
                                        {new Date(selectedSubmission.completedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">IP Address</p>
                                    <p className="font-medium text-slate-900">
                                        {selectedSubmission.ipAddress || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-900">Form Responses</h4>
                                {form && Object.entries(selectedSubmission.data).map(([pageId, pageData]: [string, any]) => {
                                    const page = form.pages?.find((p: any) => p.id === pageId);
                                    if (!page || !pageData) return null;

                                    return Object.entries(pageData).map(([fieldId, fieldValue]: [string, any]) => {
                                        const field = page.fields?.find((f: any) => f.id === fieldId);
                                        const fieldLabel = field?.label || fieldId;

                                        // Skip displaying email and name fields if they're already shown above
                                        if (field?.type === 'email' ||
                                            (field?.label && (
                                                field.label.toLowerCase().includes('name') ||
                                                field.label.toLowerCase().includes('username')
                                            ))) {
                                            return null;
                                        }

                                        // Format the value based on type
                                        let displayValue: string;
                                        if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
                                            displayValue = 'No response';
                                        } else if (typeof fieldValue === 'object') {
                                            // Handle checkbox responses
                                            if (field?.type === 'checkboxes') {
                                                const selected = Object.entries(fieldValue)
                                                    .filter(([_, checked]) => checked)
                                                    .map(([option]) => option);
                                                displayValue = selected.length > 0 ? selected.join(', ') : 'None selected';
                                            } else {
                                                displayValue = JSON.stringify(fieldValue, null, 2);
                                            }
                                        } else {
                                            displayValue = String(fieldValue);
                                        }

                                        return (
                                            <div key={`${pageId}-${fieldId}`} className="p-4 bg-white border border-slate-200 rounded-lg hover:border-orange-300 transition-colors">
                                                <p className="text-sm font-medium text-slate-700 mb-2">{fieldLabel}</p>
                                                <p className="text-base text-slate-900 whitespace-pre-wrap break-words">
                                                    {displayValue}
                                                </p>
                                            </div>
                                        );
                                    });
                                })}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FormResponsesPage;
