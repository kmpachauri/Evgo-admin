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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import toast from 'react-hot-toast';
import useAxios from '../hooks/useAxios';
import LoadingSpinner from '../components/common/LoadinSpinner';
import Swal from 'sweetalert2';
import { exportToExcel, exportToPDF, exportToWordPress } from '../help/DownloadFiles';
import color from '../views/color';
import Export from '../views/Export';

function TopupApproved() {
  const { fetchData, loading } = useAxios();

  const [Topups, setTopups] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch list
  const fetchTopups = async () => {
    try {
      const res = await fetchData({ url: '/admin/recharges?status=approved' });
      const rows = res?.data || [];
      const approvedTopups = rows.map((item) => ({
        ...item,
        userId: item.user?.userId || 'N/A',
        name: item.user?.name || 'N/A',
        transactionId: item.utrNumber || '',
        processedAt: item.approvedAt || item.updatedAt || item.createdAt,
      }));

      setTopups(approvedTopups);
      setFiltered(approvedTopups);
    } catch (err) {
      toast.error('Failed to fetch deposit history');
    }
  };

  useEffect(() => {
    fetchTopups();
  }, []);

  // ✅ Approve API



  // ✅ Filter functions
  const handleSearch = () => {
    let filteredList = [...Topups];

    if (filters.userId) {
      filteredList = filteredList.filter((item) =>
        item.userId.toLowerCase().includes(filters.userId.toLowerCase())
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
    setFilters({ userId: '', from: '', to: '' });
    setFiltered(Topups);
    setCurrentPage(1);
  };

  // ✅ Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);



  const fields = [
    { key: "userId", label: "User Id" },
    { key: "name", label: "Name" },
    { key: "amount", label: "Amount" },
    { key: "transactionId", label: "UTR Number" },
    { key: "paymentMethod", label: "Method" },
    { key: "planName", label: "Plan" },
  ];


  return (
    <>
      {loading && <LoadingSpinner />}

      {/* Filters */}
      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="userId"
            placeholder="Enter userId"
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

          
          <Export userdata={Topups} fields={fields} />


        </CCol>
      </CRow>

      {/* Table */}
      <div className="table-responsive">
        <CTable hover bordered responsive className="text-nowrap">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S.No</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>UTR Number</CTableHeaderCell>
              <CTableHeaderCell>Method</CTableHeaderCell>
              <CTableHeaderCell>Plan</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>

            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
         
            <CTableRow key={item._id}>
              <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
              <CTableDataCell>{item.userId || "N/A"}</CTableDataCell>
              <CTableDataCell>{item.name || "N/A"}</CTableDataCell>
              <CTableDataCell>{item.amount || "N/A"}</CTableDataCell>
              <CTableDataCell>{item.transactionId || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item.paymentMethod || 'N/A'}</CTableDataCell>
              <CTableDataCell>{item.plan?.name || item.planName || 'Wallet Credit'}</CTableDataCell>
               <CTableDataCell>
                {item.processedAt
                  ? new Date(item.processedAt).toLocaleString()
                  : "N/A"}
              </CTableDataCell>
              <CTableDataCell>
                <span
                  className={`badge ${item.status === "pending"
                    ? "bg-warning"
                    : item.status === "approved"
                      ? "bg-success"
                      : item.status === "rejected"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                >
                  {item.status}
                </span>
              </CTableDataCell>

            </CTableRow>
            ))
            ) : (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center text-muted">
                No data found
              </CTableDataCell>
            </CTableRow>
                       )}
          </CTableBody>
        </CTable>
      </div>

      {/* Pagination */}
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

export default TopupApproved;
