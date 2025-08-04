import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Label from '@/components/Label';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        logo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.stores.store'));
    };

    return (
        <Layout>
            <Head title="Admin - Create Store" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-bold">Create Store</h1>
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
                                    <Label forInput="logo" value="Logo" />
                                    <Input
                                        type="file"
                                        name="logo"
                                        className="mt-1 block w-full"
                                        handleChange={(e) => setData('logo', e.target.files[0])}
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
