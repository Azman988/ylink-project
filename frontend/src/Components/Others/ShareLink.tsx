import { CopyCheckIcon, CopyIcon, Share2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

interface ShareLinkProps {
    url: string;
    title: string;
    text?: string;
}

export const ShareLink: React.FC<ShareLinkProps> = ({ url, title, text = '' }) => {
    const {showToast} = useToast();
    const [copied, setCopied] = useState<boolean>(false);

    const handleShare = async (): Promise<void> => {
        showToast('Sharing link...');

        // Fallback check for mobile/native device sharing via Web Share API
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });

                showToast('Content shared successfully!', 'success');
                return;
            } catch (error) {
                console.error('Error sharing content:', error);
            }

            showToast('Sharing failed. Please try again.', 'error');
        }

        // Desktop fallback: Copy link directly to clipboard
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset state after 2 seconds
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`absolute top-4 right-4 p-2 rounded-lg cursor-pointer transition-colors font-medium text-sm transition-all duration-200 shadow-sm
            ${copied
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
                }`}
        >
            {copied ? (
                <>
                    <CopyCheckIcon className="w-4 h-4" />
                </>
            ) : (
                <>
                    {typeof window !== 'undefined' && typeof navigator.share === 'function' 
                        ? (<Share2Icon className="w-4 h-4" />) 
                        : (<CopyIcon className="w-4 h-4" />)
                    }
                </>
            )}
        </button>
    )
};
