import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOTPService } from '../../services/auth';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

function OtpVerification({ email }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is missing.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await verifyOTPService({ email, otp });
      login(res.user);
      localStorage.setItem('token', res.token);
      navigate(res.redirectUrl);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer d-flex justify-content-center align-items-center w-100 min-vh-100">
      <form
        className="form_container w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        onSubmit={handleVerify}
      >
        <img src="logo-gold.png" style={{ width: '100px' }} alt="Logo" />

        <div className="title_container">
          <p className="title">OTP Verification</p>
          <span className="subtitle">
            Enter the OTP sent to <strong>{email}</strong>
          </span>
        </div>

        <div className="input_container">
          <label className="input_label" htmlFor="otp_field">OTP</label>
          <input
            placeholder="Enter OTP"
            name="otp"
            type="text"
            className="input_field"
            id="otp_field"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="sign-in_btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {error && <p className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div className="sign-in_footer" style={{ marginTop: '20px' }}>
          <p>
            Didn't receive OTP? <a href="/resend-otp" className="signup_link">Resend OTP</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default OtpVerification;
