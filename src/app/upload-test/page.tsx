"use client";

import React, { useState } from 'react';
import { supabaseStorageService } from '@/lib/supabaseStorageService';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const UploadTestPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [folder, setFolder] = useState('test-uploads');
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    if (!user?.id) {
      setError("User not logged in. Cannot upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`🚀 Starting upload test...`);
      console.log(`   File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      console.log(`   Folder: ${folder}`);
      console.log(`   User: ${user.id}`);

      const url = await supabaseStorageService.uploadImage(file, user.id, folder);
      
      setResult({
        url,
        fileName: file.name,
        fileSize: file.size,
        folder,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Upload successful!`);
      console.log(`   URL: ${url}`);
    } catch (err: any) {
      console.error("❌ Upload failed:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const folderOptions = [
    { value: 'test-uploads', label: 'Test Uploads' },
    { value: 'wishlist-covers', label: 'Wishlist Covers' },
    { value: 'wishlist-items', label: 'Wishlist Items' },
    { value: 'item-images', label: 'Item Images' },
    { value: 'General', label: 'General' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🖼️ AVIF Image Upload Test
            </h1>
            <p className="text-gray-600">
              Test the AVIF conversion and Supabase Storage upload system
            </p>
          </div>

          {/* Upload Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image File
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              {file && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <span className="mr-2">📷</span>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Folder
              </label>
              <select 
                value={folder} 
                onChange={(e) => setFolder(e.target.value)}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {folderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleUpload} 
              disabled={uploading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {uploading ? (
                <>
                  <span className="mr-2">⏳</span>
                  Uploading & Converting...
                </>
              ) : (
                <>
                  <span className="mr-2">📤</span>
                  Upload Image
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">⚠️</span>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Display */}
          {result && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start">
                <span className="text-green-400 mr-2 mt-0.5">✅</span>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800 mb-2">
                    Upload Successful! 🎉
                  </h3>
                  
                  <div className="space-y-2 text-sm text-green-700">
                    <div><strong>File:</strong> {result.fileName}</div>
                    <div><strong>Size:</strong> {(result.fileSize / 1024).toFixed(2)} KB</div>
                    <div><strong>Folder:</strong> {result.folder}</div>
                    <div><strong>Time:</strong> {new Date(result.timestamp).toLocaleString()}</div>
                  </div>

                  <div className="mt-4">
                    <strong className="text-green-800">Image URL:</strong>
                    <div className="mt-1 p-2 bg-white border rounded text-xs break-all">
                      {result.url}
                    </div>
                  </div>

                  <div className="mt-4">
                    <img 
                      src={result.url} 
                      alt="Uploaded" 
                      className="max-w-full h-auto max-h-64 mx-auto border rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">How to Test:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Select an image file (JPEG, PNG, etc.)</li>
              <li>• Choose a storage folder</li>
              <li>• Click "Upload Image"</li>
              <li>• Check the browser console for detailed logs</li>
              <li>• The system will automatically convert to AVIF if beneficial</li>
            </ul>
          </div>

          {/* Current Status */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Current Status:</h3>
            <div className="text-sm text-gray-700">
              <div><strong>Storage Mode:</strong> {process.env.NEXT_PUBLIC_USE_AVIF_STORAGE === 'true' ? 'AVIF + Supabase Storage' : 'Data URL (Legacy)'}</div>
              <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
              <div><strong>User:</strong> {user ? `${user.email || user.id}` : 'Not logged in'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTestPage;
