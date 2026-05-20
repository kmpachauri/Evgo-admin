import React, { useEffect, useState } from 'react';
import {
  CForm,
  CFormLabel,
  CFormTextarea,
  CFormSwitch,
  CButton,
  CSpinner,
} from '@coreui/react';
import useAxios from '../hooks/useAxios';

const UserAlertMessage = () => {
  const { fetchData } = useAxios();
  const [banner, setBanner] = useState({ message: '', isActive: false });


  const [loading, setLoading] = useState(false);

  // Fetch current banner

  const fetchBanner = async () => {
    try {
      const res = await fetchData({
        url: '/api/v1/admin/user/get-banner',
        method: 'GET',
      });
      console.log(res)
      if (res) {
        setBanner({
          message: res.message || '',
          isActive: res.show || false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch banner:', err);
    }
  };
  useEffect(() => {
    fetchBanner();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchData({
        url: '/api/v1/admin/user/update-banner',
        method: 'POST',
        data: banner,
      });
      fetchBanner()
    } catch (err) {
      console.error('Failed to update banner:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CForm onSubmit={handleSubmit} className="p-3 border rounded" style={{ maxWidth: '500px' }}>
      <CFormLabel>Banner Message</CFormLabel>
      <CFormTextarea
        rows={3}
        value={banner.message}
        onChange={(e) => setBanner({ ...banner, message: e.target.value })}
        required
      />

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <CFormLabel className="mb-0">Show Banner</CFormLabel>
        <CFormSwitch
          checked={banner.isActive}
          onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
        />
      </div>

      <CButton color="primary" className="mt-4" type="submit" disabled={loading} style={{
        background: "linear-gradient(to right, #6366F1, #4338CA)",
        color: "white",
      }}>
        {loading ? <CSpinner size="sm" /> : 'Save'}
      </CButton>
    </CForm>
  );
};

export default UserAlertMessage;
