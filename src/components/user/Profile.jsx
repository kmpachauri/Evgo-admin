import React, { useEffect, useState } from 'react';
import { 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CCol, 
  CRow, 
  CSpinner, 
  CListGroup, 
  CListGroupItem,
  CBadge,
  CAvatar,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeOpen, cilPhone, cilShieldAlt, cilCalendar, cilStar } from '@coreui/icons';
import useAxios from '../../hooks/useAxios';

const Profile = () => {
  const { fetchData } = useAxios();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const res = await fetchData({
        url: "/api/v1/user/profile"
      });
      
      if (res.success) {
        setProfile(res.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <p>Failed to load profile data</p>
      </div>
    );
  }

  return (
    <CRow>
      <CCol md={8} className="mb-4">
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5>Profile Information</h5>
            <CBadge color="primary" shape="rounded-pill">
              Level {profile.level}
            </CBadge>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <CCol md={3} className="d-flex flex-column align-items-center">
                <CAvatar
                  color="primary"
                  textColor="white"
                  size="xl"
                  style={{ fontSize: '2rem', marginBottom: '1rem' }}
                >
                  {profile.name?.charAt(0) || 'U'}
                </CAvatar>
                <h5>{profile.name || 'User'}</h5>
              </CCol>
              <CCol md={9}>
                <CListGroup>
                  <CListGroupItem className="d-flex align-items-center">
                    <CIcon icon={cilEnvelopeOpen} className="me-3 text-primary" />
                    <div>
                      <small className="text-muted">Email</small>
                      <div>{profile.email}</div>
                      <CBadge color={profile.isEmailVerified ? "success" : "warning"} className="mt-1">
                        {profile.isEmailVerified ? "Verified" : "Not Verified"}
                      </CBadge>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center">
                    <CIcon icon={cilPhone} className="me-3 text-primary" />
                    <div>
                      <small className="text-muted">Phone</small>
                      <div>{profile.phone || 'Not provided'}</div>
                      <CBadge color={profile.isPhoneVerified ? "success" : "warning"} className="mt-1">
                        {profile.isPhoneVerified ? "Verified" : "Not Verified"}
                      </CBadge>
                    </div>
                  </CListGroupItem>
                  <CListGroupItem className="d-flex align-items-center">
                    <CIcon icon={cilShieldAlt} className="me-3 text-primary" />
                    <div>
                      <small className="text-muted">Referral Code</small>
                      <div className="d-flex align-items-center">
                        <code className="me-2">{profile.referralCode}</code>
                        <CButton size="sm" color="light" variant="outline">
                          Copy
                        </CButton>
                      </div>
                    </div>
                  </CListGroupItem>
                </CListGroup>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol md={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Account Details</h5>
          </CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <span>
                  <CIcon icon={cilUser} className="me-2 text-primary" />
                  Role
                </span>
                <CBadge color="info" shape="rounded-pill">
                  {profile.role}
                </CBadge>
              </CListGroupItem>
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <span>
                  <CIcon icon={cilCalendar} className="me-2 text-primary" />
                  Member Since
                </span>
                <span>
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </CListGroupItem>
              <CListGroupItem className="d-flex justify-content-between align-items-center">
                <span>
                  <CIcon icon={cilStar} className="me-2 text-primary" />
                  Status
                </span>
                <CBadge color="success" shape="rounded-pill">
                  Active
                </CBadge>
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>

        {/* <CCard>
          <CCardHeader>
            <h5>Quick Actions</h5>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CButton color="primary" variant="outline" className="w-100">
                  Edit Profile
                </CButton>
              </CCol>
              <CCol xs={6} className="mb-3">
                <CButton color="warning" variant="outline" className="w-100">
                  Change Password
                </CButton>
              </CCol>
              {!profile.isEmailVerified && (
                <CCol xs={12} className="mb-3">
                  <CButton color="success" className="w-100">
                    Verify Email
                  </CButton>
                </CCol>
              )}
              {!profile.isPhoneVerified && profile.phone && (
                <CCol xs={12}>
                  <CButton color="success" className="w-100">
                    Verify Phone
                  </CButton>
                </CCol>
              )}
            </CRow>
          </CCardBody>
        </CCard> */}
      </CCol>
    </CRow>
  );
};

export default Profile;