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
import useAxios, { imgBaseUrl } from '../hooks/useAxios';
import LoadingSpinner from '../components/common/LoadinSpinner';
import Swal from 'sweetalert2';
import { exportToExcel, exportToPDF, exportToWordPress } from '../help/DownloadFiles';
import color from '../views/color';
import Export from '../views/Export';

function TopupApproved() {
  const { fetchData, loading } = useAxios();

  const [Topups, setTopups] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterText, setFilterText] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [screenshotModal, setScreenshotModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // helper function to normalize path
  const normalizePath = (path) => path?.replace(/\\/g, "/");

  // ✅ Fetch list
  const fetchTopups = async () => {
    try {
      const res = await fetchData({ url: '/api/v1/user/auth/topup-get' });
      if (res?.data) {
        // agar array directly res.data me hai
        const approvedTopups = (Array.isArray(res.data) ? res.data : res.data.data || [])
          .filter(item => item.status === 'approved');

        console.log("Approved Topups:", approvedTopups);

        setTopups(approvedTopups);
        setFiltered(approvedTopups);
      } else {
        toast.error('No withdraw history found');
      }
    } catch (err) {
      toast.error('Failed to fetch withdraw history');
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
    { key: "email", label: "Email" },
    { key: "amount", label: "Amount" },
    { key: "transactionId", label: "TransactionId" },
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
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Image</CTableHeaderCell>

            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
         
            <CTableRow key={item._id}>
              <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
              <CTableDataCell>{item.userId || "N/A"}</CTableDataCell>
              <CTableDataCell>{item.name || "N/A"}</CTableDataCell>
              <CTableDataCell>{item.email || "N/A"}</CTableDataCell>
              <CTableDataCell>{item.amount || "N/A"}</CTableDataCell>
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
             


              {/* <CTableDataCell>{item.upiId || "N/A"}</CTableDataCell> */}
              {/* <CTableDataCell>{item.accountNumber || "N/A"}</CTableDataCell> */}
              {/* <CTableDataCell>{item.ifscCode || "N/A"}</CTableDataCell> */}
              {/* <CTableDataCell>{item.bankName || "N/A"}</CTableDataCell> */}
              <CTableDataCell>
                {item.screenshot ? (
                  <img
                    src={`${imgBaseUrl}/${normalizePath(item.screenshot)}`}
                    alt="Passbook"
                    style={{ width: '180px', height: '80px', objectFit: 'contain', borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedImage(`${imgBaseUrl}/${normalizePath(item.screenshot)}`);
                      setScreenshotModal(true);
                    }}
                  />
                ) : (
                  'No Image'
                )}
              </CTableDataCell>
              {/* <CTableDataCell>
                    {item.pancardPhoto ? (
                      <img
                        src={`${imgBaseUrl}/${normalizePath(item.pancardPhoto)}`}
                        alt="Pancard"
                        style={{ width: '180px', height: '80px', objectFit: 'contain', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedImage(`${imgBaseUrl}/${normalizePath(item.pancardPhoto)}`);
                          setScreenshotModal(true);
                        }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </CTableDataCell> */}


            </CTableRow>
            ))
            ) : (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center text-muted">
                No data found
              </CTableDataCell>
            </CTableRow>
                       )}
          </CTableBody>
        </CTable>
      </div>

      {/* Modal for large image */}
      <CModal
        visible={screenshotModal}
        onClose={() => setScreenshotModal(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Preview Image</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '10px' }}
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setScreenshotModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

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
