import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { login as loginService, verifyOTP as verifyOTPService } from '../../services/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isOtpSent) {
        // Step 1: send email + password to backend
        const res = await loginService({ email, password });
        setIsOtpSent(true);
        alert('OTP has been sent to your email.');
      } else {
        // Step 2: verify OTP
        const res = await verifyOTPService({ email, otp });
        login(res.user);
        localStorage.setItem('token', res.token);
        navigate(res.redirectUrl);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
      setIsOtpSent(false); // reset OTP step if failure
    }
  };

  return (
    <div className="loginContainer d-flex justify-content-center align-items-center w-100 min-vh-100">
      <form
        className="form_container w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <img src="logo-gold.png" style={{ width: '100px' }} alt="Logo" />

        <div className="title_container">
          <p className="title">Login to your Account</p>
          <span className="subtitle">
            Get started with our app, just create an account and enjoy the experience.
          </span>
        </div>

        {/* Email */}
        <div className="input_container">
          <label className="input_label" htmlFor="email_field">Email</label>
          <input
            placeholder="name@mail.com"
            name="email"
            type="email"
            className="input_field"
            id="email_field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password (only if OTP not sent yet) */}
        {!isOtpSent && (
          <div className="input_container">
            <label className="input_label" htmlFor="password_field">Password</label>
            <input
              placeholder="Password"
              name="password"
              type="password"
              className="input_field"
              id="password_field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* OTP input (shown after sending OTP) */}
        {isOtpSent && (
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
        )}

        <button type="submit" className="sign-in_btn">
          {isOtpSent ? 'Verify OTP' : 'Send OTP'}
        </button>

        <div className="separator">
          <hr className="line" />
          <span>Or</span>
          <hr className="line" />
        </div>

        <button type="button" className="sign-in_ggl">
          Sign In with Google
        </button>

        <div className="sign-in_footer">
          <p>
            Don't have an account? <a href="/register" className="signup_link">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
