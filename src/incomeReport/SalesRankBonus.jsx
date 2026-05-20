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
} from '@coreui/react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadinSpinner';
import useAxios from '../hooks/useAxios';
import color from '../views/color';

function SalesRankBonus() {
  const { fetchData, loading } = useAxios();

  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRoyaltyHistory = async () => {
    try {
      const res = await fetchData({ url: '/api/v1/admin/user/pair-history' });
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

  const handleSearch = () => {
    let result = [...history];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter((item) =>
        (item.amount?.toString().toLowerCase().includes(searchTerm)) ||
        (item.userId?.toString().toLowerCase().includes(searchTerm)) ||
        (item.name?.toLowerCase().includes(searchTerm)) ||
        (new Date(item.date).toLocaleDateString().toLowerCase().includes(searchTerm))
      );
    }

    //     if (filters.amount) {
    //   result = result.filter((item) =>
    //     item.amount.toString().toLowerCase().includes(filters.amount.toLowerCase().trim())
    //   );
    // }

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
    setFilters({ search: '', from: '', to: '' });
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


  // const fields = [
  //   { key: "userId", label: "User Id" },
  //   { key: "title", label: "Title" },
  //   { key: "mrp", label: "Name" },
  //   { key: "sp", label: "ProductId" },
  //   { key: "dp", label: "phone" },
  //   { key: "walletBalance", label: "Wallet Balance" },
  //   { key: "sponsor", label: "Sponsor" },
  // ];

  return (
    <>
      {loading && <LoadingSpinner />}

      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="Search"
            placeholder="Enter User id ,Amount"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
          <CButton color="primary" onClick={handleSearch} style={{
            background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
            color: 'white',
          }}>
            Search
          </CButton>
          <CButton color="secondary" onClick={handleReset}>
            Reset
          </CButton>
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
              <CTableHeaderCell>Right</CTableHeaderCell>  */}

              <CTableHeaderCell>Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                <CTableDataCell>{item.userId || 'N/A'}</CTableDataCell>

                <CTableDataCell>{item.amount}</CTableDataCell>
                {/* <CTableDataCell>{item.left || 'N/A'}</CTableDataCell>
                <CTableDataCell>{item.right || 'N/A'}</CTableDataCell> */}

                <CTableDataCell>{new Date(item.date).toLocaleDateString()}</CTableDataCell>
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

export default SalesRankBonus
