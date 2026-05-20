import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CBadge,
    CImage,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CPagination,
    CPaginationItem,
    CCollapse,
    CTooltip,
    CRow,
    CCol
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilMagnifyingGlass,
    cilFilter,
    cilInfo,
    cilCheckCircle,
    cilX,
    cilZoom,
    cilChevronTop,
    cilChevronBottom
} from "@coreui/icons";
import useAxios, { imgBaseUrl } from "../../hooks/useAxios";
import Swal from "sweetalert2";
import LoadingSpinner from "../common/LoadinSpinner";

const UserInvestment = () => {
    const { fetchData, loading } = useAxios();
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailModal, setDetailModal] = useState(false);
    const [screenshotModal, setScreenshotModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);
    const [remark, setRemark] = useState("");
    const itemsPerPage = 5;

    const loadData = async () => {
        try {
            const res = await fetchData({
                url: `/api/v1/user/auth/get-buy-request`,
                method: "get",
            });

            if (res.success) {
                setRequests(res.data);
                setFilteredRequests(res.data);
            }
        } catch (err) {
            console.error("Error fetching buy requests:", err);
        }
    };



    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let results = requests;

        // Apply search filter
        if (searchTerm) {
            results = results.filter(req =>
                req.userId?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            results = results.filter(req => req.status === statusFilter);
        }

        setFilteredRequests(results);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, statusFilter, requests]);

    const handleAction = async (id, action, remark) => {
        try {
            const res = await fetchData({
                url: `/api/v1/user/auth/admin-approve-reject/${id}`,
                method: "post",
                data: {
                    action: action.toUpperCase(),
                    remark: remark || "", // 👈 हमेशा भेजो
                },
            });

            if (res.success) {
                setRequests((prev) =>
                    prev.map((req) =>
                        req._id === id ? { ...req, status: action.toUpperCase(), remark } : req
                    )
                );
                loadData();
            }
        } catch (err) {
            console.error("Error in approve/reject:", err);
        }
    };




    const toggleRowExpansion = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="user-investment-container">
            <CCard className="custom-card">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Users Investment</h5>
                    <CBadge color="primary">{filteredRequests.length} requests</CBadge>
                </CCardHeader>

                <CCardBody>
                    {/* Filters */}
                    <div className="filters-section mb-3">
                        <CRow>
                            <CCol md={6}>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilMagnifyingGlass} />
                                    </CInputGroupText>
                                    <CFormInput
                                        placeholder="Search by user ID, email or transaction ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </CInputGroup>
                            </CCol>
                            <CCol md={3}>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon={cilFilter} />
                                    </CInputGroupText>
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </CInputGroup>
                            </CCol>
                            <CCol md={3}>
                                <CButton color="primary" className="w-100" onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                }}>
                                    Clear Filters
                                </CButton>
                            </CCol>
                        </CRow>
                    </div>

                    {/* Requests Table */}
                    <div className="table-responsive">
                        <CTable striped hover responsive className="investment-table">
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell width="5%"></CTableHeaderCell>
                                    <CTableHeaderCell>User</CTableHeaderCell>
                                    <CTableHeaderCell>Plan Amount</CTableHeaderCell>
                                    <CTableHeaderCell>Transaction ID</CTableHeaderCell>
                                    <CTableHeaderCell>Screenshot</CTableHeaderCell>
                                    <CTableHeaderCell>Status</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentRequests.length === 0 ? (
                                    <CTableRow>
                                        <CTableDataCell colSpan="8" className="text-center py-4">
                                            No investment requests found
                                        </CTableDataCell>
                                    </CTableRow>
                                ) : (
                                    currentRequests.map((req) => (
                                        <React.Fragment key={req._id}>
                                            <CTableRow className="main-row">
                                                <CTableDataCell>
                                                    <CButton
                                                        color="link"
                                                        size="sm"
                                                        onClick={() => toggleRowExpansion(req._id)}
                                                    >
                                                        <CIcon icon={expandedRows.includes(req._id) ? cilChevronTop : cilChevronBottom} />
                                                    </CButton>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="user-info">
                                                        <div className="user-id"><strong>{req.userId?.userId}</strong></div>
                                                        <div className="user-email text-muted small">{req.userId?.email || "N/A"}</div>
                                                        <div className="user-phone text-muted small">{req.userId?.phone || "N/A"}</div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {req.planId ? (req.baseAmount) : "N/A"}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <span className="transaction-id">{req.transactionId}</span>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {req.screenshot ? (
                                                        <div className="screenshot-container">
                                                            <CImage
                                                                src={`${imgBaseUrl}/${req.screenshot.replace("\\", "/")}`}
                                                                thumbnail
                                                                width={60}
                                                                height={45}
                                                                onClick={() => {
                                                                    setSelectedRequest(req);
                                                                    setScreenshotModal(true);
                                                                }}
                                                                className="screenshot-thumbnail"
                                                            />
                                                            <CTooltip content="View larger">
                                                                <CButton
                                                                    color="link"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedRequest(req);
                                                                        setScreenshotModal(true);
                                                                    }}
                                                                >
                                                                    <CIcon icon={cilZoom} />
                                                                </CButton>
                                                            </CTooltip>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">No screenshot</span>
                                                    )}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge
                                                        color={
                                                            req.status === "APPROVED"
                                                                ? "success"
                                                                : req.status === "REJECTED"
                                                                    ? "danger"
                                                                    : "warning"
                                                        }
                                                        className="status-badge"
                                                    >
                                                        {req.status}
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="small text-muted">
                                                        {formatDate(req.createdAt)}
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="action-buttons">
                                                        <CTooltip content="View details">
                                                            <CButton
                                                                color="info"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => {
                                                                    setSelectedRequest(req);
                                                                    setDetailModal(true);
                                                                }}
                                                            >
                                                                <CIcon icon={cilInfo} />
                                                            </CButton>
                                                        </CTooltip>

                                                        {req.status === "PENDING" && (
                                                            <>
                                                                {/* Approve with SweetAlert confirm */}
                                                                <CTooltip content="Approve">
                                                                    <CButton
                                                                        color="success"
                                                                        size="sm"
                                                                        className="me-2"
                                                                        onClick={() => {
                                                                            Swal.fire({
                                                                                title: "Are you sure?",
                                                                                text: "You want to APPROVE this request!",
                                                                                icon: "warning",
                                                                                showCancelButton: true,
                                                                                confirmButtonText: "Yes, Approve",
                                                                                cancelButtonText: "Cancel",
                                                                                confirmButtonColor: "#28a745",
                                                                                cancelButtonColor: "#6c757d",
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    handleAction(req._id, "APPROVE", "");
                                                                                    Swal.fire("Approved!", "The request has been approved.", "success");
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <CIcon icon={cilCheckCircle} />
                                                                    </CButton>
                                                                </CTooltip>

                                                                {/* Reject with SweetAlert confirm + remark input */}
                                                                <CTooltip content="Reject">
                                                                    <CButton
                                                                        color="danger"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            Swal.fire({
                                                                                title: "Reject Request?",
                                                                                text: "Please enter reason for rejection",
                                                                                input: "text",
                                                                                inputPlaceholder: "Reason is required",
                                                                                inputValidator: (value) => {
                                                                                    if (!value) {
                                                                                        return "Remark is required!";
                                                                                    }
                                                                                },
                                                                                icon: "warning",
                                                                                showCancelButton: true,
                                                                                confirmButtonText: "Yes, Reject",
                                                                                cancelButtonText: "Cancel",
                                                                                confirmButtonColor: "#d33",
                                                                                cancelButtonColor: "#6c757d",
                                                                            }).then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    handleAction(req._id, "REJECT", result.value);
                                                                                    Swal.fire("Rejected!", "The request has been rejected.", "success");
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <CIcon icon={cilX} />
                                                                    </CButton>
                                                                </CTooltip>

                                                            </>
                                                        )}

                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>

                                            {/* Expanded details row */}
                                            <CCollapse visible={expandedRows.includes(req._id)}>
                                                <CTableRow className="detail-row">
                                                    <CTableDataCell colSpan="8">
                                                        <div className="p-3 bg-light rounded">
                                                            <h6>Investment Details</h6>
                                                            <CRow>
                                                                <CCol md={6}>
                                                                    <div><strong>Plan:</strong> {req.planId ? formatCurrency(req.planId.baseAmount) : "N/A"}</div>
                                                                    <div><strong>Net Amount:</strong> {req.planId ? formatCurrency(req.planId.netAmount) : "N/A"}</div>
                                                                    <div><strong>Daily Income:</strong> {req.planId ? formatCurrency(req.planId.dailyIncome) : "N/A"}</div>
                                                                </CCol>
                                                                <CCol md={6}>
                                                                    <div><strong>Monthly Income:</strong> {req.planId ? formatCurrency(req.planId.monthlyIncome) : "N/A"}</div>
                                                                    <div><strong>Annual Income:</strong> {req.planId ? formatCurrency(req.planId.annualIncome) : "N/A"}</div>
                                                                    {req.remark && (
                                                                        <div className="mt-2">
                                                                            <strong>Remark:</strong>
                                                                            <span className="text-danger"> {req.remark}</span>
                                                                        </div>
                                                                    )}
                                                                </CCol>
                                                            </CRow>
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            </CCollapse>
                                        </React.Fragment>
                                    ))
                                )}
                            </CTableBody>
                        </CTable>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <CPagination className="mt-3 justify-content-center">
                            <CPaginationItem
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </CPaginationItem>

                            {[...Array(totalPages)].map((_, index) => (
                                <CPaginationItem
                                    key={index + 1}
                                    active={currentPage === index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </CPaginationItem>
                            ))}

                            <CPaginationItem
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </CPaginationItem>
                        </CPagination>
                    )}
                </CCardBody>
            </CCard>

            {/* Detail Modal */}
            <CModal
                visible={detailModal}
                onClose={() => setDetailModal(false)}
                size="lg"
            >
                <CModalHeader>
                    <CModalTitle>Investment Request Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedRequest && (
                        <div>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <h6>User Information</h6>
                                    <div><strong>User ID:</strong> {selectedRequest.userId?.userId}</div>
                                    <div><strong>Email:</strong> {selectedRequest.userId?.email}</div>
                                    <div><strong>Phone:</strong> {selectedRequest.userId?.phone}</div>
                                </CCol>
                                <CCol md={6}>
                                    <h6>Investment Details</h6>
                                    <div><strong>Transaction ID:</strong> {selectedRequest.transactionId}</div>
                                    <div><strong>Status:</strong>
                                        <CBadge
                                            color={
                                                selectedRequest.status === "APPROVED"
                                                    ? "success"
                                                    : selectedRequest.status === "REJECTED"
                                                        ? "danger"
                                                        : "warning"
                                            }
                                            className="ms-2"
                                        >
                                            {selectedRequest.status}
                                        </CBadge>
                                    </div>
                                    <div><strong>Date:</strong> {formatDate(selectedRequest.createdAt)}</div>
                                </CCol>
                            </CRow>

                            {selectedRequest.planId && (
                                <>
                                    <h6>Plan Information</h6>
                                    <CRow>
                                        <CCol md={6}>
                                            <div><strong>Base Amount:</strong> {formatCurrency(selectedRequest.planId.baseAmount)}</div>
                                            <div><strong>Net Amount:</strong> {formatCurrency(selectedRequest.planId.netAmount)}</div>
                                            <div><strong>Daily Income:</strong> {formatCurrency(selectedRequest.planId.dailyIncome)}</div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div><strong>Monthly Income:</strong> {formatCurrency(selectedRequest.planId.monthlyIncome)}</div>
                                            <div><strong>Annual Income:</strong> {formatCurrency(selectedRequest.planId.annualIncome)}</div>
                                        </CCol>
                                    </CRow>
                                </>
                            )}

                            {selectedRequest.remark && (
                                <div className="mt-3">
                                    <h6>Remark</h6>
                                    <div className="text-danger">{selectedRequest.remark}</div>
                                </div>
                            )}
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDetailModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Screenshot Modal */}
            <CModal
                visible={screenshotModal}
                onClose={() => setScreenshotModal(false)}
                size="l"
            >
                <CModalHeader>
                    <CModalTitle>Transaction Screenshot</CModalTitle>
                </CModalHeader>
                <CModalBody className="text-center">
                    {selectedRequest && selectedRequest.screenshot && (
                        <img
                            src={`${imgBaseUrl}/${selectedRequest.screenshot.replace("\\", "/")}`}
                            alt="Transaction screenshot"
                            className="img-fluid"
                        />
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setScreenshotModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Reject Modal */}
            <CModal id="rejectModal" backdrop="static">
                <CModalHeader>
                    <CModalTitle>Reject Investment Request</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure you want to reject this investment request?</p>
                    <div className="mb-3">
                        <label htmlFor="remark" className="form-label">Reason for rejection (optional):</label>
                        <CFormInput
                            type="text"
                            id="remark"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="Enter reason for rejection"
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" data-coreui-dismiss="modal">
                        Cancel
                    </CButton>
                    <CButton
                        color="danger"
                        data-coreui-dismiss="modal"
                        onClick={() => selectedRequest && handleAction(selectedRequest._id, "REJECTED")}
                    >
                        Reject
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default UserInvestment;