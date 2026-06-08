import { ArrowRightLeft, Calendar, CheckCircle2, Clock, Cpu, Laptop, Loader2, Mail, Phone, Smartphone, User } from "lucide-react";
import { useState } from "react";
import { getTodayString, timeOptions } from "../SharedUtils/Others";
import CustomSelect from "../SharedUtils/CustomSelect";

const RepairLogForm = () => {
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', deviceModel: '',
        deviceCategory: 'laptop', issue: '', date: '', time: 'morning'
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        try {
            const response = await fetch('/api/submit-consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'Device Repair', ...formData })
            });

            if (!response.ok) throw new Error('API routing not configured yet');
            setFormStatus('success');
        } catch (error) {
            const subject = encodeURIComponent(`New Repair Ticket: ${formData.deviceModel} - ${formData.name}`);
            const body = encodeURIComponent(
                `New Device Repair Request\n\n` +
                `--- Client Information ---\n` +
                `Name: ${formData.name}\n` +
                `Email: ${formData.email}\n` +
                `Phone: ${formData.phone}\n\n` +
                `--- Device Details ---\n` +
                `Category: ${formData.deviceCategory}\n` +
                `Model: ${formData.deviceModel}\n\n` +
                `Issue Description:\n${formData.issue}\n\n` +
                `--- Appointment Schedule ---\n` +
                `Drop-off Date: ${formData.date}\n` +
                `Drop-off Time: ${formData.time}\n`
            );
            window.location.href = `mailto:support@ylink.com?subject=${subject}&body=${body}`;
            setTimeout(() => setFormStatus('success'), 800);
        }
    };

    const groupStyles = {
        input: "w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all",
        label: "text-sm font-bold text-slate-700 flex items-center gap-2",
        button: "w-full h-14 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white font-extrabold text-lg rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
    }; 

    return (
        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {formStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ticket Generated!</h2>
                    <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                        Thank you, {formData.name.split(' ')[0] || 'there'}. Your repair request has been logged. Please bring your device in at your selected time.
                    </p>
                    <button onClick={() => setFormStatus('idle')} className="w-full max-w-sm py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                        Submit Another Device
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Log a Repair Ticket</h2>
                        <p className="text-slate-500">Provide your device details to fast-track your workshop visit.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={groupStyles.label}><User className="w-4 h-4 text-slate-400" /> Full Name</label>

                                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className={groupStyles.input} placeholder="e.g. Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className={groupStyles.label}>
                                    <Mail className="w-4 h-4 text-slate-400" /> Email Address
                                </label>

                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={groupStyles.input} placeholder="jane@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={groupStyles.label}><Phone className="w-4 h-4 text-slate-400" /> Phone Number</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={groupStyles.input} placeholder="080..." />
                            </div>
                            <div className="space-y-2">
                                <label className={groupStyles.label}><Cpu className="w-4 h-4 text-slate-400" /> Device Model</label>
                                <input required type="text" name="deviceModel" value={formData.deviceModel} onChange={handleInputChange} className={groupStyles.input} placeholder="e.g. MacBook Pro M1, iPhone 13" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-100">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">Device Category</label>

                                <div className="grid grid-cols-2 gap-3">

                                    <button type="button" onClick={() => handleSelectChange('deviceCategory', 'laptop')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${formData.deviceCategory === 'laptop' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        <Laptop className="w-4 h-4" /> PC / Mac
                                    </button>

                                    <button type="button" onClick={() => handleSelectChange('deviceCategory', 'phone')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${formData.deviceCategory === 'phone' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        <Smartphone className="w-4 h-4" /> Mobile
                                    </button>

                                </div>

                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={groupStyles.label}>Issue Description</label>
                            <textarea required name="issue" value={formData.issue} onChange={handleInputChange} rows={3} className={`${groupStyles.input} resize-none`} placeholder="Please describe the problem you are experiencing..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div className="space-y-2">
                                <label className={groupStyles.label}><Calendar className="w-4 h-4 text-slate-400" /> Drop-off Date</label>
                                <input required type="date" min={getTodayString()} name="date" value={formData.date} onChange={handleInputChange} className={`${groupStyles.input} text-slate-700`} />
                            </div>
                            <div className="space-y-2 z-10">
                                <label className={groupStyles.label}><Clock className="w-4 h-4 text-slate-400" /> Drop-off Time</label>
                                <CustomSelect
                                    options={timeOptions}
                                    value={formData.time}
                                    onChange={(val) => handleSelectChange('time', val)}
                                    placeholder="Select drop-off time"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={formStatus === 'submitting'} className={groupStyles.button}>
                                {formStatus === 'submitting' ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Ticket...</> : <>Log Repair Ticket <ArrowRightLeft className="w-5 h-5" /></>}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}

export default RepairLogForm;