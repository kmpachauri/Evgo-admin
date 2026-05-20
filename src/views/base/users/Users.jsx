import React, { useEffect, useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CSpinner, CImage, CButton } from '@coreui/react';
import useAxios from '../../../hooks/useAxios';
import { imageFullUrl } from '../../helper';
import LoadingSpinner from '../../../components/common/LoadinSpinner';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const { fetchData, loading } = useAxios();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const getUsers = async () => {
        try {
            const data = await fetchData({
                url: '/admin/user',
                method: 'GET'
            });
            console.log(data)
            setUsers(data.data); // Assuming data is an array
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            <h3 className="mb-3">Users List</h3>
            {loading && <LoadingSpinner />}

            <CTable striped hover responsive>
                <CTableHead color="dark">
                    <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Profile</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Verified</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col">Info</CTableHeaderCell> */}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <CTableRow key={user.id}>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell>
                                    <img
                                        rounded
                                        thumbnail
                                        height={60}
                                        width={60}
                                        alt="user"
                                        style={{
                                            objectFit: 'cover',
                                            // borderRadius:"50%"
                                        }}
                                        src={user.profileImageURL ? imageFullUrl(user?.profileImageURL) : '/default-avatar.png'}

                                    />
                                </CTableDataCell>
                                <CTableDataCell>{user.name}</CTableDataCell>
                                <CTableDataCell>{user.email}</CTableDataCell>
                                <CTableDataCell>{user.wallet.balance}</CTableDataCell>
                                <CTableDataCell>{user.role}</CTableDataCell>
                                <CTableDataCell>
                                    {user.isVerified ? "✅ Verified" : "❌ Not Verified"}
                                </CTableDataCell>
                                <CTableDataCell>{new Date(user.createdAt).toLocaleDateString()}</CTableDataCell>
                                {/* <CButton color="primary" onClick={() => navigate(`/user/${user._id}`)}>Info</CButton> */}
                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="7" className="text-center">
                                No users found.
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>
            </CTable>

        </div>
    );
};

export default Users;
