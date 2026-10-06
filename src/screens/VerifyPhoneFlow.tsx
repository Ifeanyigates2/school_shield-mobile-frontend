import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';
import { PrimaryButton } from '../components';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { useAndroidBack } from '../useAndroidBack';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
  onVerified: (phone: string) => void;
}

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

function digitsOf(value: string) {
  return value.replace(/\D/g, '');
}

/** "+234 806 112 3321" → "+234 806 *** 3321" */
function maskPhone(phone: string) {
  const d = digitsOf(phone);
  if (d.length < 10) return phone;
  return `+${d.slice(0, 3)} ${d.slice(3, 6)} *** ${d.slice(-4)}`;
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        backgroundColor: colors.bannerBlueBg,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <Feather name="info" size={15} color={colors.bannerBlueText} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

// ─── Step 1: new number ───────────────────────────────────────────────────────

function NumberStep({ onBack, onNext }: { onBack: () => void; onNext: (phone: string) => void }) {
  const [phone, setPhone] = useState('');
  const valid = digitsOf(phone).length >= 10;

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Verify your new number" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <InfoCard>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.bannerBlueText, marginBottom: 4 }}>
            Codes for your handlers aren't affected
          </Text>
          <Text style={{ fontSize: 12, color: colors.bannerBlueText, lineHeight: 18 }}>
            This only changes where your own sign-in codes and alerts go.
          </Text>
        </InfoCard>

        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink, marginTop: 24, marginBottom: 8 }}>
          New phone number
        </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder="+234 806 112 3321"
          placeholderTextColor="#98A2B3"
          style={{
            height: 50,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.soft,
            paddingHorizontal: 14,
            fontSize: 15,
            color: colors.ink,
          }}
        />

        <PrimaryButton
          label="Verify"
          enabled={valid}
          onPress={() => onNext(phone.trim())}
          style={{ marginTop: 32 }}
        />
      </ScrollView>
    </View>
  );
}

// ─── Step 2: 4-digit code ─────────────────────────────────────────────────────

function CodeStep({
  phone,
  onBack,
  onDone,
}: {
  phone: string;
  onBack: () => void;
  onDone: () => void;
}) {
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const onChangeCode = (text: string) => {
    const next = digitsOf(text).slice(0, CODE_LENGTH);
    setCode(next);
    if (next.length === CODE_LENGTH) onDone();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SubscreenHeader title="Verify your new number" onBack={onBack} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 14, color: colors.mute, lineHeight: 20, marginBottom: 20 }}>
          We sent a 4-digit code to {maskPhone(phone)}.
        </Text>

        {/* Boxes — one hidden input drives all four so SMS paste fills them */}
        <Pressable onPress={() => inputRef.current?.focus()}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => {
              const active = i === code.length;
              return (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 56,
                    borderRadius: 12,
                    borderWidth: active ? 1.5 : 1,
                    borderColor: active ? colors.navy : colors.line,
                    backgroundColor: colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {code[i] ? (
                    <Text style={{ fontSize: 22, fontWeight: '700', color: colors.ink }}>{code[i]}</Text>
                  ) : active ? (
                    <View style={{ width: 1.5, height: 24, backgroundColor: colors.ink }} />
                  ) : null}
                </View>
              );
            })}
          </View>
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={onChangeCode}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            maxLength={CODE_LENGTH}
            autoFocus
            caretHidden
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
          />
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          {seconds > 0 ? (
            <Text style={{ fontSize: 13, color: colors.mute }}>
              Resend available in 0:{String(seconds).padStart(2, '0')}
            </Text>
          ) : (
            <Pressable onPress={() => setSeconds(RESEND_SECONDS)} hitSlop={8}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.navy }}>Resend code</Text>
            </Pressable>
          )}
          <Pressable onPress={() => setCode('')} hitSlop={8}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink }}>Clear</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 32 }}>
          <InfoCard>
            <Text style={{ fontSize: 13, color: colors.ink, lineHeight: 19 }}>
              The phone's numeric keyboard opens automatically. Pasting the code from your SMS fills
              all four boxes.
            </Text>
          </InfoCard>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Flow ─────────────────────────────────────────────────────────────────────

export function VerifyPhoneFlow({ onBack, onVerified }: Props) {
  const [phone, setPhone] = useState<string | null>(null);
  const back = () => (phone ? setPhone(null) : onBack());
  useAndroidBack(back);

  if (phone) {
    return <CodeStep phone={phone} onBack={back} onDone={() => onVerified(phone)} />;
  }
  return <NumberStep onBack={back} onNext={setPhone} />;
}
