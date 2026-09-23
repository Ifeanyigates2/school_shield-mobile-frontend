import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/** Consumes the Android hardware back button so it does not exit the app. */
export function useAndroidBack(onBack: () => void) {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);
}
