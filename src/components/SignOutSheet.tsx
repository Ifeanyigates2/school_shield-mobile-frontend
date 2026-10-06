import { Modal, Pressable, Text, View } from 'react-native';
import { colors } from '../theme';
import { PrimaryButton } from '../components';

interface Props {
  visible: boolean;
  onSignOut: () => void;
  onCancel: () => void;
}

export function SignOutSheet({ visible, onSignOut, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(16,24,40,0.45)', justifyContent: 'flex-end' }}
        onPress={onCancel}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 36,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.line,
              marginBottom: 24,
            }}
          />
          <Text
            style={{ fontSize: 20, fontWeight: '700', color: colors.ink, letterSpacing: -0.3, marginBottom: 8 }}
          >
            Sign out of SchoolShield?
          </Text>
          <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 21, marginBottom: 20 }}>
            Live codes stay live, everything works within its set window. You'll need your password
            and a 4-digit code to sign back in.
          </Text>

          <PrimaryButton danger label="Sign out" onPress={onSignOut} />
          <PrimaryButton outline label="Stay signed in" onPress={onCancel} style={{ marginTop: 10 }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
