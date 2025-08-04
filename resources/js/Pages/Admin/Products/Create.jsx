import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Label from '@/components/Label';

export default function Create({ stores }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        price_kwacha: '',
        store_id: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <Layout>
            <Head title="Admin - Create Product" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-bold">Create Product</h1>
                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <Label forInput="name" value="Name" />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        handleChange={(e) => setData('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label forInput="description" value="Description" />
                                    <textarea
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label forInput="price" value="Price (USD)" />
                                    <Input
                                        type="number"
                                        name="price"
                                        value={data.price}
                                        className="mt-1 block w-full"
                                        handleChange={(e) => setData('price', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label forInput="price_kwacha" value="Price (ZMW)" />
                                    <Input
                                        type="number"
                                        name="price_kwacha"
                                        value={data.price_kwacha}
                                        className="mt-1 block w-full"
                                        handleChange={(e) => setData('price_kwacha', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label forInput="store_id" value="Store" />
                                    <select
                                        name="store_id"
                                        value={data.store_id}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('store_id', e.target.value)}
                                    >
                                        <option value="">Select a store</option>
                                        {stores.map((store) => (
                                            <option key={store.id} value={store.id}>
                                                {store.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label forInput="image" value="Image" />
                                    <Input
                                        type="file"
                                        name="image"
                                        className="mt-1 block w-full"
                                        handleChange={(e) => setData('image', e.target.files[0])}
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <Button className="ml-4" processing={processing}>
                                        Create
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
