import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import './Table.css';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  pagination?: PaginationConfig;
  isLoading?: boolean;
  emptyText?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  pagination,
  isLoading = false,
  emptyText = 'No data available',
  className = '',
}: TableProps<T>) {
  return (
    <div className={`ui-table-container ${className}`}>
      <div className="ui-table-wrapper">
        <table className="ui-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    textAlign: col.align || 'left',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="ui-table__loading-cell">
                  <Icon name="spinner" size={20} className="ui-table__spinner" />
                  <span>Loading records...</span>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="ui-table__empty-cell">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={keyExtractor(row, index)}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row, index) : (row as Record<string, unknown>)[col.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 0 && (
        <div className="ui-table__pagination-footer">
          <span className="ui-table__pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="ui-table__pagination-controls">
            <button
              type="button"
              className="ui-table__page-btn"
              disabled={pagination.currentPage <= 1 || isLoading}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              aria-label="Previous Page"
            >
              <Icon name="chevronLeft" size={16} />
              <span>Previous</span>
            </button>
            <button
              type="button"
              className="ui-table__page-btn"
              disabled={pagination.currentPage >= pagination.totalPages || isLoading}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              aria-label="Next Page"
            >
              <span>Next</span>
              <Icon name="chevronRight" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
