import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import "./src/global.css"

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

import { useState } from 'react';
import { FamilyProvider } from './src/data/FamilyContext';
import { GuardianSession } from './src/data/family';
import { HomeScreen } from './src/screens/HomeScreen';
import { InviteScreen } from './src/screens/InviteScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { TooManyAttemptsScreen } from './src/screens/TooManyAttemptsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

type Screen = 'welcome' | 'invite' | 'login' | 'reset' | 'locked' | 'home';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [session, setSession] = useState<GuardianSession | null>(null);

  if (screen === 'invite') {
    return (
      <InviteScreen
        onBack={() => setScreen('welcome')}
        onDone={(next) => {
          setSession(next);
          setScreen('home');
        }}
      />
    );
  }

  if (screen === 'reset') {
    return <ResetPasswordScreen onBack={() => setScreen('login')} />;
  }

  if (screen === 'locked') {
    return (
      <TooManyAttemptsScreen
        unlockAt={new Date(Date.now() + 15 * 60_000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        onReset={() => setScreen('reset')}
        onBack={() => setScreen('welcome')}
      />
    );
  }

  if (screen === 'home') {
    return (
      <FamilyProvider session={session}>
        <HomeScreen />
      </FamilyProvider>
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onBack={() => setScreen('welcome')}
        onForgot={() => setScreen('reset')}
        onLocked={() => setScreen('locked')}
        onSuccess={() => {
          setSession(null);
          setScreen('home');
        }}
      />
    );
  }

  return (
    <WelcomeScreen
      onContinue={() => setScreen('invite')}
      onHasAccount={() => setScreen('login')}
    />
  );
}
