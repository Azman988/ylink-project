import React, { useState, useEffect } from 'react';
import { adminApi, type Product } from '../../api/adminAPI';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, Loader2, X, PlusCircle, MinusCircle, UploadCloud } from 'lucide-react';
import { currency, formatPriceWithCurrency } from '../../utils/money';

const CATEGORIES = [
    'Laptops',
    'Smartphones',
    'Accessories',
    'Solar',
    'Inverters',
    'Cameras',
] as const;

export default function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal & Form State
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const initialFormState: Product = {
        _id: '',
        name: '',
        slug: '',
        overview: '',
        description: '',
        price: 0,
        dPrice: undefined,
        category: CATEGORIES[0],
        stockQuantity: 10,
        images: [],
        features: [''],
        specifications: [{ label: '', value: '' }],
        isActive: true
    };

    const [formData, setFormData] = useState<Product>(initialFormState);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (product?: Product) => {
        // Clear any previously selected raw files
        setImageFiles([]);

        if (product) {
            setFormData({
                _id: product._id || '',
                name: product.name || '',
                slug: product.slug || '',
                overview: product.overview || '',
                description: product.description || '',
                price: product.price ?? 0,
                dPrice: product.dPrice ?? undefined,
                category: product.category || CATEGORIES[0],
                stockQuantity: product.stockQuantity ?? 0,
                images: product.images ? [...product.images] : [],
                features: product.features && product.features.length > 0 ? [...product.features] : [''],
                specifications: product.specifications && product.specifications.length > 0
                    ? product.specifications.map(s => ({ ...s }))
                    : [{ label: '', value: '' }],
                isActive: product.isActive ?? true,
            });
            setIsEditing(true);
        } else {
            setFormData(initialFormState);
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        // Append new raw File objects for FormData submission
        setImageFiles((prev) => [...prev, ...newFiles]);

        // Create fast local Blob object URLs for immediate preview in UI
        const newPreviews = newFiles.map((file) => ({
            url: URL.createObjectURL(file),
        }));

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newPreviews],
        }));

        // Reset input so uploading the same file again triggers onChange
        e.target.value = '';
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
        setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // Handle product save
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();

        // Append standard scalar fields
        if (isEditing && formData._id) {
            data.append('_id', formData._id);
        }
        data.append('name', formData.name);
        data.append('slug', formData.slug || generateSlug(formData.name));
        data.append('overview', formData.overview);
        data.append('description', formData.description);
        data.append('price', String(formData.price));
        if (formData.dPrice !== undefined) data.append('dPrice', String(formData.dPrice));
        data.append('category', formData.category);
        data.append('stockQuantity', String(formData.stockQuantity));
        data.append('isActive', String(formData.isActive));

        // Clean empty entries and serialize arrays/objects
        const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
        const cleanedSpecs = formData.specifications.filter(s => s.label.trim() !== '' && s.value.trim() !== '');
        data.append('features', JSON.stringify(cleanedFeatures));
        data.append('specifications', JSON.stringify(cleanedSpecs));

        // Preserve existing saved Cloudinary images (exclude temporary blob preview URLs)
        const existingImages = formData.images.filter(img => img.url && !img.url.startsWith('blob:'));
        data.append('existingImages', JSON.stringify(existingImages));

        // Append binary file objects for Multer upload field 'images'
        imageFiles.forEach((file) => {
            data.append('images', file);
        });

        try {
            await adminApi.saveProduct(data);
            await fetchProducts();
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save product:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    // Handle product delete
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product blueprint permanently?")) return;
        try {
            await adminApi.deleteProduct(id);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Product Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage technical specifications and retail properties.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full lg:w-auto">
                    <div className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full sm:w-[320px] shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search products or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:font-normal"
                        />
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all shrink-0 cursor-pointer"
                    >
                        <Plus size={18} /> Add New Product
                    </button>
                </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
                            <div className="h-[180px] bg-slate-100 relative border-b border-slate-200 overflow-hidden flex items-center justify-center group">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="object-cover h-full w-full"
                                        onError={(e) => (e.currentTarget.src = './camera.avif')}
                                    />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-slate-300" />
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(product)}
                                        className="p-2 bg-white rounded-lg shadow-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
                                    >
                                        <Edit2 size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 bg-white rounded-lg shadow-sm text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-xs">
                                    {product.category}
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-black text-slate-900 text-lg leading-tight">
                                    {product.name}
                                </h3>
                                <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                                    {product.overview || product.slug}
                                </p>
                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <span className={product.dPrice ? 'text-xs text-rose-500 font-bold line-through' : 'text-xl font-black text-slate-900'}>
                                            {formatPriceWithCurrency(product.price)}
                                        </span>
                                        {product.dPrice ? (
                                            <span className="text-xl font-black text-slate-900">
                                                {formatPriceWithCurrency(product.dPrice)}
                                            </span>
                                        ) : null}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${product.stockQuantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : 'Depleted'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comprehensive Editor Modal */}
            {showModal && (
                <div className="fixed top-10 z-50 inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="font-black text-slate-900 text-xl">
                                {isEditing ? 'Edit Product' : 'Create New Product'}
                            </h2>

                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isSaving}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 cursor-pointer disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-8 custom-scrollbar">
                            <form id="productForm" onSubmit={handleSave} className="space-y-8">
                                {/* Base Information */}
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">
                                                    Slug (Auto-generated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    readOnly
                                                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-mono outline-none cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">
                                                    Product Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => {
                                                        const newName = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            name: newName,
                                                            slug: generateSlug(newName)
                                                        });
                                                    }}
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">
                                                    Price ({currency})
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={formData.price || ''}
                                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-2">
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={formData.stockQuantity ?? ''}
                                                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                                Discount Price (Optional)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.dPrice ?? ''}
                                                onChange={(e) => setFormData({ ...formData, dPrice: e.target.value ? Number(e.target.value) : undefined })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>

                                        {/* Category Select Dropdown */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                                Category
                                            </label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                                            >
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Product Images */}
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                                Product Images
                                            </label>
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <label className="flex-1 min-w-[200px] flex flex-col items-center justify-center px-4 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                    />
                                                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                                    <span className="text-sm font-bold text-slate-600">
                                                        Click to browse files
                                                    </span>
                                                    <span className="text-[10px] font-medium text-slate-400 mt-1">
                                                        Supports JPG, PNG, WEBP
                                                    </span>
                                                </label>

                                                {/* Image Previews */}
                                                {formData.images?.map((img, idx) => (
                                                    <div key={idx} className="relative w-28 h-28 rounded-xl border border-slate-200 overflow-hidden shrink-0 group">
                                                        <img src={img.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute inset-0 bg-slate-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs backdrop-blur-xs cursor-pointer"
                                                        >
                                                            Remove
                                                        </button>
                                                        {idx === 0 && (
                                                            <div className="absolute bottom-0 w-full py-0.5 text-[10px] text-white bg-blue-600/90 text-center font-bold tracking-wider uppercase">
                                                                Main
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Descriptions */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
                                        Content Schemas
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                                Overview
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.overview}
                                                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                                Full Technical Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Arrays: Features & Specs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Features Array */}
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                                Key Features
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                                                className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                            >
                                                <PlusCircle size={18} />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={feature}
                                                        onChange={(e) => {
                                                            const newF = [...formData.features];
                                                            newF[idx] = e.target.value;
                                                            setFormData({ ...formData, features: newF });
                                                        }}
                                                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                                        placeholder="e.g. Pure Sine Wave output..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newF = formData.features.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, features: newF.length ? newF : [''] });
                                                        }}
                                                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                                                    >
                                                        <MinusCircle size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specifications Array */}
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                                Technical Specs
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, specifications: [...formData.specifications, { label: '', value: '' }] })}
                                                className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                            >
                                                <PlusCircle size={18} />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.specifications.map((spec, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={spec.label}
                                                        onChange={(e) => {
                                                            const newS = [...formData.specifications];
                                                            newS[idx] = { ...newS[idx], label: e.target.value };
                                                            setFormData({ ...formData, specifications: newS });
                                                        }}
                                                        className="w-1/3 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-blue-500"
                                                        placeholder="Label"
                                                    />

                                                    <input
                                                        type="text"
                                                        value={spec.value}
                                                        onChange={(e) => {
                                                            const newS = [...formData.specifications];
                                                            newS[idx] = { ...newS[idx], value: e.target.value };
                                                            setFormData({ ...formData, specifications: newS });
                                                        }}
                                                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                                        placeholder="Value"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newS = formData.specifications.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, specifications: newS.length ? newS : [{ label: '', value: '' }] });
                                                        }}
                                                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                                                    >
                                                        <MinusCircle size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 shrink-0">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isSaving}
                                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                form="productForm"
                                type="submit"
                                disabled={isSaving}
                                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isEditing ? 'Commit Changes' : 'Create Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}