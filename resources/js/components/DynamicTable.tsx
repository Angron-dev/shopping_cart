import React from "react";

interface Column<T> {
    header: string;
    key: keyof T | string;
    render?: (row: T) => React.ReactNode;
}

interface DynamicTableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey?: (row: T) => string | number;
}

export default function DynamicTable<T extends { id: number }>({ columns, data }: DynamicTableProps<T>) {
    return (
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-200 text-center">
            <thead className="bg-neutral-700">
            <tr className="text-center">
                {columns.map((col) => (
                    <th className="px-4 py-2 text-sm font-semibold text-gray-50" key={col.header}>{col.header}</th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
                <tr key={row.id} className="bg-neutral-900 text-gray-50">
                    {columns.map((col) => (
                        <td key={col.key.toString()} className="px-4 py-2">
                            {col.render ? col.render(row) : (row as any)[col.key]}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
