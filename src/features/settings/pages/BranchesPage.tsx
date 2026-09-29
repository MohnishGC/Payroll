import React, { useState, useEffect } from 'react';
import { settingsApi, type Branch } from '../services/settingsApi';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Table } from '../../../components/ui/Table/Table';
import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button/Button';
import './SettingsMasterPages.css';

export const BranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
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
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formAddress, setFormAddress] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Default Company Detail ID (ACME Head Office seed company GUID)
  const defaultCompanyDetailId = 'c1111111-2222-3333-4444-555555555555';

  // Load branches
  const loadBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await settingsApi.getBranches(undefined, undefined, true);
      setBranches(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load branches.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  // Filter branches based on search and status
  useEffect(() => {
    let result = [...branches];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q) ||
          (b.address || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'active') {
      result = result.filter((b) => b.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter((b) => !b.isActive);
    }

    setFilteredBranches(result);
  }, [branches, searchQuery, statusFilter]);

  // Open modal for Create
  const handleCreateOpen = () => {
    setEditingId(null);
    setFormName('');
    setFormCode('');
    setFormAddress('');
    setFormIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open modal for Update
  const handleUpdateOpen = (branch: Branch) => {
    setEditingId(branch.id);
    setFormName(branch.name);
    setFormCode(branch.code);
    setFormAddress(branch.address || '');
    setFormIsActive(branch.isActive);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setModalError('Branch Name is required.');
      return;
    }
    if (!formCode.trim()) {
      setModalError('Branch Code is required.');
      return;
    }

    setIsSaving(true);
    setModalError(null);

    try {
      const payload = {
        companyDetailId: defaultCompanyDetailId,
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        address: formAddress.trim() || undefined,
        isActive: formIsActive,
      };

      if (editingId) {
        await settingsApi.updateBranch(editingId, payload);
      } else {
        await settingsApi.createBranch(payload);
      }

      await loadBranches();
      setIsModalOpen(false);
    } catch (err) {
      setModalError((err as Error).message || 'Failed to save branch.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'code',
      header: 'BRANCH CODE',
      width: '180px',
      render: (branch: Branch) => (
        <span className="settings-page__code-badge">{branch.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'BRANCH NAME',
      render: (branch: Branch) => (
        <span className="settings-page__name-text">{branch.name}</span>
      ),
    },
    {
      key: 'address',
      header: 'ADDRESS',
      render: (branch: Branch) => (
        <span style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
          {branch.address || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      width: '150px',
      render: (branch: Branch) => (
        <span
          className={`settings-page__status-badge ${
            branch.isActive
              ? 'settings-page__status-badge--active'
              : 'settings-page__status-badge--inactive'
          }`}
        >
          {branch.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      width: '120px',
      render: (branch: Branch) => (
        <Button
          type="button"
          variant="secondary"
          className="settings-page__update-btn"
          onClick={() => handleUpdateOpen(branch)}
          title="Update Branch"
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
          <h1 className="settings-page__title">Branch Master</h1>
          <p className="settings-page__subtitle">
            Configure and manage office branch locations, addresses, and regional payroll codes.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={handleCreateOpen}>
          <Icon name="plus" size={16} />
          <span>Add Branch</span>
        </Button>
      </div>

      {/* Filter panel */}
      <div className="settings-page__filters">
        <div className="settings-page__search-input-wrapper">
          <Input
            id="branch-search"
            type="text"
            placeholder="Search by code, name or address..."
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

      {/* Error banner */}
      {error && (
        <div className="settings-page__error-banner">
          <Icon name="alertCircle" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main content table */}
      <div className="settings-page__table-card">
        <Table
          columns={columns}
          data={filteredBranches}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyText="No branches matching the filters were found."
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        title={editingId ? 'Update Branch' : 'Add New Branch'}
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
              id="branch-form-code"
              label="Branch Code *"
              placeholder="e.g. MUM-HQ"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              disabled={isSaving}
              required
            />

            <Input
              id="branch-form-name"
              label="Branch Name *"
              placeholder="e.g. Mumbai HQ"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              disabled={isSaving}
              required
            />

            <Input
              id="branch-form-address"
              label="Address"
              placeholder="Full street address, city, state"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              disabled={isSaving}
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

export default BranchesPage;
