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


function TransferHistory() {
      const { fetchData, loading } = useAxios();

  const [withdrawals, setWithdrawals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    fromUserId: '',
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchWithdrawals = async () => {
  try {
    const res = await fetchData({ url: `/api/v1/user/payment/all-transfer-history` });
    if (res?.data) {
        console.log(res.data)
      setWithdrawals(res.data);
      setFiltered(res.data);
    } else {
      toast.error('No withdraw history found');
    }
  } catch (err) {
    toast.error('Failed to fetch withdraw history');
  }
}

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleSearch = () => {
    let filteredList = [...withdrawals];

    if (filters.fromUserId) {
      filteredList = filteredList.filter((item) =>
        item.fromUserId.toLowerCase().includes(filters.fromUserId.toLowerCase())
      );
    }

    if (filters.from) {
      filteredList = filteredList.filter(
        (item) => new Date(item.createdAt) >= new Date(filters.from)
      );
    }

    if (filters.to) {
      filteredList = filteredList.filter(
        (item) => new Date(item.createdAt) <= new Date(filters.to)
      );
    }

    setFiltered(filteredList);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ fromUserId: '', from: '', to: '' });
    setFiltered(withdrawals);
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
            label="Sender"
            placeholder="e.g. USDT.TRC20"
            value={filters.fromUserId}
            onChange={(e) => setFilters({ ...filters, fromUserId: e.target.value })}
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
              <CTableHeaderCell>Sender</CTableHeaderCell>
              <CTableHeaderCell>Receiver</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              {/* <CTableHeaderCell>Wallet($)</CTableHeaderCell> */}
              <CTableHeaderCell>Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item, index) => {
              const date = new Date(item.createdAt);
              return (
                <CTableRow key={item._id}>
                  <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                  <CTableDataCell>{item.fromUserId}</CTableDataCell>
                  <CTableDataCell>{item.toUserId}</CTableDataCell>
                  <CTableDataCell>{item.amount}</CTableDataCell>
          
                     <CTableDataCell className="text-center">
                                     {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
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
}

export default TransferHistory

