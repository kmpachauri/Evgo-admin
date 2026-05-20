import React, { useState } from 'react'
import { CAlert, CButton } from '@coreui/react'
import useAuth from '../../hooks/useAuth'

export const AlertBar = () => {
    const [visible, setVisible] = useState(true)
    const { logout , user} = useAuth()
    const _logout =()=>{
        logout()
        setVisible(false)
    }
    return (
        <>
            {visible && (
                <CAlert visible={visible}
                    color="warning"
                    //   variant=''
                    className="py-0 mb-0 d-flex justify-content-between align-items-center "
                    style={{
                        // position: "fixed",
                        // top: 0,
                        // right: '50%',
                        zIndex: 10,
                        // width: "40%"
                    }}
                >
                    <span>You  are managing  {'  '} <strong>{user?.email}</strong>  account!</span>
                    <CButton

                        onClick={() => _logout()}
                        style={{ marginLeft: '1rem',fontWeight:'bold' }}
                    >
                        Exit
                    </CButton>
                </CAlert>
            )}
        </>
    )
}
