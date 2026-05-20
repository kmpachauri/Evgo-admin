import React, { useEffect, useState } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton
} from '@coreui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAxios from '../../hooks/useAxios';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilReload } from '@coreui/icons';

// 🎨 Color palette (auto loop hoga)
const colors = [
  '#E6007A', '#627EEA', '#F3BA2F', '#FF4D00', '#445362',
  '#F7931A', '#00FFA3', '#8247E5', '#00FFDD', '#BFBBBB',
  '#00C8FF', '#1D65D4', '#FF007A', '#FFF200', '#008080',
  
];

// FF0000
const getCoinColor = (index) => colors[index % colors.length];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Circular Progress Component for each coin
const CircularProgress = ({ percentage, color, size = 100 }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress" style={{ width: size, height: size, position: 'relative' }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.8s ease',
          }}
        />
      </svg>
      <div
        className="progress-text"
        style={{
          color,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {percentage}%
      </div>
    </div>
  );
};

// Base Amount Circle with segments
const BaseAmountCircle = ({ baseAmount, distribution, size = 220 }) => {
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2.5;
  const circumference = radius * 2 * Math.PI;

  let cumulativePercent = 0;
  const segments = distribution.map((item, index) => {
    const segment = {
      color: getCoinColor(index),
      percent: item.percent,
      startOffset: cumulativePercent
    };
    cumulativePercent += item.percent;
    return segment;
  });

  return (
    <div className="base-amount-circle" style={{ width: size, height: size, position: 'relative' }}>
      <svg className="base-ring" width={size} height={size}>
        {segments.map((segment, index) => {
          const segmentCircumference = (segment.percent / 100) * circumference;
          return (
            <circle
              key={index}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              strokeDasharray={`${segmentCircumference} ${circumference}`}
              strokeDashoffset={-((segment.startOffset / 100) * circumference)}
              style={{
                transition: 'stroke-dasharray 0.8s ease',
              }}
            />
          );
        })}
      </svg>
      <div
        className="base-amount-text"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.5rem', color: '#321fdb' }}>
          {formatCurrency(baseAmount)}
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#768192', fontWeight: '500' }}>
          Amount
        </p>
      </div>
    </div>
  );
};

const Distribution = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchData, loading } = useAxios();

  const [distributionData, setDistributionData] = useState(null);

  const fetchDistribution = async () => {
    try {
      const res = await fetchData({
        url: `/api/v1/admin/auth/get-plan-distribution/${userId}`,
        method: 'GET'
      });

      if (res.success) {
        setDistributionData(res.data);
        toast.success('Distribution data fetched successfully');
      } else {
        toast.error(res.message || 'Failed to fetch distribution data');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error while fetching distribution data');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDistribution();
    }
  }, [userId]);

  const handleRegenerate = () => {
    fetchDistribution();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="distribution-container">
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <CButton
              color="link"
              onClick={() => navigate(-1)}
              className="me-2 p-0"
            >
              <CIcon icon={cilArrowLeft} size="lg" />
            </CButton>
            <h5 className="mb-0">Coin Allocation</h5>
          </div>
          {/* <CButton color="primary" onClick={handleRegenerate}>
            <CIcon icon={cilReload} className="me-1" />
            Regenerate
          </CButton> */}
        </CCardHeader>
        <CCardBody>
          {distributionData && (
            <div className="allocation-content">
              {/* Base Amount Circle */}
              <div className="text-center mb-4">
                <BaseAmountCircle
                  baseAmount={distributionData.baseAmount}
                  distribution={distributionData.distribution}
                />
              </div>

              {/* Coin Allocations */}
              <div className="coin-allocation-grid">
                {distributionData.distribution.map((item, index) => (
                  <div key={index} className="coin-card">
                    <div className="coin-header">
                      <span className="coin-name" style={{ color: getCoinColor(index) }}>
                        {item.name}
                      </span>
                    </div>
                    <div className="coin-progress">
                      <CircularProgress
                        percentage={item.percent}
                        color={getCoinColor(index)}
                      />
                    </div>
                    <div className="coin-details">
                      <div className="coin-amount">
                        {formatCurrency(item.amount)} USD
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>

      <style jsx>{`
        .coin-allocation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          width: 100%;
          margin-top: 2rem;
        }
        .coin-card {
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s ease;
        }
        .coin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .coin-name {
          font-weight: bold;
          font-size: 1.3rem;
        }
      `}</style>
    </div>
  );
};

export default Distribution;
