import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import { getStoredToken } from '../../lib/auth';

interface ExportChatButtonProps {
    conversationId: string;
    className?: string;
}

const ExportChatButton: React.FC<ExportChatButtonProps> = ({ conversationId, className = '' }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleExport = async (format: 'pdf' | 'docx') => {
        if (!conversationId) {
            alert('No conversation to export. Please send at least one message first.');
            return;
        }

        setIsExporting(true);
        setShowMenu(false);

        try {
            const token = getStoredToken();
            console.log('[Export] Exporting conversation:', conversationId, 'as', format);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/chat/export/${conversationId}?format=${format}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `chat-export-${Date.now()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            console.log('[Export] Successfully exported chat');
        } catch (error: any) {
            console.error('[Export] Export failed:', error);
            console.error('[Export] Error response:', error.response);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to export chat. Please try again.';
            alert(errorMessage);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isExporting}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${isExporting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
                    } ${className}`}
                title="Export chat"
            >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {isExporting ? 'Exporting...' : 'Export'}
                </span>
            </button>

            {showMenu && !isExporting && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                        <div className="py-1">
                            <button
                                onClick={() => handleExport('pdf')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-red-500" />
                                <span>Export as PDF</span>
                            </button>
                            <button
                                onClick={() => handleExport('docx')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                                <span>Export as DOCX</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportChatButton;
