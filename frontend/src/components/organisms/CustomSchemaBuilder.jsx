// src/components/organisms/CustomSchemaBuilder.jsx

import React from 'react';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import Button from '../atoms/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { presetFakeSchema } from '../../utils/fakeSchema';

const CustomSchemaBuilder = ({ schema, setSchema }) => {

    const handleAddField = () => {
        setSchema([...schema, { fieldName: '', fieldType: 'name' }]);
    };

    const handleRemoveField = (index) => {
        setSchema(schema.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index, event) => {
        const { name, value } = event.target;
        const newSchema = [...schema];
        newSchema[index][name] = value;
        setSchema(newSchema);
    };

    return (
        <div className="mt-6 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-primary-text mb-4">Custom Schema Builder</h3>
            <div className="space-y-4">
                {schema.map((field, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-2 bg-input rounded-md">
                        <div>
                            <Label htmlFor={`field-name-${index}`}>Field Name</Label>
                            <Input
                                id={`field-name-${index}`}
                                name="fieldName"
                                value={field.fieldName}
                                onChange={(e) => handleFieldChange(index, e)}
                                placeholder="e.g., customer_name"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`field-type-${index}`}>Field Type</Label>
                            <select
                                id={`field-type-${index}`}
                                name="fieldType"
                                value={field.fieldType}
                                onChange={(e) => handleFieldChange(index, e)}
                                className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md"
                            >
                                {presetFakeSchema.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => handleRemoveField(index)} variant="destructive" className="!p-2 mt-4">
                                <TrashIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Button onClick={handleAddField} variant="secondary" className="mt-4">
                <PlusIcon className="h-5 w-5 mr-2" /> Add Field
            </Button>
        </div>
    );
};

export default CustomSchemaBuilder;