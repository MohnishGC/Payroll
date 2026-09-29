import React, { useState, useEffect } from 'react';
import { settingsApi, type GradePay, type CityClassHRA, type Department, type Designation } from '../services/settingsApi';
import { Modal } from '../../../components/ui/Modal/Modal';
import { Input } from '../../../components/ui/Input/Input';
import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button/Button';
import { useAuth } from '../../../app/providers/AuthProvider';
import './SettingsMasterPages.css';

export const PayrollConfigurationPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'gradePays' | 'cityHras'>('gradePays');

  // Load departments & designations for Grade Pay Form
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  // TAB 1: GRADE PAY SCALE (CRUD)
  // ==========================================
  const [gradePays, setGradePays] = useState<GradePay[]>([]);
  const [filteredGradePays, setFilteredGradePays] = useState<GradePay[]>([]);
  const [selectedGradePay, setSelectedGradePay] = useState<GradePay | null>(null);
  const [isLoadingGradePays, setIsLoadingGradePays] = useState<boolean>(false);
  const [gradePaysError, setGradePaysError] = useState<string | null>(null);
  const [gpQuery, setGpQuery] = useState<string>('');

  // Grade Pay Modal Form
  const [isGpModalOpen, setIsGpModalOpen] = useState<boolean>(false);
  const [isSavingGp, setIsSavingGp] = useState<boolean>(false);
  const [gpModalError, setGpModalError] = useState<string | null>(null);
  const [editingGpId, setEditingGpId] = useState<string | null>(null);

  // Form Fields
  const [gpCode, setGpCode] = useState<string>('');
  const [gpTitle, setGpTitle] = useState<string>('');
  const [gpPayBandMin, setGpPayBandMin] = useState<string>('');
  const [gpPayBandMax, setGpPayBandMax] = useState<string>('');
  const [gpGradePayAmount, setGpGradePayAmount] = useState<string>('');
  const [gpIsActive, setGpIsActive] = useState<boolean>(true);
  const [gpDeptId, setGpDeptId] = useState<string>('');
  const [gpDesignationId, setGpDesignationId] = useState<string>('');

  // ==========================================
  // TAB 2: CITY CLASS HRA (Update Only)
  // ==========================================
  const [cityHras, setCityHras] = useState<CityClassHRA[]>([]);
  const [filteredCityHras, setFilteredCityHras] = useState<CityClassHRA[]>([]);
  const [selectedCityHra, setSelectedCityHra] = useState<CityClassHRA | null>(null);
  const [isLoadingCityHras, setIsLoadingCityHras] = useState<boolean>(false);
  const [cityHrasError, setCityHrasError] = useState<string | null>(null);
  const [cityQuery, setCityQuery] = useState<string>('');

  // City Class HRA Modal Form
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isSavingCity, setIsSavingCity] = useState<boolean>(false);
  const [cityModalError, setCityModalError] = useState<string | null>(null);

  // Form Fields
  const [cityHraPercentage, setCityHraPercentage] = useState<string>('');
  const [cityDescription, setCityDescription] = useState<string>('');
  const [cityIsActive, setCityIsActive] = useState<boolean>(true);

  // ==========================================
  // API LOADERS
  // ==========================================
  const loadGradePays = async () => {
    setIsLoadingGradePays(true);
    setGradePaysError(null);
    try {
      const data = await settingsApi.getGradePays(true);
      setGradePays(data);
      if (data.length > 0) {
        setSelectedGradePay((prev) => {
          if (prev) {
            const fresh = data.find((x) => x.id === prev.id);
            return fresh || data[0];
          }
          return data[0];
        });
      } else {
        setSelectedGradePay(null);
      }
    } catch (err) {
      setGradePaysError((err as Error).message || 'Failed to load Grade Pays.');
    } finally {
      setIsLoadingGradePays(false);
    }
  };

  const loadCityHras = async () => {
    setIsLoadingCityHras(true);
    setCityHrasError(null);
    try {
      const data = await settingsApi.getCityClassHRAs(true);
      setCityHras(data);
      if (data.length > 0) {
        setSelectedCityHra((prev) => {
          if (prev) {
            const fresh = data.find((x) => x.id === prev.id);
            return fresh || data[0];
          }
          return data[0];
        });
      } else {
        setSelectedCityHra(null);
      }
    } catch (err) {
      setCityHrasError((err as Error).message || 'Failed to load City Class HRAs.');
    } finally {
      setIsLoadingCityHras(false);
    }
  };

  const loadDeptAndDesg = async () => {
    try {
      const depts = await settingsApi.getDepartments(false); // /departments?includeInactive=false
      const desgs = await settingsApi.getDesignations(undefined, false); // /designations?includeInactive=false
      setDepartments(depts);
      setDesignations(desgs);
    } catch (err) {
      console.error('Failed to load departments/designations:', err);
    }
  };

  useEffect(() => {
    loadDeptAndDesg();
  }, []);

  useEffect(() => {
    if (activeTab === 'gradePays') {
      loadGradePays();
    } else {
      loadCityHras();
    }
  }, [activeTab]);

  // Filtering lists
  useEffect(() => {
    let result = [...gradePays];
    if (gpQuery.trim()) {
      const q = gpQuery.toLowerCase().trim();
      result = result.filter(
        (gp) =>
          gp.code.toLowerCase().includes(q) ||
          gp.title.toLowerCase().includes(q)
      );
    }
    setFilteredGradePays(result);
  }, [gradePays, gpQuery]);

  useEffect(() => {
    let result = [...cityHras];
    if (cityQuery.trim()) {
      const q = cityQuery.toLowerCase().trim();
      result = result.filter(
        (hra) =>
          hra.classCode.toLowerCase().includes(q) ||
          hra.className.toLowerCase().includes(q) ||
          (hra.description || '').toLowerCase().includes(q)
      );
    }
    setFilteredCityHras(result);
  }, [cityHras, cityQuery]);

  // ==========================================
  // GRADE PAY CRUD HANDLERS
  // ==========================================
  const handleCreateGpOpen = () => {
    setEditingGpId(null);
    setGpCode('');
    setGpTitle('');
    setGpPayBandMin('');
    setGpPayBandMax('');
    setGpGradePayAmount('');
    setGpIsActive(true);
    setGpDeptId('');
    setGpDesignationId('');
    setGpModalError(null);
    setIsGpModalOpen(true);
  };

  const handleEditGpOpen = (gp: GradePay) => {
    setEditingGpId(gp.id);
    setGpCode(gp.code);
    setGpTitle(gp.title);
    setGpPayBandMin(String(gp.payBandMin));
    setGpPayBandMax(String(gp.payBandMax));
    setGpGradePayAmount(String(gp.gradePayAmount));
    setGpIsActive(gp.isActive);

    // Pre-select Department and Designation
    const foundDesg = designations.find((d) => d.id === gp.designationId);
    if (foundDesg) {
      setGpDeptId(foundDesg.departmentId);
      setGpDesignationId(foundDesg.id);
    } else {
      setGpDeptId('');
      setGpDesignationId('');
    }

    setGpModalError(null);
    setIsGpModalOpen(true);
  };

  const handleSaveGp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gpCode.trim()) return setGpModalError('Code is required.');
    if (!gpTitle.trim()) return setGpModalError('Title is required.');
    if (!gpPayBandMin.trim() || isNaN(Number(gpPayBandMin))) return setGpModalError('Valid Minimum Pay Band is required.');
    if (!gpPayBandMax.trim() || isNaN(Number(gpPayBandMax))) return setGpModalError('Valid Maximum Pay Band is required.');
    if (!gpGradePayAmount.trim() || isNaN(Number(gpGradePayAmount))) return setGpModalError('Valid Grade Pay Amount is required.');

    setIsSavingGp(true);
    setGpModalError(null);
    try {
      const currentUser = user?.employeeCode || user?.username || 'SYS-ADMIN';
      const designationIdVal = gpDesignationId || null;

      if (editingGpId) {
        const payload = {
          designationId: designationIdVal,
          code: gpCode.trim().toUpperCase(),
          title: gpTitle.trim(),
          payBandMin: Number(gpPayBandMin),
          payBandMax: Number(gpPayBandMax),
          gradePayAmount: Number(gpGradePayAmount),
          isActive: gpIsActive,
          modifiedBy: currentUser
        };
        const updated = await settingsApi.updateGradePay(editingGpId, payload);
        setSelectedGradePay(updated);
      } else {
        const payload = {
          designationId: designationIdVal,
          code: gpCode.trim().toUpperCase(),
          title: gpTitle.trim(),
          payBandMin: Number(gpPayBandMin),
          payBandMax: Number(gpPayBandMax),
          gradePayAmount: Number(gpGradePayAmount),
          isActive: gpIsActive,
          createdBy: currentUser
        };
        const created = await settingsApi.createGradePay(payload);
        setSelectedGradePay(created);
      }
      await loadGradePays();
      setIsGpModalOpen(false);
    } catch (err) {
      setGpModalError((err as Error).message || 'Failed to save Grade Pay scale.');
    } finally {
      setIsSavingGp(false);
    }
  };

  // ==========================================
  // CITY HRA UPDATE HANDLERS
  // ==========================================
  const handleEditCityOpen = (hra: CityClassHRA) => {
    setCityHraPercentage(String(hra.hraPercentage));
    setCityDescription(hra.description || '');
    setCityIsActive(hra.isActive);
    setCityModalError(null);
    setIsCityModalOpen(true);
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityHra) return;
    if (!cityHraPercentage.trim() || isNaN(Number(cityHraPercentage))) {
      return setCityModalError('Valid HRA Percentage is required.');
    }

    setIsSavingCity(true);
    setCityModalError(null);
    try {
      const currentUser = user?.employeeCode || user?.username || 'SYS-ADMIN';
      const payload = {
        hraPercentage: Number(cityHraPercentage),
        description: cityDescription.trim() || undefined,
        isActive: cityIsActive,
        modifiedBy: currentUser
      };
      const updated = await settingsApi.updateCityClassHRA(selectedCityHra.id, payload);
      setSelectedCityHra(updated);
      await loadCityHras();
      setIsCityModalOpen(false);
    } catch (err) {
      setCityModalError((err as Error).message || 'Failed to update City Class HRA.');
    } finally {
      setIsSavingCity(false);
    }
  };

  return (
    <div className="settings-page">
      {/* Header section */}
      <div className="settings-page__header">
        <div>
          <h1 className="settings-page__title">Payroll Configuration</h1>
          <p className="settings-page__subtitle">
            Manage Grade Pay levels, salary scales, and City Class HRA percentages.
          </p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="settings-tabs">
        <button
          type="button"
          className={`settings-tab ${activeTab === 'gradePays' ? 'settings-tab--active' : ''}`}
          onClick={() => setActiveTab('gradePays')}
        >
          <Icon name="briefcase" size={16} />
          <span>Grade Pay Scale</span>
        </button>
        <button
          type="button"
          className={`settings-tab ${activeTab === 'cityHras' ? 'settings-tab--active' : ''}`}
          onClick={() => setActiveTab('cityHras')}
        >
          <Icon name="building" size={16} />
          <span>City Class HRA</span>
        </button>
      </div>

      {/* Error Banners */}
      {activeTab === 'gradePays' && gradePaysError && (
        <div style={{ margin: '20px 0 0 0', padding: '12px 16px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', color: '#991B1B', fontSize: '13.5px' }}>
          <Icon name="alertCircle" size={16} />
          <span>{gradePaysError}</span>
        </div>
      )}
      {activeTab === 'cityHras' && cityHrasError && (
        <div style={{ margin: '20px 0 0 0', padding: '12px 16px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', color: '#991B1B', fontSize: '13.5px' }}>
          <Icon name="alertCircle" size={16} />
          <span>{cityHrasError}</span>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 1: GRADE PAY SCALE */}
      {/* ========================================== */}
      {activeTab === 'gradePays' && (
        <div className="app-settings-split animate-fadeIn">
          {/* Left panel list */}
          <div className="app-settings-list">
            <div className="app-settings-list__filters">
              <div className="settings-page__search-input-wrapper" style={{ flex: 1 }}>
                <Input
                  id="gp-search"
                  type="text"
                  placeholder="Search Grade Pays..."
                  iconName="search"
                  value={gpQuery}
                  onChange={(e) => setGpQuery(e.target.value)}
                  variant="borderless"
                />
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={handleCreateGpOpen}
                title="Add Grade Pay Level"
              >
                <Icon name="plus" size={16} />
                <span>Add Grade Pay</span>
              </Button>
            </div>

            <div className="app-settings-list__cards">
              {isLoadingGradePays ? (
                <div className="app-settings-list__loading">
                  <Icon name="spinner" size={24} className="settings-modal-form__spinner" />
                  <span>Loading Grade Pays...</span>
                </div>
              ) : filteredGradePays.length === 0 ? (
                <p className="app-settings-list__empty">No Grade Pay scales match your search.</p>
              ) : (
                filteredGradePays.map((gp) => (
                  <div
                    key={gp.id}
                    className={`setting-item-card ${
                      selectedGradePay?.id === gp.id ? 'setting-item-card--selected' : ''
                    }`}
                    onClick={() => setSelectedGradePay(gp)}
                  >
                    <div className="setting-item-card__header">
                      <span className="setting-item-card__main-badge">{gp.code}</span>
                      <span
                        className={`setting-item-card__user-badge ${
                          gp.isActive
                            ? 'setting-item-card__user-badge--user'
                            : 'setting-item-card__user-badge--system'
                        }`}
                      >
                        {gp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="setting-item-card__sub-code">{gp.title}</h4>
                    <div className="setting-item-card__value-row">
                      <span className="setting-item-card__val">Basic: ₹{gp.entryBasic.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel details */}
          <div className="app-settings-details">
            {selectedGradePay ? (
              <div className="app-settings-details__card animate-fadeIn">
                <div className="app-settings-details__header">
                  <div>
                    <span className="app-settings-details__category-label">
                      GRADE PAY SCALE
                    </span>
                    <h2 className="app-settings-details__title">{selectedGradePay.title}</h2>
                    <p className="app-settings-details__subtitle" style={{ marginTop: '4px' }}>Code: {selectedGradePay.code}</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEditGpOpen(selectedGradePay)}
                  >
                    <Icon name="edit" size={14} />
                    <span>Edit Level</span>
                  </Button>
                </div>

                <div className="app-settings-details__body">
                  <div className="app-settings-details__field">
                    <label className="app-settings-details__label">Entry Basic (Calculated)</label>
                    <div className="app-settings-details__value-box" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary-border)' }}>
                      <span className="app-settings-details__value-main" style={{ color: 'var(--color-primary)' }}>
                        ₹{selectedGradePay.entryBasic.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="app-settings-details__grid">
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Pay Band Minimum</label>
                      <span className="app-settings-details__info-text">
                        ₹{selectedGradePay.payBandMin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Pay Band Maximum</label>
                      <span className="app-settings-details__info-text">
                        ₹{selectedGradePay.payBandMax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Grade Pay Amount</label>
                      <span className="app-settings-details__info-text">
                        ₹{selectedGradePay.gradePayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Designation Link</label>
                      <span className="app-settings-details__info-text">
                        {selectedGradePay.designationTitle || '—'}
                      </span>
                    </div>
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Status</label>
                      <span className={`settings-page__status-badge ${selectedGradePay.isActive ? 'settings-page__status-badge--active' : 'settings-page__status-badge--inactive'}`}>
                        {selectedGradePay.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '20px', paddingTop: '20px' }}>
                    <div className="app-settings-details__grid">
                      <div className="app-settings-details__field">
                        <label className="app-settings-details__label">Created By</label>
                        <span className="app-settings-details__info-text">{selectedGradePay.createdBy || 'SYSTEM'}</span>
                      </div>
                      <div className="app-settings-details__field">
                        <label className="app-settings-details__label">Created On</label>
                        <span className="app-settings-details__info-text">
                          {selectedGradePay.createdOn ? new Date(selectedGradePay.createdOn).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      {selectedGradePay.modifiedBy && (
                        <div className="app-settings-details__field">
                          <label className="app-settings-details__label">Modified By</label>
                          <span className="app-settings-details__info-text">{selectedGradePay.modifiedBy}</span>
                        </div>
                      )}
                      {selectedGradePay.lastModifiedOn && (
                        <div className="app-settings-details__field">
                          <label className="app-settings-details__label">Last Modified On</label>
                          <span className="app-settings-details__info-text">
                            {new Date(selectedGradePay.lastModifiedOn).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="app-settings-details__placeholder">
                <Icon name="briefcase" size={48} color="var(--color-text-muted)" />
                <h3>No Level Selected</h3>
                <p>Choose a Grade Pay scale from the list on the left to review details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: CITY CLASS HRA */}
      {/* ========================================== */}
      {activeTab === 'cityHras' && (
        <div className="app-settings-split animate-fadeIn">
          {/* Left panel list */}
          <div className="app-settings-list">
            <div className="app-settings-list__filters">
              <div className="settings-page__search-input-wrapper" style={{ flex: 1 }}>
                <Input
                  id="city-search"
                  type="text"
                  placeholder="Search City Classes..."
                  iconName="search"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  variant="borderless"
                />
              </div>
            </div>

            <div className="app-settings-list__cards">
              {isLoadingCityHras ? (
                <div className="app-settings-list__loading">
                  <Icon name="spinner" size={24} className="settings-modal-form__spinner" />
                  <span>Loading City Classes...</span>
                </div>
              ) : filteredCityHras.length === 0 ? (
                <p className="app-settings-list__empty">No city class HRA rates found.</p>
              ) : (
                filteredCityHras.map((hra) => (
                  <div
                    key={hra.id}
                    className={`setting-item-card ${
                      selectedCityHra?.id === hra.id ? 'setting-item-card--selected' : ''
                    }`}
                    onClick={() => setSelectedCityHra(hra)}
                  >
                    <div className="setting-item-card__header">
                      <span className="setting-item-card__main-badge">CLASS {hra.classCode}</span>
                      <span
                        className={`setting-item-card__user-badge ${
                          hra.isActive
                            ? 'setting-item-card__user-badge--user'
                            : 'setting-item-card__user-badge--system'
                        }`}
                      >
                        {hra.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="setting-item-card__sub-code">{hra.className}</h4>
                    <div className="setting-item-card__value-row">
                      <span className="setting-item-card__val">HRA Rate: {hra.hraPercentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel details */}
          <div className="app-settings-details">
            {selectedCityHra ? (
              <div className="app-settings-details__card animate-fadeIn">
                <div className="app-settings-details__header">
                  <div>
                    <span className="app-settings-details__category-label">
                      CITY CLASS HRA RATE
                    </span>
                    <h2 className="app-settings-details__title">{selectedCityHra.className}</h2>
                    <p className="app-settings-details__subtitle" style={{ marginTop: '4px' }}>Class Code: {selectedCityHra.classCode}</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEditCityOpen(selectedCityHra)}
                  >
                    <Icon name="edit" size={14} />
                    <span>Edit Rate</span>
                  </Button>
                </div>

                <div className="app-settings-details__body">
                  <div className="app-settings-details__field">
                    <label className="app-settings-details__label">HRA Allowance Percentage</label>
                    <div className="app-settings-details__value-box" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary-border)' }}>
                      <span className="app-settings-details__value-main" style={{ color: 'var(--color-primary)' }}>
                        {selectedCityHra.hraPercentage}%
                      </span>
                    </div>
                  </div>

                  {selectedCityHra.description && (
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Description / Scope</label>
                      <p className="app-settings-details__description-text">
                        {selectedCityHra.description}
                      </p>
                    </div>
                  )}

                  <div className="app-settings-details__grid">
                    <div className="app-settings-details__field">
                      <label className="app-settings-details__label">Status</label>
                      <span className={`settings-page__status-badge ${selectedCityHra.isActive ? 'settings-page__status-badge--active' : 'settings-page__status-badge--inactive'}`}>
                        {selectedCityHra.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '20px', paddingTop: '20px' }}>
                    <div className="app-settings-details__grid">
                      <div className="app-settings-details__field">
                        <label className="app-settings-details__label">Created By</label>
                        <span className="app-settings-details__info-text">{selectedCityHra.createdBy || 'SYSTEM'}</span>
                      </div>
                      <div className="app-settings-details__field">
                        <label className="app-settings-details__label">Created On</label>
                        <span className="app-settings-details__info-text">
                          {selectedCityHra.createdOn ? new Date(selectedCityHra.createdOn).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      {selectedCityHra.modifiedBy && (
                        <div className="app-settings-details__field">
                          <label className="app-settings-details__label">Modified By</label>
                          <span className="app-settings-details__info-text">{selectedCityHra.modifiedBy}</span>
                        </div>
                      )}
                      {selectedCityHra.lastModifiedOn && (
                        <div className="app-settings-details__field">
                          <label className="app-settings-details__label">Last Modified On</label>
                          <span className="app-settings-details__info-text">
                            {new Date(selectedCityHra.lastModifiedOn).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="app-settings-details__placeholder">
                <Icon name="building" size={48} color="var(--color-text-muted)" />
                <h3>No Class Selected</h3>
                <p>Select a City Class from the list to view HRA rate details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* GRADE PAY EDIT/CREATE MODAL */}
      {/* ========================================== */}
      <Modal
        isOpen={isGpModalOpen}
        onClose={() => !isSavingGp && setIsGpModalOpen(false)}
        title={editingGpId ? "Edit Grade Pay Level" : "Add Grade Pay Level"}
        maxWidth="500px"
      >
        <form onSubmit={handleSaveGp} className="settings-modal-form">
          {gpModalError && (
            <div className="settings-modal-form__error-banner">
              <Icon name="alertCircle" size={16} />
              <span>{gpModalError}</span>
            </div>
          )}

          <div className="settings-modal-form__grid">
            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Department</label>
              <select
                id="gp-form-dept"
                className="settings-page__select w-full"
                value={gpDeptId}
                onChange={(e) => {
                  setGpDeptId(e.target.value);
                  setGpDesignationId(''); // Reset designation when department changes
                }}
                disabled={isSavingGp}
              >
                <option value="">Select Department...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Designation</label>
              <select
                id="gp-form-desg"
                className="settings-page__select w-full"
                value={gpDesignationId}
                onChange={(e) => setGpDesignationId(e.target.value)}
                disabled={isSavingGp || !gpDeptId}
              >
                <option value="">Select Designation...</option>
                {designations
                  .filter((desg) => desg.departmentId === gpDeptId)
                  .map((desg) => (
                    <option key={desg.id} value={desg.id}>
                      {desg.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Grade Pay Code *</label>
              <Input
                id="gp-form-code"
                type="text"
                placeholder="e.g. GP-4200"
                value={gpCode}
                onChange={(e) => setGpCode(e.target.value)}
                disabled={isSavingGp}
                required
              />
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Title / Level Description *</label>
              <Input
                id="gp-form-title"
                type="text"
                placeholder="e.g. Grade Pay 4200 (Technical)"
                value={gpTitle}
                onChange={(e) => setGpTitle(e.target.value)}
                disabled={isSavingGp}
                required
              />
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Pay Band Minimum (₹) *</label>
              <Input
                id="gp-form-min"
                type="number"
                step="0.01"
                placeholder="e.g. 9300.00"
                value={gpPayBandMin}
                onChange={(e) => setGpPayBandMin(e.target.value)}
                disabled={isSavingGp}
                required
              />
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Pay Band Maximum (₹) *</label>
              <Input
                id="gp-form-max"
                type="number"
                step="0.01"
                placeholder="e.g. 34800.00"
                value={gpPayBandMax}
                onChange={(e) => setGpPayBandMax(e.target.value)}
                disabled={isSavingGp}
                required
              />
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Grade Pay Amount (₹) *</label>
              <Input
                id="gp-form-amount"
                type="number"
                step="0.01"
                placeholder="e.g. 4200.00"
                value={gpGradePayAmount}
                onChange={(e) => setGpGradePayAmount(e.target.value)}
                disabled={isSavingGp}
                required
              />
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Entry Basic (Calculated)</label>
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: 'var(--color-text-light)',
                  fontWeight: '600'
                }}
              >
                ₹{(!isNaN(Number(gpPayBandMin)) && !isNaN(Number(gpGradePayAmount)))
                  ? (Number(gpPayBandMin) + Number(gpGradePayAmount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })
                  : '0.00'
                }
              </div>
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Status</label>
              <div className="settings-modal-form__toggle-row">
                <button
                  type="button"
                  className={`settings-modal-form__toggle-btn ${
                    gpIsActive ? 'settings-modal-form__toggle-btn--active' : ''
                  }`}
                  onClick={() => setGpIsActive(true)}
                  disabled={isSavingGp}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`settings-modal-form__toggle-btn ${
                    !gpIsActive ? 'settings-modal-form__toggle-btn--active' : ''
                  }`}
                  onClick={() => setGpIsActive(false)}
                  disabled={isSavingGp}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div className="settings-modal-form__actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsGpModalOpen(false)}
              disabled={isSavingGp}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSavingGp}
            >
              {isSavingGp ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================== */}
      {/* CITY HRA EDIT MODAL */}
      {/* ========================================== */}
      <Modal
        isOpen={isCityModalOpen}
        onClose={() => !isSavingCity && setIsCityModalOpen(false)}
        title="Edit City Class HRA Percentage"
        maxWidth="500px"
      >
        <form onSubmit={handleSaveCity} className="settings-modal-form">
          {cityModalError && (
            <div className="settings-modal-form__error-banner">
              <Icon name="alertCircle" size={16} />
              <span>{cityModalError}</span>
            </div>
          )}

          <div className="settings-modal-form__grid">
            {/* Read-Only City Class Info */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>City Class Code</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text-heading)' }}>
                  {selectedCityHra?.classCode}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Class Name</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                  {selectedCityHra?.className}
                </span>
              </div>
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">HRA Percentage (%) *</label>
              <Input
                id="city-form-percentage"
                type="number"
                step="0.01"
                placeholder="e.g. 27.00"
                value={cityHraPercentage}
                onChange={(e) => setCityHraPercentage(e.target.value)}
                disabled={isSavingCity}
                required
              />
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Description</label>
              <textarea
                id="city-form-description"
                className="settings-page__select w-full"
                style={{ height: '80px', padding: '10px', fontSize: '13.5px' }}
                placeholder="Details of cities included"
                value={cityDescription}
                onChange={(e) => setCityDescription(e.target.value)}
                disabled={isSavingCity}
              />
            </div>

            <div className="settings-modal-form__field">
              <label className="settings-modal-form__label">Status</label>
              <div className="settings-modal-form__toggle-row">
                <button
                  type="button"
                  className={`settings-modal-form__toggle-btn ${
                    cityIsActive ? 'settings-modal-form__toggle-btn--active' : ''
                  }`}
                  onClick={() => setCityIsActive(true)}
                  disabled={isSavingCity}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`settings-modal-form__toggle-btn ${
                    !cityIsActive ? 'settings-modal-form__toggle-btn--active' : ''
                  }`}
                  onClick={() => setCityIsActive(false)}
                  disabled={isSavingCity}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div className="settings-modal-form__actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCityModalOpen(false)}
              disabled={isSavingCity}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSavingCity}
            >
              {isSavingCity ? 'Saving...' : 'Update'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
