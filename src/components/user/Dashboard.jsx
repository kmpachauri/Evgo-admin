import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilCheck,
  cilBolt,
  cilMoney,
  cilWallet,
  cilBank,
} from "@coreui/icons";
import { CCol, CRow, CWidgetStatsC } from '@coreui/react'
import useAxios from '../../hooks/useAxios';
import ReferralSection from '../common/ReferUS';


const Dashboard = () => {
const { fetchData, loading } = useAxios()
const [referralCode, setReferralCode] = useState('')
const [referralCount, setReferralCount] = useState(0)
const [stats,setStats] = useState([])
    const showDashboardData = async () => {
   
    try {
      const data = await fetchData({
        url: '/api/v1/user/profile/stats',
        method: 'GET',
       
      });
      console.log(data?.data);
      const responsData =data?.data
      setReferralCount(responsData?.referralCount)
  //     const result = Object.entries(responsData)?.reduce((acc, [key, value]) => {
  //   if (key === 'referralCode') {
  //     setReferralCode(value)
  //     return acc // skip adding to result
  //   }
  //   if (key === 'referralCount') {
  //     setReferralCount(value)
  //   }

  //   acc.push({
  //     label: key,
  //     value: value,
  //     icon: cilUser,
  //   })
  //   return acc
  // }, [])
setStats(responsData)
console.log(responsData)

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    showDashboardData()
  },[])
  const statusCards = [
  { label: "Members", value: 138, icon: cilUser },
  { label: "Active", value: 138, icon: cilCheck },
  { label: "InActive", value: 0, icon: cilBolt },
  { label: "ToDay Joining", value: 0, icon: cilUser },
  { label: "ToDay Activation", value: 0, icon: cilUser },
  { label: "AddressUpdate Request", value: 0, icon: cilCheck },
  { label: "Withdraw Balance", value: "78.12", icon: cilMoney },
  { label: "Total Investment", value: "3450.00", icon: cilBank },
  { label: "Daily Investment", value: "0.00", icon: cilMoney },
  { label: "Total Withdraw", value: "0.00", icon: cilMoney },
  { label: "Today Withdraw", value: "0.00", icon: cilMoney },
  { label: "Pending Withdraw", value: "0.00", icon: cilMoney },
  { label: "Estimated Withdraw", value: "0.00", icon: cilMoney },
  { label: "API Balance", value: 0, icon: cilMoney },
];
  return (
     <CRow>
      
      <ReferralSection referralCode={stats?.user?.referralCode} referralCount={referralCount}/>
     
      <CCol xs={3}  className="mb-4">
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilUser} height={36} />}
          color="dark"
          inverse
          // progress={{ value: (card?.value / 18) * 100 }}
          title='Level'
          value={stats?.user?.level || 0}
        />
      </CCol>
      <CCol xs={3}  className="mb-4">
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilMoney} height={36} />}
          color="dark"
          inverse
          // progress={{ value: (card?.value / 18) * 100 }}
          title='wallet Balance'
          value={`₹ ${stats?.user?.walletBalance || 0}`}
        />
      </CCol>
      <CCol xs={3}  className="mb-4">
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilMoney} height={36} />}
          color="dark"
          inverse
          // progress={{ value: (card?.value / 18) * 100 }}
          title='Total Earnings'
          value={`₹ ${stats?.user?.totalEarnings || 0}`}
        />
      </CCol>
      <CCol xs={3}  className="mb-4">
        <CWidgetStatsC
          className="mb-3"
          icon={<CIcon icon={cilMoney} height={36} />}
          color="dark"
          inverse
          // progress={{ value: (card?.value / 18) * 100 }}
          title='Total Withdrawn '
          value={`₹ ${stats?.user?.totalWithdrawn || 0}`}
        />
      </CCol>
  
    </CRow>
    
  );
};

export default Dashboard;