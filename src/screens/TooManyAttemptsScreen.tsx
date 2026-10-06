import { Linking, ScrollView, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { PrimaryButton } from '../components';
import { SUBSCREEN_TOP_INSET } from '../components/SubscreenHeader';
import { useAndroidBack } from '../useAndroidBack';

interface Props {
  /** When sign-in unlocks, e.g. "11:57 PM" */
  unlockAt: string;
  onReset: () => void;
  onBack: () => void;
}

export function TooManyAttemptsScreen({ unlockAt, onReset, onBack }: Props) {
  useAndroidBack(onBack);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ExpoStatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: SUBSCREEN_TOP_INSET + 20,
          paddingHorizontal: 16,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: colors.ink,
            letterSpacing: -0.4,
            marginBottom: 10,
          }}
        >
          Too many attempts
        </Text>
        <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 20 }}>
          Sign-in is locked for 15 minutes to protect your children's records.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            backgroundColor: '#FEF3F2',
            borderRadius: 14,
            padding: 16,
            marginBottom: 28,
          }}
        >
          <Feather name="lock" size={16} color="#D92D20" style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#D92D20', marginBottom: 4 }}>
              Try again at {unlockAt}
            </Text>
            <Text style={{ fontSize: 12, color: '#D92D20', lineHeight: 18 }}>
              Or reset your password now with a 4-digit code sent to +234 803 ••• 7890.
            </Text>
          </View>
        </View>

        <PrimaryButton label="Reset password" onPress={onReset} />
        <PrimaryButton
          outline
          label="Call the school office"
          onPress={() => Linking.openURL('tel:+2348001234567')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </View>
  );
}
