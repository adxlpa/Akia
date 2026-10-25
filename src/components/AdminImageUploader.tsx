import React, { useState, useRef } from 'react';
import { uploadImageToSupabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'categories' | 'general';
  hint?: string;
  required?: boolean;
}

export const AdminImageUploader: React.FC<AdminImageUploaderProps> = ({
  label,
  value,
  onChange,
  folder = 'products',
  hint,
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(!value || value.startsWith('http') || value.startsWith('/images/'));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    // Validate type (strictly safe raster images, rejecting SVG to prevent script execution)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a safe raster image file (PNG, JPG, WebP, AVIF, or GIF). SVG files are not permitted for security.');
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit. Please compress or choose a smaller photo.');
      return;
    }

    setIsUploading(true);

    try {
      if (isSupabaseConfigured()) {
        const result = await uploadImageToSupabase(file, folder);
        if (result.success && result.publicUrl) {
          onChange(result.publicUrl);
          setUploadSuccess('Uploaded to Supabase CDN! Live immediately for all visitors.');
          setShowManualUrl(false);
        } else {
          // Provide actionable error and fallback to local preview
          setUploadError(result.error || 'Upload to Supabase Storage failed.');
          readLocalFileFallback(file);
        }
      } else {
        // Fallback to local Data URL when Supabase is not yet configured
        readLocalFileFallback(file);
        setUploadSuccess('Loaded local preview. Connect Supabase in "Supabase Cloud" to host permanently for everyone.');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      setUploadError('Image processing failed. Please verify the file is a valid image (JPEG, PNG, WebP) under 10MB.');
      readLocalFileFallback(file);
    } finally {
      setIsUploading(false);
    }
  };

  const readLocalFileFallback = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const isSupabaseHosted = Boolean(value && value.includes('supabase.co'));
  const isDataUrl = Boolean(value && value.startsWith('data:image/'));
  const isLocalAsset = Boolean(value && value.startsWith('/images/'));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block uppercase text-black font-medium text-xs font-mono">
          {label} {required && <span className="text-[#8B261D]">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[10px] text-[#747878] hover:text-black uppercase underline transition-colors"
        >
          {showManualUrl ? 'Hide URL field' : 'Enter URL manually'}
        </button>
      </div>

      {hint && <p className="text-[11px] text-[#747878] leading-tight">{hint}</p>}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Dropzone & Preview Container */}
      <div className="space-y-3">
        {value ? (
          <div className="relative border border-[#E5E5E5] bg-[#fafafa] p-3 flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview Thumbnail */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-white border border-[#E5E5E5] flex items-center justify-center overflow-hidden">
              <img
                src={value}
                alt="Product preview"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Image Metadata & Controls */}
            <div className="flex-1 min-w-0 space-y-2 w-full text-left">
              <div className="flex flex-wrap items-center gap-1.5">
                {isSupabaseHosted && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-medium border border-emerald-200">
                    <span className="material-symbols-outlined text-[12px]">cloud_done</span>
                    Supabase CDN (Public to Everyone)
                  </span>
                )}
                {isLocalAsset && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-[#5e5e5e] text-[10px] font-mono border border-neutral-200">
                    <span className="material-symbols-outlined text-[12px]">inventory_2</span>
                    Local Catalog Asset
                  </span>
                )}
                {isDataUrl && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-mono border border-amber-200">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    Local Preview (Sync to Supabase Storage recommended)
                  </span>
                )}
                {!isSupabaseHosted && !isLocalAsset && !isDataUrl && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-[#5e5e5e] text-[10px] font-mono border border-neutral-200">
                    <span className="material-symbols-outlined text-[12px]">link</span>
                    External URL
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono text-[#5e5e5e] truncate max-w-full">
                {value.length > 60 ? `${value.slice(0, 58)}...` : value}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-white border border-[#E5E5E5] hover:border-black text-[11px] font-mono uppercase tracking-wider text-black flex items-center gap-1 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">sync</span>
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setUploadSuccess(null);
                    setUploadError(null);
                  }}
                  className="px-3 py-1 border border-transparent hover:border-red-300 text-red-600 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Dropzone */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-black bg-neutral-100'
                : 'border-[#D5D5D5] hover:border-black bg-[#fafafa] hover:bg-white'
            }`}
          >
            {isUploading ? (
              <div className="py-3 flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[28px] animate-spin text-[#8B261D]">
                  progress_activity
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-black">
                  Uploading to Supabase CDN...
                </span>
                <span className="text-[11px] text-[#747878] font-sans">
                  Deploying to global storage bucket for all website visitors
                </span>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black mb-1">
                  <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                </div>
                <div className="text-xs font-mono font-medium text-black uppercase tracking-wider">
                  Click to Upload or Drag & Drop Product Photo
                </div>
                <p className="text-[11px] font-sans text-[#747878]">
                  Supports JPG, PNG, WebP up to 10MB • Auto-syncs to Supabase CDN
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Status Feedback */}
        {uploadSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">
              check_circle
            </span>
            <span className="flex-1 leading-snug">{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono space-y-2">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">
                warning
              </span>
              <div className="flex-1 space-y-1">
                <span className="font-semibold block text-amber-900">{uploadError}</span>
                <span className="text-[11px] text-[#444] block font-sans">
                  The bucket <strong>product-images</strong> hasn't been created in your Supabase project yet. Create it in 20 seconds:
                </span>
              </div>
            </div>

            <div className="bg-white p-2.5 border border-amber-200 space-y-1.5 font-sans text-[11px]">
              <div className="font-mono text-[11px] font-bold text-black uppercase">
                How to create bucket in Supabase (10 seconds):
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[#333]">
                <li>Open your <strong>Supabase Dashboard</strong> (supabase.com).</li>
                <li>Click <strong>Storage</strong> in the left menu (bucket icon).</li>
                <li>Click <strong>New Bucket</strong> (top right).</li>
                <li>Name it: <code className="bg-neutral-100 px-1 py-0.5 font-mono text-[#8B261D] font-bold">product-images</code></li>
                <li>Toggle <span className="font-bold text-emerald-800">Public bucket</span> to <strong>ON</strong> (so everyone can see photos).</li>
                <li>Click <strong>Save bucket</strong>.</li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const sql = `INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');`;
                  navigator.clipboard.writeText(sql);
                  alert('Storage SQL copied to clipboard! Paste it into Supabase -> SQL Editor -> Run.');
                }}
                className="px-2.5 py-1 bg-white border border-amber-300 hover:border-black text-[10px] font-mono uppercase tracking-wider text-black flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[13px]">content_copy</span>
                Copy SQL for Supabase Editor
              </button>
            </div>
          </div>
        )}


        {/* Manual URL Input (Collapsible) */}
        {showManualUrl && (
          <div className="pt-2">
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://... or /images/products/..."
                className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs font-mono focus:outline-none focus:border-black"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="absolute right-2.5 top-2.5 text-[#747878] hover:text-black"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-[#747878] font-mono mt-1">
              Direct CDN or local path URL. Changing this directly updates the database column.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
