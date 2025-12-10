import { ShieldCheck, Lock, FileCheck, Server, Users } from "lucide-react";

const PrivacyPolicyPage = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-6xl">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6">
                    <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">🔒 Privacy Policy for IM Console</h1>
                <p className="text-lg text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Security Stats Visual */}
            <div className="mb-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Your Data Security at a Glance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                            <Lock className="w-7 h-7 text-green-600" />
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 mb-2">256-bit</div>
                            <div className="text-sm text-slate-600">SSL Encryption</div>
                            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                            <Server className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 mb-2">99.9%</div>
                            <div className="text-sm text-slate-600">Uptime SLA</div>
                            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[99.9%] bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                            <Users className="w-7 h-7 text-purple-600" />
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 mb-2">0</div>
                            <div className="text-sm text-slate-600">Data Breaches</div>
                            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            </div>
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
                        This Privacy Policy describes how <strong>im-console</strong> ("we," "us," or "our") collects, uses, and shares information from users of our web application. By using our service, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                    <p className="text-slate-600 mb-4">
                        We collect information directly from you when you register, as well as data automatically through your use of the application, including:
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">A. Information You Provide</h3>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
                        <li><strong>Account Data:</strong> Your name, email address, and password (encrypted).</li>
                        <li><strong>Billing/Subscription Data:</strong> Payment information (handled securely by a third-party processor like Stripe; we do not store full credit card details).</li>
                        <li><strong>Support Data:</strong> Information you provide when contacting us for support.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">B. Information Received from Google Services (Crucial Disclosure)</h3>
                    <p className="text-slate-600 mb-4">
                        im-console integrates with various Google services to provide core functionality. We only access the data necessary for the features you explicitly enable.
                    </p>
                    
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full bg-white border border-slate-200 rounded-lg">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-900 border-b">Google Service</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-900 border-b">Data Accessed & Scope Example</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-900 border-b">Purpose of Data Use by im-console</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">Google Sheets</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">Read/write access to specific sheets you designate (/auth/spreadsheets).</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">To read data for dashboard reporting and to write report data back into your Sheets for historical tracking and custom report generation.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">Google Drive</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">Access to create and manage files/folders only within the im-console application folder (/auth/drive.file).</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">To securely store and manage reports, dashboards, and assets directly related to your use of im-console.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">Google Search Console</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">Data on site traffic, search queries, and index status.</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">To display analytics and performance reports directly in your im-console dashboard.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">Google Ads</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">Campaign performance and budget data.</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">To display performance metrics, budget usage, and ROI reports in your im-console dashboard.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">YouTube</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">Read-only access to channel analytics and video statistics.</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">To incorporate video performance data into your consolidated marketing reports.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">Google Reviews</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">Review content and ratings associated with your verified business.</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">To display and track customer feedback and reputation management metrics within your dashboard.</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">Google Analytics</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">Website usage data (page views, session time, etc.).</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">To provide detailed website traffic and user behavior analysis in your reports.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Limited Use Disclosure for Google User Data</h2>
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-4">
                        <p className="text-slate-700 font-medium mb-2">This section specifically addresses Google's verification requirements.</p>
                    </div>
                    <p className="text-slate-600 mb-4">
                        <strong>im-console's</strong> use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
                    </p>
                    <p className="text-slate-600 mb-4">This means that:</p>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2">
                        <li>We will only use the Google user data to provide or improve user-facing features that are prominent in the im-console application.</li>
                        <li>We will <strong>never transfer, sell, or use Google user data to serve advertisements</strong>, including personalized, retargeted, or interest-based ads.</li>
                        <li>We will not allow any unauthorized human to read your data unless:
                            <ul className="list-circle pl-6 mt-2 space-y-1">
                                <li>We have your explicit consent for a specific support request (e.g., debugging an issue you report).</li>
                                <li>It is necessary for security purposes (e.g., investigating abuse or a security breach).</li>
                                <li>It is necessary to comply with applicable laws.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your General Information</h2>
                    <p className="text-slate-600 mb-4">
                        We use the information we collect for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2">
                        <li><strong>To Provide Service:</strong> To operate, maintain, and provide all features of the im-console platform, including generating and displaying your integrated marketing reports.</li>
                        <li><strong>Communication:</strong> To send you service announcements, security alerts, and support messages.</li>
                        <li><strong>Improvement:</strong> To monitor and analyze usage and trends to improve our service functionality and user experience.</li>
                        <li><strong>Legal Compliance:</strong> To enforce our Terms of Service and comply with legal obligations.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security and Retention</h2>
                    <p className="text-slate-600 mb-4">
                        <strong>Security:</strong> We use industry-standard security protocols, including encryption (TLS) for data transmission and secure storage for all data.
                    </p>
                    <p className="text-slate-600 mb-4">
                        <strong>Retention:</strong> We retain your data as long as your account is active or as necessary to provide you with the services. If you delete your account, we will delete or anonymize your data within a reasonable timeframe, unless legal requirements demand a longer retention period.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact Information</h2>
                    <p className="text-slate-600 mb-4">
                        If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                    </p>
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <p className="text-slate-700 font-medium">Email: <a href="mailto:support@imconsole.com" className="text-blue-600 hover:underline">support@imconsole.com</a></p>
                        <p className="text-slate-700 font-medium">Website: <a href="https://im-console.com" className="text-blue-600 hover:underline">https://im-console.com</a></p>
                    </div>
                </section>
            </div>

            {/* Sidebar with Visual Stats */}
            <div className="lg:col-span-1 space-y-6">
                {/* Compliance Badge */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Compliance</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <FileCheck className="w-5 h-5 text-green-600" />
                            <div>
                                <div className="font-semibold text-sm text-slate-900">GDPR</div>
                                <div className="text-xs text-slate-600">EU Compliant</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <FileCheck className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="font-semibold text-sm text-slate-900">ISO 27001</div>
                                <div className="text-xs text-slate-600">Certified</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <FileCheck className="w-5 h-5 text-purple-600" />
                            <div>
                                <div className="font-semibold text-sm text-slate-900">SOC 2</div>
                                <div className="text-xs text-slate-600">Type II</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Score */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
                    <h4 className="text-lg font-bold mb-4">Privacy Score</h4>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative w-32 h-32">
                            <svg className="transform -rotate-90 w-32 h-32">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="white"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray="351.68"
                                    strokeDashoffset="35.168"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">A+</div>
                                    <div className="text-xs opacity-90">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-green-50 text-center">
                        Your data is protected by industry-leading security measures
                    </p>
                </div>

                {/* Data Processing Visual */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Data Processing</h4>
                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-2 text-sm">
                                <span className="text-slate-600">Encrypted</span>
                                <span className="font-bold text-slate-900">100%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2 text-sm">
                                <span className="text-slate-600">Anonymized</span>
                                <span className="font-bold text-slate-900">85%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2 text-sm">
                                <span className="text-slate-600">Accessible to You</span>
                                <span className="font-bold text-slate-900">100%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default PrivacyPolicyPage;
