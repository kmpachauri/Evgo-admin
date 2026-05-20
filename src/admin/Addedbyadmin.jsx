import React, { useEffect, useState } from 'react';
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/common/LoadinSpinner';
import useAuth from '../hooks/useAuth';
import CIcon from '@coreui/icons-react';
import { cilHistory, cilPeople } from '@coreui/icons';

const Addedbyadmin = () => {
  const { fetchData } = useAxios();
  const [settings, setSettings] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('referrals');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const { loginAsAdmin } = useAuth();

  const getUserLists = async () => {
    try {
      setLoading(true);
      const res = await fetchData({
        url: '/api/v1/admin/user/admin-referals',
      });
      const referrals = res?.referrals || [];
      setSettings(referrals);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch admin referred users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHistory = async () => {
    try {
      setHistoryLoading(true);
      setError(null);
      const res = await fetchData({
        url: '/api/v1/admin/user/admin-update-user-history',
        method: 'GET'
      });

      if (res.success) {
        setHistory(res.data.history || []);
      } else {
        setError(res.message || 'Failed to fetch user history');
      }
    } catch (err) {
      console.error('Error fetching user history:', err);
      setError('Failed to fetch user history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'referrals') {
      getUserLists();
    } else {
      fetchUserHistory();
    }
  }, [activeTab]);

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(6);
    }
    return value;
  };

  return (
    <CCard className="mb-4">
      <CCardBody>
        <CNav variant="underline" className="mb-4">
          <CNavItem>
            <CNavLink
              active={activeTab === 'referrals'}
              onClick={() => setActiveTab('referrals')}
              className="px-4 py-3"
              style={{
                color: activeTab === 'referrals' ? '#321fdb' : '#6c757d',
                fontWeight: '500',
                borderBottomWidth: '3px',
                borderBottomColor: activeTab === 'referrals' ? '#321fdb' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <CIcon icon={cilPeople} className="me-2" />
              Member List
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              className="px-4 py-3"
              style={{
                color: activeTab === 'history' ? '#321fdb' : '#6c757d',
                fontWeight: '500',
                borderBottomWidth: '3px',
                borderBottomColor: activeTab === 'history' ? '#321fdb' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <CIcon icon={cilHistory} className="me-2" />
              Update History
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane visible={activeTab === 'referrals'}>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError(null)}>
                {error}
              </CAlert>
            )}
            {loading ? (
              <div className="text-center"><LoadingSpinner /></div>
            ) : (
              <CTable align="middle" bordered hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">S.No.</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">User ID</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Invested</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Fund Balance</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {settings.length > 0 ? (
                    settings.map((item, index) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                        <CTableDataCell className="text-center">{item?.userId}</CTableDataCell>
                        <CTableDataCell className="text-center">{item?.totalInvested?.toFixed(2)}</CTableDataCell>
                        <CTableDataCell className="text-center">{item?.fundBalance?.toFixed(2)}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center text-muted">
                        No data found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CTabPane>

          <CTabPane visible={activeTab === 'history'}>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError(null)}>
                {error}
              </CAlert>
            )}
            {historyLoading ? (
              <div className="text-center"><CSpinner /></div>
            ) : (
              <CTable align="middle" bordered hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">User ID</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Username</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Field Changed</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Old Value</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">New Value</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>{item.userId}</CTableDataCell>
                        <CTableDataCell>{item.username}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">{item.field}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{formatValue(item.oldValue)}</CTableDataCell>
                        <CTableDataCell>{formatValue(item.newValue)}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(item.createdAt).toLocaleString()}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center text-muted">
                        No history records found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  );
};

export default Addedbyadmin;