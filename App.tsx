import "./src/global.css"

import { useState } from 'react';
import { HomeScreen } from './src/screens/HomeScreen';
import { InviteScreen } from './src/screens/InviteScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

type Screen = 'welcome' | 'invite' | 'login' | 'reset' | 'home';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  if (screen === 'invite') {
    return (
      <InviteScreen
        onBack={() => setScreen('welcome')}
        onDone={() => setScreen('home')}
      />
    );
  }

  if (screen === 'reset') {
    return <ResetPasswordScreen onBack={() => setScreen('login')} />;
  }

  if (screen === 'home') {
    return <HomeScreen />;
  }

  if (screen === 'login') {
    return <LoginScreen onForgot={() => setScreen('reset')} />;
  }

  return (
    <WelcomeScreen
      onContinue={() => setScreen('invite')}
      onHasAccount={() => setScreen('login')}
    />
  );
}
