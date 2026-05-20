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
    CFormSelect,
} from '@coreui/react';

import toast from 'react-hot-toast';

// import useAxios from '../hooks/useAxios';
// import LoadingSpinner from '../components/common/LoadinSpinner';
import { TbUsersPlus } from 'react-icons/tb';
import useAxios from '../../hooks/useAxios';
import LoadingSpinner from '../common/LoadinSpinner';
import { useNavigate } from 'react-router-dom';

const UsersPlans = () => {
    const { fetchData, loading } = useAxios();

    const [investments, setInvestments] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [filters, setFilters] = useState({
        Amount: '',
        from: '',
        to: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchInvestments = async () => {
        try {
            const res = await fetchData({ url: '/api/v1/admin/auth/get-plan' });
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

    const navigate = useNavigate()

    const handleSearch = () => {
        let filteredList = [...investments];

        // Amount filter (supports partial match too)
        if (filters.Amount) {
            filteredList = filteredList.filter(
                (plan) =>
                    plan.baseAmount.toString().includes(filters.Amount) ||
                    (plan.gst + plan.baseAmount).toString().includes(filters.Amount) ||
                    plan.dailyIncome.toString().includes(filters.Amount) ||
                    plan.monthlyIncome.toString().includes(filters.Amount) ||
                    plan.annualIncome.toString().includes(filters.Amount)
            );
        }

        // From/To filter (range by baseAmount)
        if (filters.from) {
            filteredList = filteredList.filter(
                (plan) => Number(plan.baseAmount) >= Number(filters.from)
            );
        }

        if (filters.to) {
            filteredList = filteredList.filter(
                (plan) => Number(plan.baseAmount) <= Number(filters.to)
            );
        }

        setFiltered(filteredList);
        setCurrentPage(1);
    };


    useEffect(() => {
        handleSearch();
    }, [filters]);

    const handleReset = () => {
        setFilters({ Amount: '', from: '', to: '' });
        setFiltered(investments);
        setCurrentPage(1);
    };

    const deletePlan = async (id) => {
        try {
            const res = await fetchData({
                url: `/api/v1/admin/auth/delete-plan/${id}`,
                method: 'delete',
            });

            if (res.message) {
                toast.success('User updated successfully');
                fetchInvestments();
            } else {
                toast.error(res.message || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error while updating user');
        }
    };

    
    const distribution = async (id) => {
        try {
            const res = await fetchData({
                url: `/api/v1/admin/auth/get-plan-distribution/${id}`,
                method: 'delete',
            });

            if (res.message) {
                toast.success('User updated successfully');
                fetchInvestments();
            } else {
                toast.error(res.message || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error while updating user');
        }
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <>
            {loading && <LoadingSpinner />}

            <CRow className="mb-3 align-items-end">
                {/* Amount Filter */}
                <CCol md={3}>
                    <CFormInput
                        label="Amount"
                        placeholder="Search Amount"
                        value={filters.Amount}
                        onChange={(e) => setFilters({ ...filters, Amount: e.target.value })}
                    />
                </CCol>

                {/* Create Button */}
                <CCol md={3}>
                    <CButton
                        color="primary"
                        className="mt-2 w-100"
                        onClick={() => navigate('/create-plans')}
                    >
                        Create Plan
                    </CButton>
                </CCol>
            </CRow>


            <div className="table-responsive">
                <CTable hover bordered responsive className="text-nowrap">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>S.No</CTableHeaderCell>
                            <CTableHeaderCell>Amount</CTableHeaderCell>
                            <CTableHeaderCell>GST + Net Amount</CTableHeaderCell>
                            <CTableHeaderCell>Daily Income</CTableHeaderCell>
                            <CTableHeaderCell>Monthly Income</CTableHeaderCell>
                            <CTableHeaderCell>Annual Income</CTableHeaderCell>
                            <CTableHeaderCell>Coins List</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Updates</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Info</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Delete</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {currentItems.map((inv, index) => {
                            const date = new Date(inv.purchasedAt);
                            return (
                                <CTableRow key={index}>
                                    <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                                    <CTableDataCell>{inv.baseAmount    || "N/A"}</CTableDataCell>
                                    <CTableDataCell>{inv.gst + '%'} + {inv.baseAmount} = {inv.gst + inv.baseAmount    || "N/A"}</CTableDataCell>
                                    <CTableDataCell>{inv.dailyIncome    || "N/A"}</CTableDataCell>
                                    <CTableDataCell>{inv.monthlyIncome    || "N/A"}</CTableDataCell>
                                    <CTableDataCell>{inv.annualIncome    || "N/A"}</CTableDataCell>
                                    <CTableDataCell>
                                        <CFormSelect>
                                            {Array.isArray(inv.coinsList) && inv.coinsList.length > 0 ? (
                                                inv.coinsList.map((coin, idx) => (
                                                    <option key={idx} value={coin}>
                                                        {coin}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>No Coins</option>
                                            )}
                                        </CFormSelect>
                                    </CTableDataCell>




                                    <CTableDataCell className="text-center d-flex justify-content-center gap-2 flex-wrap">
                                        <CButton
                                            color="info"
                                            size="sm"
                                            title="Edit"
                                            disabled={inv?.role === 'admin'}
                                            onClick={() => navigate(`/user/updateplans/${inv._id}`, { state: { user: inv } })}
                                            style={{ backgroundColor: '#1A73E8', borderColor: '#ffffff', color: '#ffffff' }}
                                        >
                                            ✎
                                        </CButton>

                                    </CTableDataCell>
                                    <CTableDataCell> <CButton
                                        size="sm"
                                        title="Suspend"
                                        // disabled={user?.role === 'admin'}
                                        onClick={() => navigate(`/user/distribution/${inv._id}`, { state: { user: inv } })}
                                        style={{ backgroundColor: '#4535DB', borderColor: '#4535DB', color: '#ffffff' }}

                                    >
                                        Info
                                    </CButton></CTableDataCell>
                                    <CTableDataCell> <CButton
                                        size="sm"
                                        title="Suspend"
                                        // disabled={user?.role === 'admin'}
                                        onClick={() => deletePlan(inv._id)}
                                        style={{ backgroundColor: '#FF0707', borderColor: '#dc3545', color: '#ffffff' }}

                                    >
                                        Delete
                                    </CButton></CTableDataCell>
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

export default UsersPlans;

