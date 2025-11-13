import { useState } from 'react';
import { register as registerService } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Call AWS Cognito registration
      await registerService({ name, email, password });
      alert('Registration successful! Please check your email for the verification code.');
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer d-flex justify-content-center align-items-center w-100 min-vh-100">
      <form className="form_container w-full max-w-md p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
        <img src="logo-gold.png" style={{ width: '100px' }} alt="Logo" />

        <div className="title_container">
          <p className="title">Create your Account</p>
          <span className="subtitle">Get started with our app, just create an account and enjoy the experience.</span>
        </div>

        {/* Name Field */}
        <div className="input_container">
          <label className="input_label" htmlFor="name_field">Full Name</label>
          <svg className="icon" fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 13c3.866 0 7 3.134 7 7H5c0-3.866 3.134-7 7-7Zm0-1a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
          </svg>
          <input
            placeholder="John Doe"
            type="text"
            id="name_field"
            className="input_field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email Field */}
        <div className="input_container">
          <label className="input_label" htmlFor="email_field">Email</label>
          <svg className="icon" fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5" />
            <path stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round" d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" />
          </svg>
          <input
            placeholder="name@mail.com"
            type="email"
            id="email_field"
            className="input_field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="input_container">
          <label className="input_label" htmlFor="password_field">Password</label>
          <svg className="icon" fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22" />
          </svg>
          <input
            placeholder="Password"
            type="password"
            id="password_field"
            className="input_field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="sign-in_btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="separator">
          <hr className="line" />
          <span>Or</span>
          <hr className="line" />
        </div>

        <button type="button" className="sign-in_ggl">
          Sign Up with Google
        </button>

        <div className="sign-in_footer">
          <p>Already have an account? <a href="/login" className="signup_link">Login</a></p>
        </div>
      </form>
    </div>
  );
}

export default Register;
