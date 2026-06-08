// ProductsManager.tsx
import React, { useState, useEffect } from 'react';
import { adminApi, type Product, } from '../../data/adminAPI';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, Loader2, X, PlusCircle, MinusCircle, UploadCloud } from 'lucide-react';

export default function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Product>({
        id: '', name: '', category: 'Smartphones', price: 0, shortDescription: '', fullDescription: '', type: 'retail', icon: '', inStock: true, features: [''], specifications: [{ label: '', value: '' }]
    });

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const data = await adminApi.getProducts();
        setProducts(data);
        setLoading(false);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (product?: Product) => {
        if (product) {
            setFormData(product);
            setIsEditing(true);
        } else {
            setFormData({
                id: `p${Math.floor(Math.random() * 10000)}`, name: '', category: 'Smartphones', price: 0, shortDescription: '', fullDescription: '', type: 'retail', icon: '', inStock: true, features: [''], specifications: [{ label: '', value: '' }]
            });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // The result is a Base64 encoded string of the image
                setFormData({ ...formData, icon: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        // Clean empty features/specs before saving
        const cleanedData = {
            ...formData,
            features: formData.features.filter(f => f.trim() !== ''),
            specifications: formData.specifications.filter(s => s.label.trim() !== '' && s.value.trim() !== '')
        };
        const updated = await adminApi.saveProduct(cleanedData);
        setProducts(updated);
        setShowModal(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product blueprint permanently?")) return;
        const updated = await adminApi.deleteProduct(id);
        setProducts(updated);
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Engineering</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage technical specifications and retail properties.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full lg:w-auto">
                    {/* Search Input Container */}
                    <div className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full sm:w-[320px] shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search products or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:font-normal"
                        />
                    </div>

                    <button onClick={() => openModal()} className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all shrink-0 cursor-pointer">
                        <Plus size={18} /> Add Product Configuration
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
                            <div className="h-40 bg-slate-100 relative border-b border-slate-200 overflow-hidden flex items-center justify-center group">
                                {product.icon ? (
                                    <img src={product.icon} alt={product.name} className="object-contain h-full w-full p-4 mix-blend-multiply" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-slate-300" />
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(product)} className="p-2 bg-white rounded-lg shadow-sm text-blue-600 hover:bg-blue-50 cursor-pointer"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-white rounded-lg shadow-sm text-rose-600 hover:bg-rose-50 cursor-pointer"><Trash2 size={16} /></button>
                                </div>
                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-slate-700">{product.category}</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-black text-slate-900 text-lg leading-tight">{product.name}</h3>
                                <p className="text-slate-500 text-xs mt-2 line-clamp-2">{product.shortDescription}</p>
                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <span className="text-xl font-black text-slate-900">₦{product.price.toLocaleString()}</span>
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {product.inStock ? 'In Stock' : 'Depleted'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comprehensive Editor Modal */}
            {showModal && (
                <div className="absolute inset-0 z-70 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="font-black text-slate-900 text-xl">{isEditing ? 'Edit Product Schema' : 'New Product Engine'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 cursor-pointer"><X size={20} /></button>
                        </div>

                        <div className="overflow-y-auto p-8 custom-scrollbar">
                            <form id="productForm" onSubmit={handleSave} className="space-y-8">
                                {/* Base Information */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Core Properties</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2">Display Name</label>
                                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">Price (₦)</label>
                                                <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">Category</label>
                                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none">
                                                    <option>Smartphones</option>
                                                    <option>Laptops</option>
                                                    <option>Accessories</option>
                                                    <option>Solar/Consultation</option>
                                                    <option>Repair</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 mb-2">Product Image Asset</label>
                                            <div className="flex items-center gap-4">
                                                <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                    />
                                                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                                    <span className="text-sm font-bold text-slate-600">Click to browse or drag image here</span>
                                                    <span className="text-[10px] font-medium text-slate-400 mt-1">Supports JPG, PNG, WEBP</span>
                                                </label>

                                                {/* Image Preview Window */}
                                                {formData.icon && (
                                                    <div className="relative w-32 h-32 rounded-xl border border-slate-200 overflow-hidden shrink-0 group">
                                                        <img src={formData.icon} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setFormData({ ...formData, icon: '' });
                                                            }}
                                                            className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-sm backdrop-blur-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Descriptions */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Content Schemas</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2">Short Subtitle Description</label>
                                            <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2">Full Technical Description</label>
                                            <textarea rows={4} value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all resize-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Arrays: Features & Specs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Features Array */}
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Key Features</h3>
                                            <button type="button" onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })} className="text-blue-600 hover:text-blue-700 cursor-pointer"><PlusCircle size={18} /></button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2">

                                                    <input type="text" value={feature} onChange={(e) => {
                                                        const newF = [...formData.features]; newF[idx] = e.target.value;
                                                        setFormData({ ...formData, features: newF });
                                                    }} className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder="e.g. Surge protection..." />

                                                    <button type="button" onClick={() => {
                                                        const newF = formData.features.filter((_, i) => i !== idx);
                                                        setFormData({ ...formData, features: newF.length ? newF : [''] });
                                                    }} className="text-slate-400 hover:text-rose-500 cursor-pointer"><MinusCircle size={18} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specifications Array */}
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Technical Specs</h3>
                                            <button type="button" onClick={() => setFormData({ ...formData, specifications: [...formData.specifications, { label: '', value: '' }] })} className="text-blue-600 hover:text-blue-700 cursor-pointer"><PlusCircle size={18} /></button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.specifications.map((spec, idx) => (
                                                <div key={idx} className="flex items-center gap-2">

                                                    <input type="text" value={spec.label} onChange={(e) => {
                                                        const newS = [...formData.specifications]; newS[idx].label = e.target.value;
                                                        setFormData({ ...formData, specifications: newS });
                                                    }} className="w-1/3 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-blue-500" placeholder="Label" />

                                                    <input type="text" value={spec.value} onChange={(e) => {
                                                        const newS = [...formData.specifications]; newS[idx].value = e.target.value;
                                                        setFormData({ ...formData, specifications: newS });
                                                    }} className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder="Value" />

                                                    <button type="button" onClick={() => {
                                                        const newS = formData.specifications.filter((_, i) => i !== idx);
                                                        setFormData({ ...formData, specifications: newS.length ? newS : [{ label: '', value: '' }] });
                                                    }} className="text-slate-400 hover:text-rose-500 cursor-pointer"><MinusCircle size={18} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 shrink-0">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">Cancel</button>
                            <button form="productForm" type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
                                {isEditing ? 'Commit Changes to Storage' : 'Provision New Pipeline Asset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}