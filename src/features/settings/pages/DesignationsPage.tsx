import React, { useState, useEffect } from 'react';
import { settingsApi, type Designation, type Department } from '../services/settingsApi';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Table } from '../../../components/ui/Table/Table';
import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button/Button';
import './SettingsMasterPages.css';

export const DesignationsPage: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<Designation[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('all'); // all, or departmentId
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all, active, inactive

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form fields
  const [editingId, setEditingId] = useState<string | null>(null); // null means creating
  const [formDeptId, setFormDeptId] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Load designations and departments
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [deptsData, desigsData] = await Promise.all([
        settingsApi.getDepartments(true),
        settingsApi.getDesignations(undefined, true),
      ]);
      setDepartments(deptsData);
      setDesignations(desigsData);
    } catch (err) {
      setError((err as Error).message || 'Failed to load master records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter designations based on search, department, and status
  useEffect(() => {
    let result = [...designations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((d) => d.title.toLowerCase().includes(q));
    }

    if (deptFilter !== 'all') {
      result = result.filter((d) => d.departmentId === deptFilter);
    }

    if (statusFilter === 'active') {
      result = result.filter((d) => d.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter((d) => !d.isActive);
    }

    setFilteredDesignations(result);
  }, [designations, searchQuery, deptFilter, statusFilter]);

  // Open modal for Create
  const handleCreateOpen = () => {
    setEditingId(null);
    setFormDeptId(departments[0]?.id || '');
    setFormTitle('');
    setFormIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open modal for Update
  const handleUpdateOpen = (des: Designation) => {
    setEditingId(des.id);
    setFormDeptId(des.departmentId);
    setFormTitle(des.title);
    setFormIsActive(des.isActive);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDeptId) {
      setModalError('Please select a Department.');
      return;
    }
    if (!formTitle.trim()) {
      setModalError('Designation Title is required.');
      return;
    }

    setIsSaving(true);
    setModalError(null);

    try {
      const payload = {
        departmentId: formDeptId,
        title: formTitle.trim(),
        isActive: formIsActive,
      };

      if (editingId) {
        await settingsApi.updateDesignation(editingId, payload);
      } else {
        await settingsApi.createDesignation(payload);
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      setModalError((err as Error).message || 'Failed to save designation.');
    } finally {
      setIsSaving(false);
    }
  };

  const getDepartmentName = (deptId: string): string => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.name : 'Unknown';
  };

  const columns = [
    {
      key: 'title',
      header: 'DESIGNATION TITLE',
      render: (des: Designation) => (
        <span className="settings-page__name-text">{des.title}</span>
      ),
    },
    {
      key: 'department',
      header: 'DEPARTMENT',
      render: (des: Designation) => (
        <span className="settings-page__dept-badge">
          {des.departmentName || getDepartmentName(des.departmentId)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      width: '150px',
      render: (des: Designation) => (
        <span
          className={`settings-page__status-badge ${
            des.isActive ? 'settings-page__status-badge--active' : 'settings-page__status-badge--inactive'
          }`}
        >
          {des.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      width: '120px',
      render: (des: Designation) => (
        <Button
          type="button"
          variant="secondary"
          className="settings-page__update-btn"
          onClick={() => handleUpdateOpen(des)}
          title="Update Designation"
        >
          <Icon name="edit" size={14} />
          <span>Update</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="settings-page">
      {/* Header section */}
      <div className="settings-page__header">
        <div>
          <h1 className="settings-page__title">Designation Master</h1>
          <p className="settings-page__subtitle">
            Configure and manage employee designations, hierarchies, and job titles.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={handleCreateOpen}>
          <Icon name="plus" size={16} />
          <span>Add Designation</span>
        </Button>
      </div>

      {/* Filter panel */}
      <div className="settings-page__filters">
        <div className="settings-page__search-input-wrapper">
          <Input
            id="des-search"
            type="text"
            placeholder="Search by title..."
            iconName="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="borderless"
          />
          {searchQuery && (
            <button
              type="button"
              className="settings-page__clear-search"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>

        <div className="settings-page__select-wrapper">
          <label className="settings-page__select-label" htmlFor="dept-filter">Department</label>
          <select
            id="dept-filter"
            className="settings-page__select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-page__select-wrapper">
          <label className="settings-page__select-label" htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            className="settings-page__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="settings-page__error-banner">
          <Icon name="alertCircle" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="settings-page__table-card">
        <Table
          columns={columns}
          data={filteredDesignations}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyText="No designations matching the filters were found."
        />
      </div>

      {/* Modal dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={editingId ? 'Update Designation' : 'Add New Designation'}
        maxWidth="500px"
      >
        <form onSubmit={handleSave} className="settings-modal-form">
          {modalError && (
            <div className="settings-modal-form__error-banner">
              <Icon name="alertCircle" size={16} />
              <span>{modalError}</span>
            </div>
          )}

          <div className="settings-modal-form__grid">
            {/* Department dropdown */}
            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label" htmlFor="des-form-dept">
                Department *
              </label>
              <select
                id="des-form-dept"
                className="settings-modal-form__select"
                value={formDeptId}
                onChange={(e) => setFormDeptId(e.target.value)}
                disabled={isSaving}
                required
              >
                <option value="">-- Select Department --</option>
                {departments
                  .filter((d) => d.isActive || d.id === formDeptId)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>

            <Input
              id="des-form-title"
              label="Designation Title *"
              placeholder="e.g. Senior Software Engineer"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              disabled={isSaving}
              required
            />

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Status</label>
              <div className="settings-modal-form__toggle-row">
                <button
                  type="button"
                  className={`settings-modal-form__toggle-btn ${
                    formIsActive ? 'settings-modal-form__toggle-btn--active' : ''
                  }`}
                  onClick={() => setFormIsActive(true)}
                  disabled={isSaving}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`settings-modal-form__toggle-btn ${
                    !formIsActive ? 'settings-modal-form__toggle-btn--active' : ''
                  }`}
                  onClick={() => setFormIsActive(false)}
                  disabled={isSaving}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div className="settings-modal-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Icon name="spinner" size={16} className="settings-modal-form__spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingId ? 'Update' : 'Save'}</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DesignationsPage;
