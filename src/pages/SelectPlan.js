import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './SelectPlan.css';

const plans = [
  '3numbers+bonus(Lunch only)-R700',
  '3numbers+bonus(Teatime only)-R700',
  '3numbers+bonus(Lunch only)-R2000',
  '3numbers+bonus(Teatime only)-R2000',
  '3numbers+bonus(Lunch only)-R4500',
  '3numbers+bonus(Teatime only)-R4500',
  'VIP-LUNCH&TEATIME MONTHLY-R24000',
  'Four numbers(Russian Goslotto)-R700',
  'Four numbers+bonus(Powerball)-R1000'
];

export default function SelectPlan() {
  const [plan, setPlan] = useState(plans[0]);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const { data } = await API.get('/users/profile');
      const status = data.user.status;

      if (status === 'step3') {
        navigate('/complete-idcard');
      } else if (status === 'step2') {
        await API.post('/users/select-plan', { plan });
        alert('Payment receipt sent to admin. Await approval before proceeding.');
      } else {
        alert('Please verify your 5-digit PIN first, or await admin approval.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching status. Try again.');
    }
  };

  return (
    <div className="selectplan-page">
      <h2>Select Registration Plan</h2>
      <select value={plan} onChange={e=>setPlan(e.target.value)}>
        {plans.map(p=> <option key={p} value={p}>{p}</option>)}
      </select>
      <section>
        <h4>OLYMPIC PLATFORM BANKING DETAILS:</h4>
        <p>
          Beneficiary: MAMA PTY<br/>
          Account: 62509963139<br/>
          Reference: 0651623286<br/>
          FNB (250655)<br/>
          Note: Always include "0631093130" as the reference number when making payment,
          your payment won't be processed, if you fail to add the reference number.<br/>
            Send receipt via WhatsApp to +1 405 926 0437 or +44 739 887 1333.<br/>
          Immediate Payment.
        </p>
      </section>
      <button onClick={handleClick}>Proceed</button>
    </div>
  );
}
