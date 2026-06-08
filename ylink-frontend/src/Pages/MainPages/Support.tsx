import React, { useState } from 'react';
import {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    ChevronDown,
    Clock,
    HelpCircle
} from 'lucide-react';

// --- Static FAQ Data ---
const faqs = [
    {
        id: 'faq-1',
        question: 'How do I track my order delivery?',
        answer: 'Once your order shifts to the "Shipped" status, you will see a "Track Package" button in your Order History. Clicking it will provide real-time updates on your delivery routing.'
    },
    {
        id: 'faq-2',
        question: 'What is your hardware return policy?',
        answer: 'We offer a 7-day return window for factory-defective laptops and smartphones. The devices must be in their original packaging with all accessories intact.'
    },
    {
        id: 'faq-3',
        question: 'Do you offer a warranty on solar installations?',
        answer: 'Yes. All our Monocrystalline solar panels come with a 5-year warranty, and hybrid inverters are covered for 2 years. We also provide 2 months of free maintenance post-installation.'
    },
    {
        id: 'faq-4',
        question: 'How long does standard delivery take?',
        answer: 'Orders within Oyo State are delivered within 24-48 hours. Nationwide delivery across Nigeria typically takes 3-5 business days depending on the logistics route.'
    }
];

const Support: React.FC = () => {
    const [activeFaq, setActiveFaq] = useState<string | null>('faq-1');

    const toggleFaq = (id: string) => {
        setActiveFaq(prev => prev === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* --- Header Hero Section --- */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        How can we help you?
                    </h1>
                    <p className="text-slate-500 font-medium md:text-lg leading-relaxed">
                        Whether you need help tracking an order, claiming a warranty, or scheduling a solar installation, our support team is ready to assist.
                    </p>
                </div>

                {/* --- Quick Contact Cards --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
                    
                    {/* Phone (Click to dial) */}
                    <a href="tel:+2348100673097" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-blue-300 group cursor-pointer">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-1">Call Us</h3>
                        <p className="text-xs font-bold text-slate-400 mb-3">Mon-Sat, 8am to 6pm</p>
                        <p className="text-sm font-black text-blue-600">0810 0673 097</p>
                    </a>

                    {/* Email (Click to email) */}
                    <a href="mailto:yuppies3310@gmail.com" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-purple-300 group cursor-pointer">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-1">Email Us</h3>
                        <p className="text-xs font-bold text-slate-400 mb-3">Expect a reply within 2 hours</p>
                        <p className="text-sm font-black text-purple-600 truncate w-full">yuppies3310@gmail.com</p>
                    </a>

                    {/* Location */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-amber-300 group">
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-1">Visit Us</h3>
                        <p className="text-xs font-bold text-slate-400 mb-3">Walk-ins welcome</p>
                        <p className="text-sm font-bold text-amber-600 leading-tight">27 Babalegba Street, Eleyele Ibadan</p>
                    </div>

                    {/* Live WhatsApp Chat */}
                    <a href="https://wa.me/2348100673097" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-emerald-400 group cursor-pointer">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-1">Live Chat</h3>
                        <p className="text-xs font-bold text-slate-400 mb-3">Instant WhatsApp support</p>
                        <span className="text-sm font-black text-white bg-slate-900 px-5 py-2 rounded-xl group-hover:bg-emerald-500 transition-colors">
                            Start Chat
                        </span>
                    </a>
                </div>

                {/* --- FAQ Section --- */}
                <div className="max-w-3xl mx-auto">
                    
                    <div className="mb-8 flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center">
                            <HelpCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq) => {
                            const isOpen = activeFaq === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                                        isOpen ? 'bg-white border border-blue-200 shadow-md' : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'
                                    }`}
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer group"
                                    >
                                        <span className={`text-sm md:text-base font-black pr-4 transition-colors ${
                                            isOpen ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'
                                        }`}>
                                            {faq.question}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                            isOpen ? 'bg-blue-50' : 'bg-slate-50 group-hover:bg-blue-50'
                                        }`}>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                                                isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                                            }`} />
                                        </div>
                                    </button>

                                    {/* Collapsible Content */}
                                    <div className={`grid transition-all duration-300 ease-in-out ${
                                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                    }`}>
                                        <div className="overflow-hidden">
                                            <div className="px-5 sm:px-6 pb-6 pt-0 text-sm md:text-base font-medium text-slate-500 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Emergency Contact Banner */}
                    <div className="mt-8 p-6 bg-slate-900 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-slate-800 relative overflow-hidden">
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10 relative z-10">
                            <Clock className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-base font-black text-white">Need immediate emergency help?</h4>
                            <p className="text-sm text-slate-300 font-medium mt-1 leading-relaxed max-w-xl">
                                If your inquiry is regarding a solar installation emergency, please use our phone line to rapidly reach our support team.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Support;