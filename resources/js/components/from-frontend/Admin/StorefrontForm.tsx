import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/Components/Button';
import { Input } from '@/Components/Input';
import { Label } from '@/Components/Label';
import { Switch } from '@/Components/Switch';
import { Textarea } from '@/Components/Textarea';
import { ColorPicker } from '@/Components/ColorPicker';

type StorefrontFormProps = {
  storefront?: {
    id?: number;
    name: string;
    slug: string;
    description: string;
    logo_url: string | null;
    banner_url: string | null;
    primary_color: string;
    secondary_color: string;
    is_active: boolean;
  };
  isEdit?: boolean;
};

export function StorefrontForm({ storefront, isEdit = false }: StorefrontFormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: storefront?.name || '',
    slug: storefront?.slug || '',
    description: storefront?.description || '',
    logo_url: storefront?.logo_url || '',
    banner_url: storefront?.banner_url || '',
    primary_color: storefront?.primary_color || '#4f46e5',
    secondary_color: storefront?.secondary_color || '#7c3aed',
    is_active: storefront?.is_active ?? true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (isEdit && storefront?.id) {
      put(route('admin.storefronts.update', storefront.id));
    } else {
      post(route('admin.storefronts.store'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
          <Label htmlFor="name" className="sm:mt-px sm:pt-2">
            Storefront Name <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              error={errors.name}
              required
            />
            {!isEdit && (
              <p className="mt-2 text-sm text-gray-500">
                This will be the display name of your storefront.
              </p>
            )}
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
          <Label htmlFor="slug" className="sm:mt-px sm:pt-2">
            URL Slug <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                yourstore.com/
              </span>
              <Input
                id="slug"
                value={data.slug}
                onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''))}
                error={errors.slug}
                className="rounded-l-none"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The URL-friendly version of the name. Only letters, numbers, and hyphens are allowed.
            </p>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
          <Label htmlFor="description" className="sm:mt-px sm:pt-2">
            Description
          </Label>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <Textarea
              id="description"
              rows={4}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              error={errors.description}
            />
            <p className="mt-2 text-sm text-gray-500">
              Brief description for your storefront. This will be visible to customers.
            </p>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
          <Label className="sm:mt-px sm:pt-2">Brand Colors</Label>
          <div className="mt-1 space-y-4 sm:col-span-2 sm:mt-0">
            <div className="flex items-center space-x-4">
              <Label htmlFor="primary_color" className="w-32">
                Primary Color
              </Label>
              <ColorPicker
                id="primary_color"
                value={data.primary_color}
                onChange={(color) => setData('primary_color', color)}
                className="h-10 w-16"
              />
              <Input
                id="primary_color"
                value={data.primary_color}
                onChange={(e) => setData('primary_color', e.target.value)}
                className="w-32 font-mono text-sm"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="secondary_color" className="w-32">
                Secondary Color
              </Label>
              <ColorPicker
                id="secondary_color"
                value={data.secondary_color}
                onChange={(color) => setData('secondary_color', color)}
                className="h-10 w-16"
              />
              <Input
                id="secondary_color"
                value={data.secondary_color}
                onChange={(e) => setData('secondary_color', e.target.value)}
                className="w-32 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
          <div className="sm:pt-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <p className="mt-1 text-sm text-gray-500">
              Displayed in the header of your store.
            </p>
          </div>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <Input
              id="logo_url"
              type="url"
              value={data.logo_url || ''}
              onChange={(e) => setData('logo_url', e.target.value)}
              error={errors.logo_url}
              placeholder="https://example.com/logo.png"
            />
            {data.logo_url && (
              <div className="mt-2">
                <div className="h-20 w-20 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={data.logo_url}
                    alt="Logo preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/80x80?text=Logo+Not+Found';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
          <div className="sm:pt-2">
            <Label htmlFor="banner_url">Banner URL</Label>
            <p className="mt-1 text-sm text-gray-500">
              Displayed at the top of your store.
            </p>
          </div>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <Input
              id="banner_url"
              type="url"
              value={data.banner_url || ''}
              onChange={(e) => setData('banner_url', e.target.value)}
              error={errors.banner_url}
              placeholder="https://example.com/banner.jpg"
            />
            {data.banner_url && (
              <div className="mt-2">
                <div className="h-32 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={data.banner_url}
                    alt="Banner preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x200?text=Banner+Not+Found';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-b sm:border-gray-200 sm:py-5">
          <div className="sm:pt-2">
            <Label htmlFor="is_active">Status</Label>
            <p className="mt-1 text-sm text-gray-500">
              Only active storefronts are visible to customers.
            </p>
          </div>
          <div className="mt-1 flex items-center sm:col-span-2 sm:mt-0">
            <Switch
              id="is_active"
              checked={data.is_active}
              onChange={(checked) => setData('is_active', checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-900">
              {data.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? 'Saving...' : isEdit ? 'Update Storefront' : 'Create Storefront'}
          </Button>
        </div>
      </div>
    </form>
  );
}
