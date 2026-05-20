import React, { useEffect, useState } from 'react';
import {
  CRow,
  CCol,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';

import toast from 'react-hot-toast';

import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/common/LoadinSpinner';

const InvestHistory = () => {
  const { fetchData, loading } = useAxios();

  const [investments, setInvestments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInvestments = async () => {
    try {
      const res = await fetchData({ url: '/api/v1/admin/user/invest-history' });
      if (res?.data) {
        setInvestments(res.data);
        setFiltered(res.data);
      } else {
        toast.error('No investment history found');
      }
    } catch (err) {
      toast.error('Failed to fetch investment history');
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleSearch = () => {
    let filteredList = [...investments];

    if (filters.username) {
      filteredList = filteredList.filter((inv) =>
        inv.userName.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    if (filters.from) {
      filteredList = filteredList.filter(
        (inv) => new Date(inv.purchasedAt) >= new Date(filters.from)
      );
    }

    if (filters.to) {
      filteredList = filteredList.filter(
        (inv) => new Date(inv.purchasedAt) <= new Date(filters.to)
      );
    }

    setFiltered(filteredList);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ username: '', from: '', to: '' });
    setFiltered(investments);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      {loading && <LoadingSpinner />}

      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="Username"
            placeholder="Enter username"
            value={filters.username}
            onChange={(e) => setFilters({ ...filters, username: e.target.value })}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="From Date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="To Date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </CCol>
        <CCol md={3} className="d-flex align-items-end gap-2">
          <CButton color="primary" onClick={handleSearch}>
            Search
          </CButton>
          <CButton color="info" onClick={handleReset}>
            Reset
          </CButton>
        </CCol>
      </CRow>

      <div className="table-responsive">
        <CTable hover bordered responsive className="text-nowrap">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S.No</CTableHeaderCell>
              <CTableHeaderCell>Username</CTableHeaderCell>
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Profit Earned</CTableHeaderCell>
              <CTableHeaderCell>Purchase Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((inv, index) => {
              const date = new Date(inv.purchasedAt);
              return (
                <CTableRow key={index}>
                  <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                  <CTableDataCell>{inv.userName}</CTableDataCell>
                  <CTableDataCell>${inv.price}</CTableDataCell>
                  <CTableDataCell>${inv.profitEarned}</CTableDataCell>
                  <CTableDataCell>
                    {date.toLocaleDateString()} <br />
                    <small className="text-muted">{date.toLocaleTimeString()}</small>
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <CButton
              key={i}
              size="sm"
              color={i + 1 === currentPage ? 'dark' : 'light'}
              className="me-1"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </CButton>
          ))}
        </div>
      </div>
    </>
  );
};

export default InvestHistory;

