import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(true);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const guestAccess = () => {
    onLogin(false);
  };

  return (
    <div className="login">
      <h1>Provision Store Prices</h1>
      
      <button onClick={guestAccess} className="guest-btn">
        View Prices (Staff)
      </button>

      <div className="divider">OR</div>

      <form onSubmit={handleLogin}>
        <h3>Admin Login</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}

export default Login;