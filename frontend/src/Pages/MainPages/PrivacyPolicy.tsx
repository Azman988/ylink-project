import React from 'react';
import { Shield, Lock, Eye, FileText, Mail, MapPin } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    const lastUpdated = "June 3, 2026";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">

            {/* --- HEADER SECTION --- */}
            <div className="bg-slate-900 text-white pt-30 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-blue-400 text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
                        <Shield className="w-4 h-4" /> Data Protection
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        How YLink Tech collects, uses, and protects your personal information.
                    </p>
                </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 animate-fade-in-up duration-200">

                    <div className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">
                        <strong>Last Updated:</strong> {lastUpdated}
                    </div>

                    <div className="prose prose-slate max-w-none space-y-10">

                        {/* 1. Introduction */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <FileText className="w-6 h-6 text-blue-600" />
                                1. Introduction
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Welcome to YLink Tech. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website, purchase our tech hardware, book hardware repairs, or schedule solar installations.
                            </p>
                        </section>

                        {/* 2. Data We Collect */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <Eye className="w-6 h-6 text-amber-500" />
                                2. The Data We Collect About You
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                We may collect, use, store, and transfer different kinds of personal data about you, which we have grouped together as follows:
                            </p>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                    <span><strong>Identity Data:</strong> Includes first name, last name, and username.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                    <span><strong>Contact Data:</strong> Includes billing address, installation address (specifically for solar site assessments), email address, and telephone numbers.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                    <span><strong>Transaction Data:</strong> Includes details about payments to and from you, and other details of hardware, repairs, or solar services you have purchased from us.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                    <span><strong>Technical Property Data:</strong> Energy consumption estimates and property details provided specifically for custom inverter and solar panel quotes.</span>
                                </li>
                            </ul>
                        </section>

                        {/* 3. How We Use Data */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <Shield className="w-6 h-6 text-emerald-500" />
                                3. How We Use Your Personal Data
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <strong>Service Delivery:</strong> To register you as a new customer, process and deliver your tech hardware orders, manage device repairs, and execute solar installations at your premises.
                                </p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <strong>Customer Relationship:</strong> To manage our relationship with you, including notifying you about changes to our terms or privacy policy, and providing ongoing technical support.
                                </p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    <strong>Site Assessments:</strong> To dispatch our engineering team to your property in Ibadan and surrounding areas for accurate solar load assessments.
                                </p>
                            </div>
                        </section>

                        {/* 4. Data Security */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <Lock className="w-6 h-6 text-indigo-500" />
                                4. Data Security
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, and contractors (such as our installation engineers) who have a strict business need to know.
                            </p>
                        </section>

                        {/* 5. Contact Information */}
                        <section className="pt-6 border-t border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Contact Us
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                If you have any questions about this privacy policy or our privacy practices, please contact our support team. We value long-term customer relationships and are always happy to address your concerns.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Support</p>
                                        <a href="mailto:privacy@ylinktech.com" className="text-slate-900 font-medium hover:text-blue-600 transition-colors">privacy@ylinktech.com</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-red-600 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</p>
                                        <p className="text-slate-900 font-medium">27 Babalegba Street, Ibadan, Oyo State, Nigeria</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;