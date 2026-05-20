import React, { useEffect, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CPagination,
  CPaginationItem,
  CCard,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import color from "../../color";
import Export from "../../Export";

const PendingOrders = () => {
  const [userdata, setUserdata] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { fetchData } = useAxios();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: "",
    from: "",
    to: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModal, setDetailsModal] = useState(false);

  // ✅ Fetch all orders
  const getUserLists = async () => {
    try {
      const data = await fetchData({
        url: "/api/v1/user/order/get-all",
        method: "GET",
      });

      if (data.success) {
        const pendingOrders = data.data.filter(
          (order) => order.status === "pending"
        );
        setUserdata(pendingOrders);
        setFiltered(pendingOrders);
      } else toast.error("Failed to fetch orders");
    } catch (error) {
      console.error(error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    getUserLists();
  }, []);

  // ✅ Search Filter
  const handleSearch = () => {
    let list = [...userdata];
    if (filters.search) {
      const term = filters.search.toLowerCase().trim();
      list = list.filter(
        (order) =>
          order.name?.toLowerCase().includes(term) ||
          order.id?.toLowerCase().includes(term)
      );
    }

    if (filters.from)
      list = list.filter(
        (o) => new Date(o.createdAt) >= new Date(filters.from)
      );
    if (filters.to)
      list = list.filter((o) => new Date(o.createdAt) <= new Date(filters.to));

    setFiltered(list);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ search: "", from: "", to: "" });
    setFiltered(userdata);
    setCurrentPage(1);
  };

  // ✅ Update status
  const handleUpdateStatus = async (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${status.toUpperCase()} this order?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "approved" ? "#28a745" : "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetchData({
            url: `/api/v1/user/order/update-order/${id}`,
            method: "PUT",
            data: { status },
          });

          if (res?.success) {
            Swal.fire(
              "Success",
              res.message || `Order ${status} successfully!`,
              "success"
            );
            getUserLists();
          } else {
            Swal.fire("Error!", res?.message || "Failed to update order", "error");
          }
        } catch (err) {
          Swal.fire("Error!", "Something went wrong while updating order", "error");
        }
      }
    });
  };

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages.map((page) => (
      <CPaginationItem
        key={page}
        active={page === currentPage}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </CPaginationItem>
    ));
  };

  const fields = [
    { key: "billNumber", label: "Bill No" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "mediumOfPayment", label: "Payment" },
    { key: "netAmount", label: "Net Amount" },
  ];

  return (
    <CCard className="m-4 p-3">
      {/* ✅ Filters */}
      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="Search by Name / ID"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="From"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="To"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </CCol>
        <CCol md={3} className="d-flex align-items-end gap-2">
          <CButton
            color="primary"
            onClick={handleSearch}
            style={{
              background: `linear-gradient(135deg, ${color.primary}, ${color.accent})`,
              color: "white",
            }}
          >
            Search
          </CButton>
          <CButton color="secondary" onClick={handleReset}>
            Reset
          </CButton>
          <Export userdata={userdata} fields={fields} />
        </CCol>
      </CRow>

      {/* ✅ Table */}
      <CTable bordered hover responsive align="middle" className="mb-3">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Bill No</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Phone</CTableHeaderCell>
            <CTableHeaderCell>Product Details</CTableHeaderCell>
            <CTableHeaderCell>Net Amount</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {paginated.length ? (
            paginated.map((order, idx) => (
              <CTableRow key={order.id}>
                <CTableDataCell>
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </CTableDataCell>
                <CTableDataCell>{order.billNumber}</CTableDataCell>
                <CTableDataCell>{order.name}</CTableDataCell>
                <CTableDataCell>{order.phone}</CTableDataCell>

                {/* ✅ Product Details */}
                <CTableDataCell>
                  <div>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ marginBottom: "6px" }}>
                        <strong>{item.title}</strong> ({item.productCode})<br />
                        DP: ₹{item.dp} | Qty: {item.quantity} | Net: ₹{item.netAmount}
                      </div>
                    ))}
                  </div>
                </CTableDataCell>

                <CTableDataCell>₹{order.netAmount}</CTableDataCell>
                <CTableDataCell>{order.status}</CTableDataCell>

                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="info"
                    className="me-2 text-white"
                    onClick={() => {
                      setSelectedOrder(order);
                      setDetailsModal(true);
                    }}
                  >
                    View
                  </CButton>

                  <CButton
                    size="sm"
                    color="success"
                    className="me-1 text-white"
                    onClick={() => handleUpdateStatus(order.id, "approved")}
                    disabled={order.status !== "pending"}
                  >
                    Approve
                  </CButton>

                  <CButton
                    size="sm"
                    color="danger"
                    onClick={() => handleUpdateStatus(order.id, "rejected")}
                    disabled={order.status !== "pending"}
                  >
                    Reject
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center text-muted">
                No pending orders found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      <CPagination align="center">{renderPagination()}</CPagination>

      {/* ✅ Modal for Order Details */}
      <CModal
        visible={detailsModal}
        onClose={() => setDetailsModal(false)}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Order Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedOrder && (
            <>
              <p><strong>Bill No:</strong> {selectedOrder.billNumber}</p>
              <p><strong>Name:</strong> {selectedOrder.name}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
              <p><strong>Payment Mode:</strong> {selectedOrder.mediumOfPayment}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Net Amount:</strong> ₹{selectedOrder.netAmount}</p>

              <h6 className="mt-3 mb-2">🧾 Product Details</h6>
              <CTable bordered responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Product</CTableHeaderCell>
                    <CTableHeaderCell>Code</CTableHeaderCell>
                    <CTableHeaderCell>DP</CTableHeaderCell>
                    <CTableHeaderCell>SP</CTableHeaderCell>
                    <CTableHeaderCell>Qty</CTableHeaderCell>
                    <CTableHeaderCell>Net Amount</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedOrder.items.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.title}</CTableDataCell>
                      <CTableDataCell>{item.productCode}</CTableDataCell>
                      <CTableDataCell>₹{item.dp}</CTableDataCell>
                      <CTableDataCell>₹{item.sp}</CTableDataCell>
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>₹{item.netAmount}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetailsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default PendingOrders;
