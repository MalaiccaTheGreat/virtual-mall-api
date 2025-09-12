import React, { useState } from 'react';
import { fal } from '@fal-ai/client';

// You can use a proxy to hide your API key
// but for this example we'll just use it directly
const FAL_KEY = "e83ab508-417b-4789-affe-eb68737a6952:ce38b547a0622d17b85f9e552127cc77";

fal.config({
  credentials: FAL_KEY,
});

export default function VirtualTryOn({ product }) {
  const [humanImage, setHumanImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(product.image_path);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleHumanImageChange = (e) => {
    setHumanImage(e.target.files[0]);
  };

  const generateTryOn = async () => {
    if (!humanImage) {
      setError('Please upload an image of a person.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const humanImageUrl = await fal.storage.upload(humanImage);

      const result = await fal.subscribe('fal-ai/cat-vton', {
        input: {
          human_image_url: humanImageUrl,
          garment_image_url: garmentImage,
          cloth_type: 'upper',
        },
        logs: true,
      });

      setResultImage(result.image.url);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Virtual Try-On</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <label htmlFor="human-image" className="block text-sm font-medium text-gray-700">
              Your Image
            </label>
            <input
              type="file"
              id="human-image"
              accept="image/*"
              onChange={handleHumanImageChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="garment-image" className="block text-sm font-medium text-gray-700">
              Garment Image
            </label>
            <img src={garmentImage} alt="Garment" className="w-full" />
          </div>
          <button
            onClick={generateTryOn}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Try-On'}
          </button>
        </div>
        <div>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {resultImage && (
            <div>
              <h3 className="text-xl font-bold mb-2">Result</h3>
              <img src={resultImage} alt="Virtual Try-On Result" className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
