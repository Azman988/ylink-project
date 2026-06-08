import React from 'react';
import { FileText, ShieldAlert, Scale, AlertTriangle, Truck, HelpCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
    const lastUpdated = "June 3, 2026";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">

            {/* --- HEADER SECTION --- */}
            <div className="bg-slate-900 text-white pt-30 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-blue-400 text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
                        <Scale className="w-4 h-4" /> Legal Agreement
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Please read these terms carefully before using our platform or booking our services.
                    </p>
                </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                    <div className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">
                        <strong>Last Updated:</strong> {lastUpdated}
                    </div>

                    <div className="prose prose-slate max-w-none space-y-10">

                        {/* 1. Acceptance of Terms */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <FileText className="w-6 h-6 text-blue-600" />
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                By accessing our website, purchasing retail technology hardware, booking diagnostic/repair services, or requesting a solar energy installation assessment, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must refrain from using our services.
                            </p>
                        </section>

                        {/* 2. Hardware Sales & Delivery */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <Truck className="w-6 h-6 text-amber-500" />
                                2. Hardware Sales, Shipping, & Warranties
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                YLink Tech retails premium computing workstations, smartphones, and peripheral equipment.
                            </p>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
                                    <span><strong>Pricing & Availability:</strong> All prices listed are subject to market changes. We reserve the right to modify prices or discontinue items without notice.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
                                    <span><strong>Delivery Timelines:</strong> Standard local distribution within Ibadan and Oyo State occurs within 24 to 48 hours. Nationwide logistics are handled via trusted third-party partners and timeline dynamics may vary.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
                                    <span><strong>Hardware Warranty:</strong> Retailed hardware items include a 1-year limited warranty protecting strictly against factory or structural component defects. Damage from drops, water, or unauthorized tampering voids this protection completely.</span>
                                </li>
                            </ul>
                        </section>

                        {/* 3. Repair Services & Device Liability */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <ShieldAlert className="w-6 h-6 text-emerald-500" />
                                3. Repair & Maintenance Declarations
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                When dropping off or shipping technical assets to YLink Tech for board-level repairs or component recovery:
                            </p>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 text-slate-700 text-sm leading-relaxed">
                                <p>
                                    <strong>Data Protection Clause:</strong> Customers bear sole responsibility for backup copies of their local storage arrays before handover. YLink Tech accepts absolutely no liability for data corruption, file systems erasure, or software asset losses incurred during structural component interventions.
                                </p>
                                <p>
                                    <strong>Abandoned Hardware Policy:</strong> Devices completely processed or deemed unrepairable must be claimed within 60 days following our completion alert. Unclaimed infrastructure after this threshold may be liquidized to cover operational workbench expenses.
                                </p>
                            </div>
                        </section>

                        {/* 4. Solar Installations & Site Assessments */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-indigo-500" />
                                4. Solar & Alternative Energy Commitments
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Our alternative energy engineering division requires structured property physical access to deploy site-specific power grids. Property evaluation requests mean you confirm you hold explicit title rights or legal permissions to modify the respective building framework. Initial structural quotes are calculated based on data insights available during evaluation and can shift if underlying wiring anomalies surface during deployment.
                            </p>
                        </section>

                        {/* 5. Limitation of Liability */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                5. Limitation of Liability
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                YLink Tech, its management, and technical personnel shall under no conditions be held responsible for indirect, accidental, or exceptional operational blockages resulting from third-party utility failures, erratic local grid surges damaging customer systems, or natural climatic events impacting deployed renewable installations.
                            </p>
                        </section>

                        {/* 6. Clarifications & Questions */}
                        <section className="pt-6 border-t border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-blue-600" /> Questions Regarding Our Terms?
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                We believe in long-term customer friendliness and completely open professional relationships. If you have any inquiries regarding these standard operational boundaries, connect directly with our administration.
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                                Email: <a href="mailto:legal@ylinktech.com" className="text-blue-600 hover:underline">legal@ylinktech.com</a>
                            </p>
                        </section>

                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}} />
        </div>
    );
};

export default TermsOfService;