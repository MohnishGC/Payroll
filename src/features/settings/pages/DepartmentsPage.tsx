import React, { useState, useEffect } from 'react';
import { settingsApi, type Department } from '../services/settingsApi';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Table } from '../../../components/ui/Table/Table';
import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button/Button';
import './SettingsMasterPages.css';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all, active, inactive

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  
  // Form fields
  const [editingId, setEditingId] = useState<string | null>(null); // null means creating
  const [formCode, setFormCode] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Load departments
  const loadDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await settingsApi.getDepartments(true);
      setDepartments(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load departments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Filter departments based on search and status
  useEffect(() => {
    let result = [...departments];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) => d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'active') {
      result = result.filter((d) => d.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter((d) => !d.isActive);
    }

    setFilteredDepartments(result);
  }, [departments, searchQuery, statusFilter]);

  // Open modal for Create
  const handleCreateOpen = () => {
    setEditingId(null);
    setFormCode('');
    setFormName('');
    setFormIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open modal for Update
  const handleUpdateOpen = (dept: Department) => {
    setEditingId(dept.id);
    setFormCode(dept.code);
    setFormName(dept.name);
    setFormIsActive(dept.isActive);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) {
      setModalError('Department Code is required.');
      return;
    }
    if (!formName.trim()) {
      setModalError('Department Name is required.');
      return;
    }

    setIsSaving(true);
    setModalError(null);

    try {
      const payload = {
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        isActive: formIsActive,
      };

      if (editingId) {
        await settingsApi.updateDepartment(editingId, payload);
      } else {
        await settingsApi.createDepartment(payload);
      }

      await loadDepartments();
      setIsModalOpen(false);
    } catch (err) {
      setModalError((err as Error).message || 'Failed to save department.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'code',
      header: 'DEPARTMENT CODE',
      width: '180px',
      render: (dept: Department) => (
        <span className="settings-page__code-badge">{dept.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'DEPARTMENT NAME',
      render: (dept: Department) => (
        <span className="settings-page__name-text">{dept.name}</span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      width: '150px',
      render: (dept: Department) => (
        <span
          className={`settings-page__status-badge ${
            dept.isActive ? 'settings-page__status-badge--active' : 'settings-page__status-badge--inactive'
          }`}
        >
          {dept.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      width: '120px',
      render: (dept: Department) => (
        <Button
          type="button"
          variant="secondary"
          className="settings-page__update-btn"
          onClick={() => handleUpdateOpen(dept)}
          title="Update Department"
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
          <h1 className="settings-page__title">Department Master</h1>
          <p className="settings-page__subtitle">
            Configure and manage organization departments, department codes, and statuses.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={handleCreateOpen}>
          <Icon name="plus" size={16} />
          <span>Add Department</span>
        </Button>
      </div>

      {/* Filter panel */}
      <div className="settings-page__filters">
        <div className="settings-page__search-input-wrapper">
          <Input
            id="dept-search"
            type="text"
            placeholder="Search by code or name..."
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

      {/* Main content table */}
      {error && (
        <div className="settings-page__error-banner">
          <Icon name="alertCircle" size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="settings-page__table-card">
        <Table
          columns={columns}
          data={filteredDepartments}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyText="No departments matching the filters were found."
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={editingId ? 'Update Department' : 'Add New Department'}
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
            <Input
              id="dept-form-code"
              label="Department Code *"
              placeholder="e.g. ENG"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              disabled={isSaving}
              required
            />

            <Input
              id="dept-form-name"
              label="Department Name *"
              placeholder="e.g. Engineering"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
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

export default DepartmentsPage;
