/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// ImageUploader.js
import React from 'react';

const ImageUploader = ({ files, setFiles, handleImageSubmit, imageUploadError, uploading, handleRemoveImage, imageUrls }) => {
  return (
    <div className='flex flex-col gap-4'>
      <p className='font-semibold text-gray-800'>
        Images:
        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
      </p>
      <div className='flex gap-4'>
        <input
          onChange={(e) => setFiles(e.target.files)}
          className='p-3 border border-gray-300 rounded w-full'
          type='file'
          id='images'
          accept='image/*'
          multiple
        />
        <button
          type='button'
          disabled={uploading}
          onClick={handleImageSubmit}
          className='p-3 bg-[#6d4c7d] text-white rounded uppercase hover:bg-[#755AA6] disabled:opacity-80'
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      <p className='text-red-600 text-sm'>{imageUploadError}</p>
      {imageUrls.length > 0 && (
        <div className='flex flex-wrap gap-4 mt-4'>
          {imageUrls.map((url, index) => (
            <div key={url} className='flex flex-col items-center'>
              <img src={url} alt='listing' className='w-20 h-20 object-cover rounded-lg shadow' />
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='mt-2 text-red-600 hover:text-red-800'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
