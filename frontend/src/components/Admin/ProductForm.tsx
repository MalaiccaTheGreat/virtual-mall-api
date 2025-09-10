import { useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState, useCallback, useEffect } from 'react';
import { PageProps } from '@/types';
import { Button } from '@/Components/Button';
import { Input } from '@/Components/Input';
import { Label } from '@/Components/Label';
import { Switch } from '@/Components/Switch';
import { Textarea } from '@/Components/Textarea';
import { Select } from '@/Components/Select';
import { Badge } from '@/Components/Badge';
import { XMarkIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type ProductFormProps = {
  product?: {
    id?: number;
    name: string;
    description: string;
    category: string;
    price: number;
    sale_price: number | null;
    sku: string;
    barcode: string | null;
    is_featured: boolean;
    is_active: boolean;
    storefront_id: number | null;
    variations: Array<{
      id?: number;
      color: string;
      size: string;
      material: string | null;
      style: string | null;
      price: number;
      sale_price: number | null;
      stock_quantity: number;
      sku: string;
      barcode: string | null;
      is_default: boolean;
    }>;
  };
  storefronts: Array<{ id: number; name: string }>;
  categories: string[];
};

export function ProductForm({ product, storefronts, categories }: ProductFormProps) {
  const { csrf } = usePage<PageProps>().props;
  
  const { data, setData, post, put, processing, errors } = useForm({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price ? String(product.price) : '',
    sale_price: product?.sale_price ? String(product.sale_price) : '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
    storefront_id: product?.storefront_id ? String(product.storefront_id) : '',
    variations: product?.variations?.length 
      ? product.variations.map(v => ({
          ...v,
          price: String(v.price),
          sale_price: v.sale_price ? String(v.sale_price) : '',
          stock_quantity: v.stock_quantity,
          is_default: v.is_default,
        }))
      : [
          {
            color: '',
            size: '',
            material: '',
            style: '',
            price: '',
            sale_price: '',
            stock_quantity: 0,
            sku: '',
            barcode: '',
            is_default: true,
          },
        ],
    images: [],
    deleted_images: [],
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isGeneratingSKU, setIsGeneratingSKU] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Generate SKU from product name
  const generateSKU = useCallback(() => {
    if (!data.name || isGeneratingSKU) return;
    
    setIsGeneratingSKU(true);
    
    // Simple SKU generation - in a real app, you might want to check for uniqueness
    const baseSKU = data.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6);
    
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 random digits
    const sku = `${baseSKU}${randomSuffix}`;
    
    setData('sku', sku);
    
    // Also update SKU for variations if they don't have one
    if (data.variations.length === 1 && !data.variations[0].sku) {
      setData('variations', [
        {
          ...data.variations[0],
          sku: `${sku}-VAR`,
        },
      ]);
    }
    
    setIsGeneratingSKU(false);
  }, [data.name, data.variations, isGeneratingSKU, setData]);

  // Handle image upload preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviewImages: string[] = [];
    const newImages: File[] = [];

    Array.from(files).forEach((file) => {
      newPreviewImages.push(URL.createObjectURL(file));
      newImages.push(file);
    });

    setPreviewImages([...previewImages, ...newPreviewImages]);
    setData('images', [...data.images, ...newImages]);
  };

  const removeImage = (index: number) => {
    // If it's an existing image (has an ID), add to deleted_images
    if (product?.images?.[index]?.id) {
      setData('deleted_images', [...data.deleted_images, product.images[index].id]);
    }
    
    // Remove from preview and images
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
    
    const newImages = [...data.images];
    newImages.splice(index, 1);
    setData('images', newImages);
  };

  // Handle variation changes
  const handleVariationChange = (index: number, field: string, value: any) => {
    const variations = [...data.variations];
    variations[index] = { ...variations[index], [field]: value };
    setData('variations', variations);
  };

  // Add a new variation
  const addVariation = () => {
    setData('variations', [
      ...data.variations,
      {
        color: '',
        size: '',
        material: '',
        style: '',
        price: data.price || '',
        sale_price: data.sale_price || '',
        stock_quantity: 0,
        sku: data.sku ? `${data.sku}-VAR${data.variations.length + 1}` : '',
        barcode: '',
        is_default: false,
      },
    ]);
  };

  // Remove a variation
  const removeVariation = (index: number) => {
    if (data.variations.length <= 1) return; // Keep at least one variation
    
    const variations = [...data.variations];
    variations.splice(index, 1);
    setData('variations', variations);
  };

  // Set default variation
  const setDefaultVariation = (index: number) => {
    const variations = data.variations.map((v, i) => ({
      ...v,
      is_default: i === index,
    }));
    setData('variations', variations);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Prepare form data for file uploads
    const formData = new FormData();
    
    // Append all fields to formData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'variations') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'images') {
        // Append each image file
        value.forEach((file: File) => {
          formData.append('images[]', file);
        });
      } else if (key === 'deleted_images') {
        // Append each deleted image ID
        value.forEach((id: number) => {
          formData.append('deleted_images[]', id.toString());
        });
      } else {
        formData.append(key, value as string);
      }
    });
    
    // Add _method for PUT requests
    if (product?.id) {
      formData.append('_method', 'PUT');
    }
    
    // Submit the form
    const url = product?.id 
      ? route('admin.products.update', product.id)
      : route('admin.products.store');
      
    const method = product?.id ? 'post' : 'post';
    
    // @ts-ignore - Inertia's type definitions don't include formData
    this.$inertia.visit(url, {
      method,
      data: formData,
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        // Handle success
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['general', 'variations', 'media', 'seo'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="sku">
                  SKU <span className="text-red-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={generateSKU}
                  disabled={isGeneratingSKU}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  {isGeneratingSKU ? 'Generating...' : 'Generate'}
                </button>
              </div>
              <Input
                id="sku"
                value={data.sku}
                onChange={(e) => setData('sku', e.target.value)}
                error={errors.sku}
                required
              />
            </div>
            
            <div className="sm:col-span-6">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                error={errors.description}
              />
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                id="category"
                value={data.category}
                onChange={(e) => setData('category', e.target.value)}
                error={errors.category}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="storefront_id">Storefront</Label>
              <Select
                id="storefront_id"
                value={data.storefront_id}
                onChange={(e) => setData('storefront_id', e.target.value)}
                error={errors.storefront_id}
              >
                <option value="">No Storefront</option>
                {storefronts.map((storefront) => (
                  <option key={storefront.id} value={storefront.id}>
                    {storefront.name}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="barcode">Barcode (ISBN, UPC, etc.)</Label>
              <Input
                id="barcode"
                value={data.barcode || ''}
                onChange={(e) => setData('barcode', e.target.value)}
                error={errors.barcode}
              />
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="price">
                Base Price <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  id="price"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  error={errors.price}
                  min="0"
                  step="0.01"
                  className="pl-7"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="sale_price">Sale Price</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  id="sale_price"
                  value={data.sale_price || ''}
                  onChange={(e) => setData('sale_price', e.target.value)}
                  error={errors.sale_price}
                  min="0"
                  step="0.01"
                  className="pl-7"
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <div className="pt-6">
                <div className="flex items-center">
                  <Switch
                    id="is_featured"
                    checked={data.is_featured}
                    onChange={(checked) => setData('is_featured', checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="is_featured" className="flex items-center">
                    Featured Product
                  </Label>
                </div>
                
                <div className="mt-4 flex items-center">
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onChange={(checked) => setData('is_active', checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="is_active" className="flex items-center">
                    Active
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variations Tab */}
      {activeTab === 'variations' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              Variations let you offer different versions of the same product, like different sizes or colors. 
              Each variation can have its own SKU, price, and stock level.
            </p>
          </div>
          
          {data.variations.map((variation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {variation.is_default ? 'Default Variation' : `Variation #${index + 1}`}
                </h3>
                <div className="flex space-x-2">
                  {!variation.is_default && (
                    <button
                      type="button"
                      onClick={() => setDefaultVariation(index)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Set as Default
                    </button>
                  )}
                  {data.variations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove variation"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <Label htmlFor={`variation-color-${index}`}>Color</Label>
                  <Input
                    id={`variation-color-${index}`}
                    value={variation.color}
                    onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                    placeholder="e.g., Black, Red"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor={`variation-size-${index}`}>Size</Label>
                  <Input
                    id={`variation-size-${index}`}
                    value={variation.size}
                    onChange={(e) => handleVariationChange(index, 'size', e.target.value)}
                    placeholder="e.g., S, M, L, XL"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor={`variation-material-${index}`}>Material</Label>
                  <Input
                    id={`variation-material-${index}`}
                    value={variation.material || ''}
                    onChange={(e) => handleVariationChange(index, 'material', e.target.value)}
                    placeholder="e.g., Cotton, Leather"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor={`variation-price-${index}`}>
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      id={`variation-price-${index}`}
                      value={variation.price}
                      onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                      className="pl-7"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor={`variation-sale-price-${index}`}>Sale Price</Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      id={`variation-sale-price-${index}`}
                      value={variation.sale_price || ''}
                      onChange={(e) => handleVariationChange(index, 'sale_price', e.target.value)}
                      min="0"
                      step="0.01"
                      className="pl-7"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor={`variation-stock-${index}`}>
                    Stock Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    id={`variation-stock-${index}`}
                    value={variation.stock_quantity}
                    onChange={(e) => handleVariationChange(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <Label htmlFor={`variation-sku-${index}`}>
                    SKU <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`variation-sku-${index}`}
                    value={variation.sku}
                    onChange={(e) => handleVariationChange(index, 'sku', e.target.value)}
                    required
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <Label htmlFor={`variation-barcode-${index}`}>Barcode</Label>
                  <Input
                    id={`variation-barcode-${index}`}
                    value={variation.barcode || ''}
                    onChange={(e) => handleVariationChange(index, 'barcode', e.target.value)}
                  />
                </div>
              </div>
              
              {variation.is_default && (
                <div className="mt-2">
                  <Badge color="blue">Default Variation</Badge>
                  <p className="mt-1 text-xs text-gray-500">
                    This is the default variation that will be shown if no specific variation is selected.
                  </p>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addVariation}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Add Variation
            </button>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              Upload product images. The first image will be the main product image.
              You can drag and drop images or click to browse.
            </p>
          </div>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          
          {/* Image preview */}
          {previewImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Uploaded Images</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      title="Remove image"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Existing images */}
          {product?.images && product.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Current Images</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {product.images.map((image, index) => {
                  // Skip if this image is marked for deletion
                  if (data.deleted_images.includes(image.id)) return null;
                  
                  return (
                    <div key={image.id} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Remove image"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              Optimize your product for search engines. If left empty, the product name and description will be used.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={data.seo_title || ''}
                onChange={(e) => setData('seo_title', e.target.value)}
                maxLength={60}
                placeholder="Optimized title for search engines (recommended: 50-60 characters)"
              />
              <p className="mt-1 text-xs text-gray-500">
                {data.seo_title ? data.seo_title.length : 0} / 60 characters
              </p>
            </div>
            
            <div className="sm:col-span-6">
              <Label htmlFor="seo_description">Meta Description</Label>
              <Textarea
                id="seo_description"
                rows={3}
                value={data.seo_description || ''}
                onChange={(e) => setData('seo_description', e.target.value)}
                maxLength={160}
                placeholder="A short description of the product for search engines (recommended: 150-160 characters)"
              />
              <p className="mt-1 text-xs text-gray-500">
                {data.seo_description ? data.seo_description.length : 0} / 160 characters
              </p>
            </div>
            
            <div className="sm:col-span-6">
              <Label htmlFor="seo_keywords">Meta Keywords (Optional)</Label>
              <Input
                id="seo_keywords"
                value={data.seo_keywords || ''}
                onChange={(e) => setData('seo_keywords', e.target.value)}
                placeholder="Comma-separated keywords for search engines"
              />
              <p className="mt-1 text-xs text-gray-500">
                Example: t-shirt, cotton, summer, fashion
              </p>
            </div>
            
            <div className="sm:col-span-6">
              <Label htmlFor="slug">
                URL Slug <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  yourstore.com/products/
                </span>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  value={data.slug || ''}
                  onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''))}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                The URL-friendly version of the name. Only letters, numbers, and hyphens are allowed.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Form actions */}
      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : product?.id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  );
}
