import { useState } from 'react';
import { LoginScreen } from './src/screens/LoginScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'reset'>('login');

  if (screen === 'reset') {
    return <ResetPasswordScreen onBack={() => setScreen('login')} />;
  }

  return <LoginScreen onForgot={() => setScreen('reset')} />;
}
