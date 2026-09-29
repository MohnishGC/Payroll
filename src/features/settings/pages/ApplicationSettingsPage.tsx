import React, { useState, useEffect } from 'react';
import { settingsApi, type ApplicationSetting, type CompanyDetail } from '../services/settingsApi';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button/Button';
import { useAuth } from '../../../app/providers/AuthProvider';
import './SettingsMasterPages.css';

export const ApplicationSettingsPage: React.FC = () => {
  const { user } = useAuth();
  // Navigation Tabs: 'configs' | 'company'
  const [activeTab, setActiveTab] = useState<'configs' | 'company'>('configs');

  // ==========================================
  // TAB 1: APPLICATION CONFIGS (Split-Pane Master-Detail)
  // ==========================================
  const [settings, setSettings] = useState<ApplicationSetting[]>([]);
  const [filteredSettings, setFilteredSettings] = useState<ApplicationSetting[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<ApplicationSetting | null>(null);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState<boolean>(false);
  const [configsError, setConfigsError] = useState<string | null>(null);

  // Search & Filter state
  const [configQuery, setConfigQuery] = useState<string>('');
  const [mainCodeFilter, setMainCodeFilter] = useState<string>('ALL');

  // Config Modal state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [configModalError, setConfigModalError] = useState<string | null>(null);

  // Config Form fields
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [formMainCode, setFormMainCode] = useState<string>('');
  const [formSubCode, setFormSubCode] = useState<string>('');
  const [formValue, setFormValue] = useState<string>('');
  const [formSubValue, setFormSubValue] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formIsUserSetting, setFormIsUserSetting] = useState<boolean>(true);

  // ==========================================
  // TAB 2: COMPANY PROFILE (Single Edit Form)
  // ==========================================
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState<boolean>(false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [companySuccessMessage, setCompanySuccessMessage] = useState<string | null>(null);
  const [isSavingCompany, setIsSavingCompany] = useState<boolean>(false);

  // Company Form fields
  const [companyName, setCompanyName] = useState<string>('');
  const [companyCode, setCompanyCode] = useState<string>('');
  const [companyAddress, setCompanyAddress] = useState<string>('');
  const [companyPhone, setCompanyPhone] = useState<string>('');
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [companyIsActive, setCompanyIsActive] = useState<boolean>(true);

  // Load configs
  const loadConfigs = async () => {
    setIsLoadingConfigs(true);
    setConfigsError(null);
    try {
      const data = await settingsApi.getApplicationSettings();
      setSettings(data);
      if (data.length > 0) {
        // Keep selection or default to first
        setSelectedSetting((prev) => {
          if (prev) {
            const fresh = data.find((x) => x.applicationSettingsId === prev.applicationSettingsId);
            return fresh || data[0];
          }
          return data[0];
        });
      } else {
        setSelectedSetting(null);
      }
    } catch (err) {
      setConfigsError((err as Error).message || 'Failed to load application settings.');
    } finally {
      setIsLoadingConfigs(false);
    }
  };

  // Load company
  const loadCompany = async () => {
    setIsLoadingCompany(true);
    setCompanyError(null);
    setCompanySuccessMessage(null);
    try {
      const data = await settingsApi.getCompanyDetails();
      if (data && data.length > 0) {
        const comp = data[0];
        setCompany(comp);
        setCompanyName(comp.name);
        setCompanyCode(comp.code);
        setCompanyAddress(comp.address || '');
        setCompanyPhone(comp.phone || '');
        setCompanyEmail(comp.email || '');
        setCompanyWebsite(comp.website || '');
        setCompanyIsActive(comp.isActive);
      }
    } catch (err) {
      setCompanyError((err as Error).message || 'Failed to load company profile.');
    } finally {
      setIsLoadingCompany(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'configs') {
      loadConfigs();
    } else {
      loadCompany();
    }
  }, [activeTab]);

  // Filter application settings
  useEffect(() => {
    let result = [...settings];

    if (configQuery.trim()) {
      const q = configQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.mainCode.toLowerCase().includes(q) ||
          s.subCode.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          s.value.toLowerCase().includes(q)
      );
    }

    if (mainCodeFilter !== 'ALL') {
      result = result.filter((s) => s.mainCode.toUpperCase() === mainCodeFilter.toUpperCase());
    }

    setFilteredSettings(result);
  }, [settings, configQuery, mainCodeFilter]);

  // Handle Edit Config Open
  const handleEditConfigOpen = (cfg: ApplicationSetting) => {
    setEditingConfigId(cfg.applicationSettingsId);
    setFormMainCode(cfg.mainCode);
    setFormSubCode(cfg.subCode);
    setFormValue(cfg.value);
    setFormSubValue(cfg.subValue || '');
    setFormDescription(cfg.description || '');
    setFormIsUserSetting(cfg.isUserSetting);
    setConfigModalError(null);
    setIsConfigModalOpen(true);
  };

  // Handle save config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMainCode.trim()) {
      setConfigModalError('Main Code is required.');
      return;
    }
    if (!formSubCode.trim()) {
      setConfigModalError('Sub Code is required.');
      return;
    }
    if (!formValue.trim()) {
      setConfigModalError('Configuration value is required.');
      return;
    }
    setIsSavingConfig(true);
    setConfigModalError(null);

    try {
      const payload = {
        mainCode: formMainCode.trim().toUpperCase(),
        subCode: formSubCode.trim().toUpperCase(),
        value: formValue.trim(),
        subValue: formSubValue.trim() || null,
        description: formDescription.trim() || undefined,
        isUserSetting: formIsUserSetting,
        modifiedBy: user?.employeeCode || user?.username || 'SYS-ADMIN',
      };

      if (editingConfigId) {
        const updated = await settingsApi.updateApplicationSetting(editingConfigId, payload);
        setSelectedSetting(updated);
      }

      await loadConfigs();
      setIsConfigModalOpen(false);
    } catch (err) {
      setConfigModalError((err as Error).message || 'Failed to save configuration.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Handle save company
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    if (!companyName.trim()) {
      setCompanyError('Company Name is required.');
      return;
    }
    if (!companyCode.trim()) {
      setCompanyError('Company Code is required.');
      return;
    }

    setIsSavingCompany(true);
    setCompanyError(null);
    setCompanySuccessMessage(null);

    try {
      const payload = {
        name: companyName.trim(),
        code: companyCode.trim().toUpperCase(),
        address: companyAddress.trim() || undefined,
        phone: companyPhone.trim() || undefined,
        email: companyEmail.trim() || undefined,
        website: companyWebsite.trim() || undefined,
        isActive: companyIsActive,
      };

      await settingsApi.updateCompanyDetail(company.id, payload);
      setCompanySuccessMessage('Company Profile updated successfully.');
      setTimeout(() => setCompanySuccessMessage(null), 5000);
      await loadCompany();
    } catch (err) {
      setCompanyError((err as Error).message || 'Failed to update company profile.');
    } finally {
      setIsSavingCompany(false);
    }
  };

  // Extract unique main codes for dropdown filter
  const uniqueMainCodes = Array.from(new Set(settings.map((s) => s.mainCode.toUpperCase())));

  return (
    <div className="settings-page">
      {/* Header section */}
      <div className="settings-page__header">
        <div>
          <h1 className="settings-page__title">Application Settings</h1>
          <p className="settings-page__subtitle">
            Configure system settings, constants, deductions, and company details.
          </p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="settings-tabs">
        <button
          type="button"
          className={`settings-tab ${activeTab === 'configs' ? 'settings-tab--active' : ''}`}
          onClick={() => setActiveTab('configs')}
        >
          <Icon name="settings" size={16} />
          <span>System Configs</span>
        </button>
        <button
          type="button"
          className={`settings-tab ${activeTab === 'company' ? 'settings-tab--active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          <Icon name="building" size={16} />
          <span>Company Profile</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: SYSTEM CONFIGS VIEW */}
      {/* ========================================== */}
      {activeTab === 'configs' && (
        <div className="app-settings-split animate-fadeIn">
          {/* Left panel list */}
          <div className="app-settings-list">


            {/* Filter inputs */}
            <div className="app-settings-list__filters">
              <div className="settings-page__search-input-wrapper">
                <Input
                  id="config-search"
                  type="text"
                  placeholder="Search settings..."
                  iconName="search"
                  value={configQuery}
                  onChange={(e) => setConfigQuery(e.target.value)}
                  variant="borderless"
                />
              </div>

              <select
                id="main-code-filter"
                className="settings-page__select w-full"
                value={mainCodeFilter}
                onChange={(e) => setMainCodeFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {uniqueMainCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            {/* Config cards list */}
            <div className="app-settings-list__cards">
              {isLoadingConfigs ? (
                <div className="app-settings-list__loading">
                  <Icon name="spinner" size={24} className="settings-modal-form__spinner" />
                  <span>Loading settings...</span>
                </div>
              ) : filteredSettings.length === 0 ? (
                <p className="app-settings-list__empty">No settings match your query.</p>
              ) : (
                filteredSettings.map((cfg) => (
                  <div
                    key={cfg.applicationSettingsId}
                    className={`setting-item-card ${
                      selectedSetting?.applicationSettingsId === cfg.applicationSettingsId
                        ? 'setting-item-card--selected'
                        : ''
                    }`}
                    onClick={() => setSelectedSetting(cfg)}
                  >
                    <div className="setting-item-card__header">
                      <span className="setting-item-card__main-badge">{cfg.mainCode}</span>
                      <span
                        className={`setting-item-card__user-badge ${
                          cfg.isUserSetting
                            ? 'setting-item-card__user-badge--user'
                            : 'setting-item-card__user-badge--system'
                        }`}
                      >
                        {cfg.isUserSetting ? 'User' : 'System'}
                      </span>
                    </div>
                    <h4 className="setting-item-card__sub-code">{cfg.subCode}</h4>
                    <div className="setting-item-card__value-row">
                      <span className="setting-item-card__val">{cfg.value}</span>
                      {cfg.subValue && (
                        <span className="setting-item-card__sub-val">{cfg.subValue}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel details */}
          <div className="app-settings-details">
            {configsError && (
              <div className="settings-page__error-banner" style={{ margin: '16px' }}>
                <Icon name="alertCircle" size={18} />
                <span>{configsError}</span>
              </div>
            )}

            {selectedSetting ? (
              <div className="app-settings-details__card">
                <div className="app-settings-details__header">
                  <div>
                    <span className="app-settings-details__category-label">
                      {selectedSetting.mainCode} CONFIGURATION
                    </span>
                    <h2 className="app-settings-details__title">{selectedSetting.subCode}</h2>
                  </div>
                  {selectedSetting.isUserSetting ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEditConfigOpen(selectedSetting)}
                    >
                      <Icon name="edit" size={14} />
                      <span>Edit Setting</span>
                    </Button>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-muted)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-lg)'
                      }}
                      title="This is a system configuration and cannot be modified."
                    >
                      <Icon name="lock" size={14} color="var(--color-text-muted)" />
                      <span>System Locked</span>
                    </span>
                  )}
                </div>

                <div className="app-settings-details__body">
                  <div className="app-settings-details__field">
                    <label className="app-settings-details__label">Value</label>
                    <div className="app-settings-details__value-box">
                      <span className="app-settings-details__value-main">
                        {selectedSetting.value}
                      </span>
                      {selectedSetting.subValue && (
                        <span className="app-settings-details__value-sub">
                          {selectedSetting.subValue}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedSetting.description && (
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Description</label>
                      <p className="app-settings-details__description-text">
                        {selectedSetting.description}
                      </p>
                    </div>
                  )}

                  <div className="app-settings-details__grid">
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Scope Classification</label>
                      <span
                        className={`settings-page__status-badge ${
                          selectedSetting.isUserSetting
                            ? 'settings-page__status-badge--active'
                            : 'settings-page__status-badge--inactive'
                        }`}
                      >
                        {selectedSetting.isUserSetting ? 'User Configurable' : 'System Locked'}
                      </span>
                    </div>

                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Last Modified By</label>
                      <span className="app-settings-details__info-text">
                        {selectedSetting.modifiedBy || '—'}
                      </span>
                    </div>

                    {selectedSetting.modifiedOn && (
                      <div className="app-settings-details__field">
                        <label className="app-settings-details__label">Last Modified On</label>
                        <span className="app-settings-details__info-text">
                          {new Date(selectedSetting.modifiedOn).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="app-settings-details__placeholder">
                <Icon name="settings" size={48} color="var(--color-text-muted)" />
                <h3>No Config Selected</h3>
                <p>Choose a configuration from the list on the left to review details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: COMPANY PROFILE VIEW */}
      {/* ========================================== */}
      {activeTab === 'company' && (
        <div className="settings-page__table-card animate-fadeIn" style={{ padding: '32px' }}>
          {isLoadingCompany ? (
            <div className="app-settings-list__loading" style={{ height: '300px' }}>
              <Icon name="spinner" size={32} className="settings-modal-form__spinner" />
              <span>Loading Company profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSaveCompany} className="settings-modal-form" style={{ maxWidth: '800px' }}>
              <h2 className="settings-page__title" style={{ fontSize: '20px', marginBottom: '8px' }}>
                Update Company Profile
              </h2>
              <p className="settings-page__subtitle" style={{ marginBottom: '24px' }}>
                Enter the official registration details for ACME Corporation and display branding settings.
              </p>

              {companyError && (
                <div className="settings-modal-form__error-banner" style={{ marginBottom: '20px' }}>
                  <Icon name="alertCircle" size={16} />
                  <span>{companyError}</span>
                </div>
              )}

              {companySuccessMessage && (
                <div
                  className="settings-modal-form__error-banner"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#34d399',
                    marginBottom: '20px',
                  }}
                >
                  <Icon name="checkCircle" size={16} />
                  <span>{companySuccessMessage}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <Input
                  id="company-form-name"
                  label="Company Name *"
                  placeholder="e.g. ACME Corp Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isSavingCompany}
                  required
                />

                <Input
                  id="company-form-code"
                  label="Company Registration Code *"
                  placeholder="e.g. ACME"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  disabled={isSavingCompany}
                  required
                />

                <div style={{ gridColumn: 'span 2' }}>
                  <Input
                    id="company-form-address"
                    label="Corporate Head Office Address"
                    placeholder="Full street address, city, zip code"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    disabled={isSavingCompany}
                  />
                </div>

                <Input
                  id="company-form-phone"
                  label="Contact Phone Number"
                  placeholder="e.g. 022-12345678"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  disabled={isSavingCompany}
                />

                <Input
                  id="company-form-email"
                  label="Official Email Address"
                  placeholder="e.g. corporate@acme.com"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  disabled={isSavingCompany}
                />

                <div style={{ gridColumn: 'span 2' }}>
                  <Input
                    id="company-form-website"
                    label="Corporate Website URL"
                    placeholder="https://acme.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    disabled={isSavingCompany}
                  />
                </div>
              </div>

              <div className="settings-modal-form__actions" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                <Button type="submit" variant="primary" disabled={isSavingCompany}>
                  {isSavingCompany ? (
                    <>
                      <Icon name="spinner" size={16} className="settings-modal-form__spinner" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* EDIT CONFIG MODAL DIALOG */}
      {/* ========================================== */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => !isSavingConfig && setIsConfigModalOpen(false)}
        title="Edit Application Setting"
        maxWidth={selectedSetting?.options && selectedSetting.options.length > 3 ? "650px" : "500px"}
      >
        <form onSubmit={handleSaveConfig} className="settings-modal-form">
          {configModalError && (
            <div className="settings-modal-form__error-banner">
              <Icon name="alertCircle" size={16} />
              <span>{configModalError}</span>
            </div>
          )}

          <div className="settings-modal-form__grid">
            {/* Read-Only Configuration Info */}
            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</span>
                  <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-heading)', marginTop: '2px' }}>{selectedSetting?.mainCode}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Setting Key</span>
                  <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-heading)', marginTop: '2px' }}>{selectedSetting?.subCode}</p>
                </div>
              </div>
              {selectedSetting?.description && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</span>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: '1.4' }}>{selectedSetting.description}</p>
                </div>
              )}
            </div>

            {/* Editable Value */}
            {selectedSetting?.options && selectedSetting.options.length > 0 ? (
              <div className="settings-modal-form__field">
                <label className="settings-modal-form__label">Config Value *</label>
                <div className="settings-modal-form__toggle-row" style={{ width: '100%' }}>
                  {selectedSetting.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`settings-modal-form__toggle-btn ${
                        formValue === opt ? 'settings-modal-form__toggle-btn--active' : ''
                      }`}
                      style={{ flex: 1 }}
                      onClick={() => setFormValue(opt)}
                      disabled={isSavingConfig}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <Input
                id="cfg-form-val"
                label="Config Value *"
                placeholder="Enter value"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                disabled={isSavingConfig}
                required
              />
            )}

            {/* Editable Sub Value (Only if not null originally) */}
            {selectedSetting?.subValue !== null && (
              <Input
                id="cfg-form-subval"
                label="Unit / Secondary Value"
                placeholder="Enter secondary value"
                value={formSubValue}
                onChange={(e) => setFormSubValue(e.target.value)}
                disabled={isSavingConfig}
              />
            )}
          </div>

          <div className="settings-modal-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsConfigModalOpen(false)}
              disabled={isSavingConfig}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSavingConfig}>
              {isSavingConfig ? (
                <>
                  <Icon name="spinner" size={16} className="settings-modal-form__spinner" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApplicationSettingsPage;
