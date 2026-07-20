import React from 'react';
import type { EmployeeMaster, EmployeeDocument } from '../../../types/employee.types';
import { Icon } from '../../../../../components/icons/Icon';

export interface DocumentsTabProps {
  employee: EmployeeMaster;
  isEditing: boolean;
  onUpdate: (updated: Partial<EmployeeMaster>) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  employee,
  isEditing,
  onUpdate,
}) => {
  const documents = employee.documents || [];

  const handleUploadClick = () => {
    const newDoc: EmployeeDocument = {
      id: `doc-${Date.now()}`,
      name: `Verification_Doc_${documents.length + 1}.pdf`,
      type: 'PDF Document',
      uploadedDate: new Date().toISOString().split('T')[0],
    };
    onUpdate({
      documents: [...documents, newDoc],
    });
  };

  const handleRemoveDoc = (id: string) => {
    onUpdate({
      documents: documents.filter((doc) => doc.id !== id),
    });
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
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
                title="View / Download Document"
              >
                <Icon name="arrowRight" size={16} />
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleRemoveDoc(doc.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                  title="Delete Document"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={handleUploadClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-primary-bg)',
          color: 'var(--color-primary)',
          fontSize: '13px',
          fontWeight: 600,
          border: '1px solid #BFDBFE',
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        <Icon name="plus" size={16} />
        <span>Upload Document</span>
      </button>
    </div>
  );
};
