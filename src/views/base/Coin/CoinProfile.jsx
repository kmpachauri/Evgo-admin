import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import {
    CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CButton, CForm, CSpinner, CContainer
} from '@coreui/react';
import useAxios from '../../../hooks/useAxios';
import { imageFullUrl } from '../../helper';
import LoadingSpinner from '../../../components/common/LoadinSpinner';

const CoinProfile = () => {
    const { fetchData } = useAxios();
    const [data, setData] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const getCoin = async () => {
        try {
            const res = await fetchData({ url: '/admin/coin' });
            if (res.success) {
                setData(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCoin();
    }, []);

    const handleUpdatePrice = async () => {
        if (!newPrice) return;

        setLoading(true);
        try {
            const res = await fetchData({
                url: `/admin/coin/${data._id}`,
                method: 'PUT',
                data: { price: newPrice },
            });

            if (res.success) {
                setNewPrice('');
                getCoin();
            }
        } catch (error) {
            console.error('Error updating price:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!data) {
        return <p className="text-center mt-4">Loading...</p>;
    }

    // Format price history for the chart
    const chartData = data.priceHistory.map(entry => ({
        price: entry.price,
        dateTime: new Date(entry.updatedAt).toLocaleString(), // Includes both Date & Time
    }));

    return (
        <CContainer fluid className="mt-4">
        {loading && <LoadingSpinner />}
            <CCard className="shadow-sm">
                <CCardHeader className="bg-dark text-white text-center">
                    <h2 className="mb-0">Coin Profile</h2>
                </CCardHeader>
                <CCardBody>
                    <CRow className="align-items-center text-center text-md-start">
                        <CCol xs={12} md={3} className="d-flex justify-content-center">
                            <img
                                src={imageFullUrl(data.coinImage)}
                                alt={data.fullName}
                                className="rounded-circle shadow"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                        </CCol>
                        <CCol xs={12} md={6}>
                            <h4 className="fw-bold">{data.fullName} ({data.shortName})</h4>
                            <p className="fs-5 text-success fw-semibold">
                                Current Price: <span className='text-auto'>{data.price}</span>
                            </p>
                        </CCol>
                        <CCol xs={12} md={3}>
                            <CForm onSubmit={(e) => { e.preventDefault(); handleUpdatePrice(); }}>
                                <div className="d-flex gap-2">
                                    <CFormInput
                                        type="number"
                                        placeholder="Enter new price"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        required
                                        className="text-center"
                                    />
                                    <CButton type="submit" color="primary" disabled={loading}>
                                        {loading ? <CSpinner size="sm" /> : 'Update'}
                                    </CButton>
                                </div>
                            </CForm>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <CCard className="shadow-sm mt-4">
                <CCardHeader className="bg-primary text-white">
                    <h3 className="mb-0">Price History</h3>
                </CCardHeader>
                <CCardBody>
                    <div style={{ width: '100%', height: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                                <XAxis dataKey="dateTime" stroke="#555" />
                                <YAxis stroke="#555" />
                                <Tooltip />
                                <Line type="monotone" dataKey="price" stroke="#007bff" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CCardBody>
            </CCard>
        </CContainer>
    );
};

export default CoinProfile;
