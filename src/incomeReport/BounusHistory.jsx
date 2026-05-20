import React, { useEffect, useState } from 'react'
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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle
} from '@coreui/react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadinSpinner';
import useAxios from '../hooks/useAxios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import apiRoutes from '../variables/apiRoutes';
import color from '../views/color';

function BounusHistory() {
  const { fetchData, loading } = useAxios();

  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const itemsPerPage = 10;
  const MySwal = withReactContent(Swal);

  const fetchRoyaltyHistory = async () => {
    try {
      const res = await fetchData({ url: apiRoutes.bounusHistory, method: 'GET' });
      if (res?.data) {
        setHistory(res.data);
        setFiltered(res.data);
      } else {
        toast.error('No royalty history found');
      }
    } catch (err) {
      toast.error('Failed to fetch royalty history');
    }
  };

  useEffect(() => {
    fetchRoyaltyHistory();
  }, []);

  const handleDailyRoi = async () => {
    try {
      setShowConfirmModal(false); // Close the confirmation modal
      const res = await fetchData({
        url: apiRoutes.dailyRoi,
        method: 'POST'
      });

      if (res?.success) {
        toast.success('Daily ROI distributed successfully!');
        // Refresh the history after distributing ROI
        fetchRoyaltyHistory();
      } else {
        toast.error(res?.message || 'Failed to distribute Daily ROI');
      }
    } catch (err) {
      toast.error('Error distributing Daily ROI');
      console.error('Daily ROI error:', err);
    }
  };

  const handleDailyRoiConfirm = async () => {
    const result = await MySwal.fire({
      title: 'Confirm Daily ROI Distribution',
      text: 'Are you sure you want to distribute Daily ROI to all eligible users? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Distribute ROI',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      handleDailyRoi(); // 👈 your API function call
    }
  };

  const handleSearch = () => {
    let result = [...history];

    if (filters.userId) {
      result = result.filter((item) =>
        item.userId.toString().toLowerCase().includes(filters.userId.toLowerCase().trim())
      );
    }

    if (filters.from) {
      result = result.filter((item) => new Date(item.date) >= new Date(filters.from));
    }

    if (filters.to) {
      result = result.filter((item) => new Date(item.date) <= new Date(filters.to));
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ userId: '', from: '', to: '' });
    setFiltered(history);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const generatePageNumbers = (currentPage, totalPages) => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }


  return (
    <>
      {loading && <LoadingSpinner />}

      {/* Confirmation Modal */}
      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Daily ROI Distribution</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to distribute Daily ROI to all eligible users?
          This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleDailyRoi}>
            Yes, Distribute ROI
          </CButton>
        </CModalFooter>
      </CModal>

      <CRow className="mb-3">
        <CCol md={2}>
          <CFormInput
            label="User ID"
            placeholder="Enter User ID"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
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
        <CCol md={3} className="d-flex align-items-end gap-1">
          <CButton color="primary" onClick={handleSearch}   style={{
                    background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                    color: 'white',
                  }}>
            Search
          </CButton>
          <CButton color="secondary" onClick={handleReset}>
            Reset
          </CButton>
          {/* <CButton
            color="warning"
            onClick={handleDailyRoiConfirm}
            className="d-flex align-items-center justify-content-center text-nowrap"
          >
            Daily ROI
          </CButton> */}


        </CCol>
      </CRow>

      <div className="table-responsive">
        <CTable hover bordered className="text-nowrap">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              {/* <CTableHeaderCell>Left</CTableHeaderCell>
              <CTableHeaderCell>Right</CTableHeaderCell> */}
              <CTableHeaderCell>Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                <CTableDataCell>{item.userId || "N/A"}</CTableDataCell>
                <CTableDataCell>{item.amount || "N/A"}</CTableDataCell>
                {/* <CTableDataCell>{item.left || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.right || 'N/A'}</CTableDataCell> */}
                <CTableDataCell>{new Date(item.date).toLocaleDateString() || "N/A"}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
        </div>

        <div>
          {generatePageNumbers(currentPage, totalPages).map((page, index) =>
            page === '...' ? (
              <CButton key={`ellipsis-${index}`} size="sm" color="light" className="me-1" disabled>
                ...
              </CButton>
            ) : (
              <CButton
                key={page}
                size="sm"
                color={page === currentPage ? 'dark' : 'light'}
                className="me-1"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </CButton>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default BounusHistory;