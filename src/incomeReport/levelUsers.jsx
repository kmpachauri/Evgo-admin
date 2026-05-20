import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const levelUsers = () => {
  const { level } = useParams();
  const { state } = useLocation();
  const users = state?.users || [];
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Users at Level {level}</h5>
        <CButton color="secondary" onClick={() => navigate(-1)}>Back</CButton>
      </div>

      <div className="table-responsive">
        <CTable hover bordered align="middle" className="text-center text-nowrap">
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Username</CTableHeaderCell>
              <CTableHeaderCell>Income ($)</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={4}>No users found</CTableDataCell>
              </CTableRow>
            ) : (
              users.map((user, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{user.userId}</CTableDataCell>
                  <CTableDataCell>{user.username || '-'}</CTableDataCell>
                  <CTableDataCell>{Number(user.income).toFixed(2)}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    </>
  );
};

export default levelUsers;
