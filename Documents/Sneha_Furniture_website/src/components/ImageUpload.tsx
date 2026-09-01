'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({ 
  value = [], 
  onChange 
}: { 
  value: string[], 
  onChange: (urls: string[]) => void 
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      alert("Cloudinary is not configured. Falling back to placeholder image.");
      onChange([...value, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80']);
      return;
    }

    setIsUploading(true);

    try {
      // 1. Get secure signature from our backend
      const sigRes = await fetch('/api/upload', { method: 'POST' });
      const { timestamp, signature } = await sigRes.json();

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', 'sneha_furniture');

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await uploadRes.json();
      if (data.secure_url) {
        onChange([...value, data.secure_url]);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative w-24 h-24 rounded-sm overflow-hidden border border-gray-200">
            <img src={url} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition">
          {isUploading ? (
            <span className="text-xs font-medium">Uploading...</span>
          ) : (
            <>
              <Upload size={20} className="mb-1" />
              <span className="text-xs font-medium">Upload</span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleUpload} 
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
