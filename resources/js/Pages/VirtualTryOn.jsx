import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Button from '../components/Button';
import Layout from '../components/Layout';

export default function VirtualTryOn({ products }) {
  const [currentSession, setCurrentSession] = useState(null);
  const [modelType, setModelType] = useState('3d_model');
  const [selectedItems, setSelectedItems] = useState({});
  const [bodyMeasurements, setBodyMeasurements] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    shoe_size: ''
  });
  const [userPhoto, setUserPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const clothingCategories = {
    'top': 'Tops',
    'bottom': 'Bottoms', 
    'shoes': 'Shoes',
    'accessories': 'Accessories',
    'full_outfit': 'Complete Outfits'
  };

  const createTryOnSession = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('model_type', modelType);
    formData.append('body_measurements', JSON.stringify(bodyMeasurements));

    if (userPhoto) {
      formData.append('user_photo', userPhoto);
    }

    try {
      const response = await fetch('/api/try-on/session', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSession(data.session_id);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToTryOn = async (product, category, size = null, colorVariant = null) => {
    if (!currentSession) {
      await createTryOnSession();
      return;
    }

    try {
      const response = await fetch('/api/try-on/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          session_id: currentSession,
          product_id: product.id,
          clothing_category: category,
          size: size,
          color_variant: colorVariant
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedItems(prev => ({
          ...prev,
          [category]: data.item
        }));
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItemFromTryOn = async (category, itemId) => {
    try {
      const response = await fetch('/api/try-on/remove-item', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          session_id: currentSession,
          item_id: itemId
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedItems(prev => {
          const updated = { ...prev };
          delete updated[category];
          return updated;
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const addAllToCart = async () => {
    if (!currentSession || Object.keys(selectedItems).length === 0) return;

    try {
      const response = await fetch('/api/try-on/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          session_id: currentSession
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`${data.items_added} items added to cart successfully!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserPhoto(file);
    }
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => 
      product.clothing_category === category || 
      (category === 'full_outfit' && product.clothing_category)
    );
  };

  return (
    <Layout>
      <Head title="Virtual Try-On - Pulse & Threads Virtual Mall" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg border-t-4" style={{ borderTopColor: '#FFD700' }}>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="/assets/Logo.jpeg" 
                  alt="Pulse & Threads Logo" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>
                    Virtual Try-On Experience
                  </h1>
                  <p style={{ color: '#FFD700' }} className="text-lg">
                    Try before you buy with Pulse & Threads
                  </p>
                </div>
              </div>

          {/* Model Selection */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Choose Your Model</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="3d_model"
                    name="model_type"
                    value="3d_model"
                    checked={modelType === '3d_model'}
                    onChange={(e) => setModelType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="3d_model" className="text-lg">3D Avatar Model</label>
                </div>

                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="user_photo"
                    name="model_type"
                    value="user_photo"
                    checked={modelType === 'user_photo'}
                    onChange={(e) => setModelType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="user_photo" className="text-lg">Upload Your Photo</label>
                </div>

                {modelType === 'user_photo' && (
                  <div className="ml-8">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                )}
              </div>

              {/* Body Measurements */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Body Measurements (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.height}
                      onChange={(e) => setBodyMeasurements(prev => ({...prev, height: e.target.value}))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.weight}
                      onChange={(e) => setBodyMeasurements(prev => ({...prev, weight: e.target.value}))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chest (cm)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.chest}
                      onChange={(e) => setBodyMeasurements(prev => ({...prev, chest: e.target.value}))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Waist (cm)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.waist}
                      onChange={(e) => setBodyMeasurements(prev => ({...prev, waist: e.target.value}))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hips (cm)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.hips}
                      onChange={(e) => setBodyMeasurements(prev => ({...prev, hips: e.target.value}))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Shoe Size</label>
                    <input
                      type="number"
                      value={bodyMeasurements.shoe_size}
                      onChange={(e) => setBodyMeasurements(prev => ({...prev, shoe_size: e.target.value}))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={createTryOnSession}
                disabled={loading || (modelType === 'user_photo' && !userPhoto)}
                className="w-full md:w-auto"
              >
                {loading ? 'Creating Session...' : 'Start Try-On Session'}
              </Button>
            </div>
          </div>

          {/* Try-On Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Virtual Model/Photo Display */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Virtual Model</h2>
                <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg flex items-center justify-center min-h-96">
                  {currentSession ? (
                    <div className="text-center">
                      {modelType === '3d_model' ? (
                        <div className="space-y-4">
                          <div className="w-64 h-80 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg mx-auto flex items-center justify-center">
                            <span className="text-gray-600">3D Avatar Model</span>
                          </div>
                          {Object.keys(selectedItems).length > 0 && (
                            <div className="text-sm text-gray-600">
                              Currently trying on: {Object.keys(selectedItems).join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userPhoto && (
                            <img 
                              src={URL.createObjectURL(userPhoto)} 
                              alt="User uploaded photo"
                              className="max-w-64 max-h-80 object-contain rounded-lg mx-auto"
                            />
                          )}
                          {Object.keys(selectedItems).length > 0 && (
                            <div className="text-sm text-gray-600">
                              Items overlaid: {Object.keys(selectedItems).join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Create a try-on session to start</p>
                  )}
                </div>

                {/* Selected Items Summary */}
                {Object.keys(selectedItems).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Currently Trying On</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedItems).map(([category, item]) => (
                        <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{item.product.name}</span>
                            <span className="text-gray-500 ml-2">({clothingCategories[category]})</span>
                            <span className="text-green-600 font-semibold ml-2">${item.product.price}</span>
                          </div>
                          <button
                            onClick={() => removeItemFromTryOn(category, item.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      onClick={addAllToCart}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    >
                      Add All to Cart (${Object.values(selectedItems).reduce((sum, item) => sum + parseFloat(item.product.price), 0).toFixed(2)})
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Clothing Categories and Products */}
            <div className="space-y-6">
              {Object.entries(clothingCategories).map(([category, displayName]) => {
                const categoryProducts = getProductsByCategory(category);

                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category} className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-3">{displayName}</h3>
                    <div className="space-y-3">
                      {categoryProducts.map(product => (
                        <div key={product.id} className="border rounded p-3">
                          <div className="flex items-start space-x-3">
                            <img 
                              src={product.image_path} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{product.name}</h4>
                              <p className="text-green-600 font-semibold">${product.price}</p>

                              {/* Size Selection */}
                              {product.available_sizes && product.available_sizes.length > 0 && (
                                <select className="mt-2 text-xs border rounded px-2 py-1">
                                  <option value="">Select Size</option>
                                  {product.available_sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                              )}

                              <button
                                onClick={() => addItemToTryOn(product, category)}
                                disabled={!currentSession}
                                className="mt-2 w-full text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                Try On
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </Layout>
  );
}