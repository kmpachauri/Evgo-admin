import React, { useEffect, useState } from 'react';
import {
    CRow,
    CCol,
    CFormInput,
    CButton,
    CCard,
    CCardBody,
} from '@coreui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAxios from '../../hooks/useAxios';
import LoadingSpinner from '../common/LoadinSpinner';
import { Create } from 'jodit/esm/modules';

const CreatedsPlans = () => {
    const { userId } = useParams();
    const location = useLocation();
    const user = location.state?.user;
    console.log(user)
    const navigate = useNavigate()

    const { fetchData, loading } = useAxios();

    const [form, setForm] = useState({
        sponsor: '',
        userId: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                _id: user._id || '',
                baseAmount: user.baseAmount || '',
                walletBalance: user.walletBalance || 0,
                fundBalance: user.fundBalance || 0,
                password: '',
                txnpass: ''
            });
        }
    }, [user]);


    const handleChange = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
    };

    const handleSubmit = async () => {
        const payload = {
            baseAmount: Number(form.baseAmount),
            coinsCount: Number(form.coinsCount),
        };

        console.log('Submitting payload:', payload);

        try {
            const res = await fetchData({
                url: `/api/v1/admin/auth/create-plan`,
                method: 'post',
                data: payload, // ✅ send payload
            });

            if (res.success) {
                toast.success('Plan created successfully'); // better message
                navigate(-1);
            } else {
                toast.error(res.message || 'Create failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error while creating plan');
        }
    };



    const handleReset = () => {
        if (user) {
            setForm({
                sponsor: user._id || '',
                userId: user.baseAmount || '',

            });
        }
    };

    return (
        <CCard className="p-3">
            {loading && <LoadingSpinner />}
            <CCardBody>
                <CRow className="mb-3">

                    <CCol md={6}>
                        <CFormInput
                            label="Amount"
                            value={form.baseAmount}
                            onChange={(e) => handleChange('baseAmount', e.target.value)}

                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            label="Coins Count"
                            value={form.coinsCount}
                            onChange={(e) => handleChange('coinsCount', e.target.value)}
                        />

                        {/* Sirf ek red label niche */}
                        <p style={{ color: 'red', marginTop: '5px' }}>Optional</p>
                    </CCol>


                </CRow>

                <CRow className="mt-4">
                    <CCol className="d-flex gap-2">
                        <CButton color="primary" onClick={handleSubmit}>Create</CButton>
                        {/* <CButton color="secondary" onClick={handleReset}>Reset</CButton> */}
                    </CCol>

                </CRow>

            </CCardBody>
        </CCard>
    );
};

export default CreatedsPlans;
