'use client';

export default function DataTable({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'No data available',
  actions = null,
  onRowClick = null
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                {col.header}
              </th>
            ))}
            {actions && <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="p-4 text-gray-800 dark:text-white">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {actions && (
                <td className="p-4">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

