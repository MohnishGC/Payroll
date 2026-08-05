import React, { useState } from 'react';
import type { EmployeeMaster } from '../../../types/employee.types';
import { Icon } from '../../../../../components/icons/Icon';
import { employeeApi } from '../../../services/employeeApi';

export interface DocumentsTabProps {
  employee: EmployeeMaster;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const documents = employee?.documents || (employee as any)?.Documents || [];
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string, path: string, fileName: string) => {
    setDownloadingId(id);
    try {
      const blob = await employeeApi.downloadFile(path);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download secure file:', err);
      alert('Failed to download secure document.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {documents.length === 0 ? (
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          No documents uploaded yet.
        </p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon name="fileText" size={22} color="var(--color-primary)" />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  {doc.name}
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {doc.type} • Uploaded on {doc.uploadedDate}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: doc.fileUrl ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: doc.fileUrl ? 'pointer' : 'not-allowed',
                }}
                title={doc.fileUrl ? "View / Download Document" : "No file attached"}
                onClick={() => doc.fileUrl && handleDownload(doc.id, doc.fileUrl, doc.name)}
                disabled={!doc.fileUrl || downloadingId === doc.id}
              >
                {downloadingId === doc.id ? (
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Loading...</span>
                ) : (
                  <Icon name="arrowRight" size={16} />
                )}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
