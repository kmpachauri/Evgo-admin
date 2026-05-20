import React from 'react'
import { CCard, CCardBody, CCardText, CRow, CCol, CFormInput, CButton, CCardTitle } from '@coreui/react'
import { cilLink } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ReferralSection = ({referralCode,referralCount}) => {
    console.log(referralCode,referralCount)
    const referralLink = `https://admin.mysmgservice.com/user/auth?InviteCode=${referralCode}`
    const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    alert('Link copied!')
  }

  return (
    <CCard className="p-4 mb-4">
      <CCardBody>
        <CRow>
          {/* Left Side: Invite Link */}
          <CCol md={8}>
            <CCardTitle className="h5 mb-2">Refer Us & Earn</CCardTitle>
            <CCardText className="text-medium-emphasis mb-3">
              Use the below link to invite your friends.
            </CCardText>
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center w-100 border rounded p-2 ">
                <CIcon icon={cilLink} className="me-2 text-primary" />
                <CFormInput
                  type="text"
                  value={referralLink}
                  readOnly
                  className="border-0  p-0"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
              <CButton  color="light w-25" onClick={handleCopy}>
                copy link
              </CButton>
            </div>
          </CCol>

          {/* Right Side: Stats */}
          <CCol md={4} className="text-end">
            <div className="fw-semibold text-primary mb-1">My Referral</div>
            <div className="d-flex justify-content-end align-items-center gap-4">
              <div>
                <div className="h5 mb-0">{referralCount}</div>
                <small className="text-medium-emphasis">Total Joined</small>
              </div>
              <div>
                <div className="h5 mb-0 text-success">₹30.17</div>
                <small className="text-medium-emphasis">Referral Earn</small>
              </div>
            </div>

            {/* Fake bar chart (placeholder style) */}
            <div className="d-flex justify-content-end gap-1 mt-3">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: `${10 + (i % 5) * 5}px`,
                    backgroundColor: 'rgba(90, 105, 255, 0.3)',
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default ReferralSection
