import { FileText, CheckCircle2, AlertTriangle, Scale, BookOpen, Shield } from "lucide-react";

const TermsOfServicePage = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-6xl">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6">
                    <FileText className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">📜 Terms of Service for IM Console</h1>
                <p className="text-lg text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Terms Overview Visual */}
            <div className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Service Agreement Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                            <CheckCircle2 className="w-7 h-7 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-2">14 Days</div>
                        <div className="text-sm text-slate-600">Free Trial Period</div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="text-xs text-green-600 font-semibold">No Credit Card</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                            <Scale className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-2">100%</div>
                        <div className="text-sm text-slate-600">Fair Usage Policy</div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="text-xs text-blue-600 font-semibold">Transparent</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                            <Shield className="w-7 h-7 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-2">24/7</div>
                        <div className="text-sm text-slate-600">Legal Support</div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="text-xs text-purple-600 font-semibold">Available</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
                        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto">
                            <BookOpen className="w-7 h-7 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-2">30 Days</div>
                        <div className="text-sm text-slate-600">Cancellation Notice</div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="text-xs text-orange-600 font-semibold">Flexible</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Main Content */}
                <div className="lg:col-span-2 prose prose-slate prose-lg max-w-none">
                <section className="mb-10">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                        <p className="text-slate-700 leading-relaxed">
                            <strong className="text-blue-900">Effective Date:</strong> {new Date().toLocaleDateString()}<br />
                            <strong className="text-blue-900">Website:</strong> <a href="https://im-console.com" className="text-blue-600 hover:underline">https://im-console.com</a>
                        </p>
                    </div>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                        Welcome to <strong>im-console</strong>. These Terms of Service ("Terms") govern your use of our web application and services ("Service"). By accessing or using the Service, you agree to be bound by these Terms.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-slate-600 mb-4">
                        By creating an account, logging in, or using the Service, you confirm that you have read, understood, and agree to these Terms. If you do not agree, you must not use the Service.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Changes to Terms</h2>
                    <p className="text-slate-600 mb-4">
                        We may update these Terms periodically. We will notify you of any material changes by posting the new Terms on our website or through the Service. Your continued use of the Service after the effective date of the revised Terms constitutes your acceptance of the changes.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Account and Access</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-3">
                        <li>
                            <strong>Eligibility:</strong> You must be at least 18 years old or the age of majority in your jurisdiction to use the Service.
                        </li>
                        <li>
                            <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                        </li>
                        <li>
                            <strong>Accuracy of Information:</strong> You agree to provide current, complete, and accurate information during registration and keep it updated.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Responsibilities and Acceptable Use</h2>
                    <p className="text-slate-600 mb-4">You agree not to use the Service to:</p>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2">
                        <li>Violate any local, state, national, or international law or regulation.</li>
                        <li>Engage in any form of fraudulent or illegal activity.</li>
                        <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                        <li>Attempt to gain unauthorized access to the Service or its related systems.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Google API Services Integration</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-3">
                        <li>
                            <strong>Authorization:</strong> By connecting your Google accounts (including Google Sheets, Drive, Analytics, Search Console, Ads, and YouTube) to im-console, you authorize us to access, use, and store your data from those services strictly as necessary to provide the features of im-console (as detailed in our Privacy Policy).
                        </li>
                        <li>
                            <strong>Compliance:</strong> Your use of our Service in connection with Google APIs is also governed by the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>.
                        </li>
                        <li>
                            <strong>Revocation:</strong> You can revoke im-console's access to your Google accounts at any time through your Google Security Settings page or by deleting your im-console account.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-3">
                        <li>
                            <strong>Service Ownership:</strong> The Service, including its features, functionality, and original content, are and will remain the exclusive property of im-console and its licensors.
                        </li>
                        <li>
                            <strong>Your Data:</strong> You retain all ownership rights to the data you upload or connect via Google APIs (Your Data). You grant im-console a limited, non-exclusive license to use, host, store, and process Your Data solely to provide the Service to you.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Fees and Payment (If Applicable)</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-3">
                        <li>
                            <strong>Subscription:</strong> Access to certain features of the Service may require a paid subscription. You agree to pay all applicable fees and taxes associated with your account.
                        </li>
                        <li>
                            <strong>Billing:</strong> Payments are billed on a recurring basis (e.g., monthly or annually). Failure to pay may result in the suspension or termination of your account access.
                        </li>
                        <li>
                            <strong>Refunds:</strong> We offer a 30-day money-back guarantee for new subscribers. After 30 days, fees are non-refundable.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Termination</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-3">
                        <li>
                            <strong>By You:</strong> You may terminate these Terms by canceling your subscription and discontinuing all use of the Service.
                        </li>
                        <li>
                            <strong>By Us:</strong> We may terminate or suspend your access immediately, without prior notice or liability, if you breach these Terms (especially Section 4 or 5).
                        </li>
                        <li>
                            <strong>Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease, and we will delete or anonymize your data as outlined in our Privacy Policy.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Disclaimer of Warranties</h2>
                    <p className="text-slate-600 mb-4">
                        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation or availability of the Service, or the accuracy, reliability, or completeness of any data or reports generated. We do not warrant that the Service will be uninterrupted, secure, or error-free.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Limitation of Liability</h2>
                    <p className="text-slate-600 mb-4">
                        To the fullest extent permitted by applicable law, in no event shall im-console be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from: (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Indemnification</h2>
                    <p className="text-slate-600 mb-4">
                        You agree to defend, indemnify, and hold harmless im-console and its affiliates, directors, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms; or (iii) your violation of any third-party right, including without limitation any intellectual property or privacy right.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law and Jurisdiction</h2>
                    <p className="text-slate-600 mb-4">
                        These Terms shall be governed and construed in accordance with the applicable laws, without regard to conflict of law provisions. You agree to submit to the jurisdiction of the courts to resolve any legal matter arising from these Terms.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Information</h2>
                    <p className="text-slate-600 mb-4">
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <p className="text-slate-700 font-medium">Email: <a href="mailto:support@imconsole.com" className="text-blue-600 hover:underline">support@imconsole.com</a></p>
                        <p className="text-slate-700 font-medium">Website: <a href="https://im-console.com" className="text-blue-600 hover:underline">https://im-console.com</a></p>
                    </div>
                </section>
            </div>

            {/* Sidebar with Visual Stats */}
            <div className="lg:col-span-1 space-y-6">
                {/* Key Terms Visual */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Key Highlights</h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-900 mb-1">Fair Pricing</div>
                                <div className="text-xs text-slate-600">No hidden fees or charges</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-900 mb-1">Data Ownership</div>
                                <div className="text-xs text-slate-600">Your data belongs to you</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-900 mb-1">Service Uptime</div>
                                <div className="text-xs text-slate-600">99.9% guaranteed SLA</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-900 mb-1">Easy Cancellation</div>
                                <div className="text-xs text-slate-600">Cancel anytime, no penalty</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Statistics */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
                    <h4 className="text-lg font-bold mb-4">Service Reliability</h4>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-50">Uptime</span>
                                <span className="font-bold">99.98%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '99.98%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-50">Response Time</span>
                                <span className="font-bold">95%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '95%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-50">Customer Satisfaction</span>
                                <span className="font-bold">98%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/20 text-center">
                        <div className="text-2xl font-bold mb-1">500+</div>
                        <div className="text-xs text-blue-50">Hotels Trust Us</div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 rounded-2xl p-6 shadow-lg border border-amber-200">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <div>
                            <h4 className="text-lg font-bold text-amber-900 mb-2">Important Notice</h4>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Please read these terms carefully before using our service. By using IM Console, you agree to be bound by these terms.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-xs text-amber-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-amber-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            <span>Effective from date of acceptance</span>
                        </div>
                    </div>
                </div>

                {/* Contact for Legal */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Legal Questions?</h4>
                    <p className="text-sm text-slate-600 mb-4">
                        Our legal team is here to help clarify any terms or conditions.
                    </p>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-700">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>legal@imconsole.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>24/7 Support Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default TermsOfServicePage;
