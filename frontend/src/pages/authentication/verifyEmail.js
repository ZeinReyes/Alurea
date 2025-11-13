import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmailCognito } from '../../services/auth';

function VerifyCognitoEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from query parameter
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      setError('No email provided. Please go back and register first.');
    }
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError('');
      await verifyEmailCognito({ email, code });
      alert('Email verified! You can now log in.');
      navigate('/login'); // redirect after successful verification
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Verification failed.');
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
          <p className="title">Verify Your Email</p>
          <span className="subtitle">
            Enter the verification code sent to <strong>{email}</strong>
          </span>
        </div>

        <div className="input_container">
          <label className="input_label" htmlFor="code_field">Verification Code</label>
          <input
            placeholder="Enter code"
            name="code"
            type="text"
            className="input_field"
            id="code_field"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="sign-in_btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        {error && <p className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div className="sign-in_footer" style={{ marginTop: '20px' }}>
          <p>
            Already verified? <a href="/login" className="signup_link">Go to Login</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default VerifyCognitoEmail;
