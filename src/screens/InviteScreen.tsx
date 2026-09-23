import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Field, InitialsAvatar, PrimaryButton } from '../components';
import { GuardianSession, Handler } from '../data/family';
import { colors } from '../theme';
import { useAndroidBack } from '../useAndroidBack';

const CHILDREN = [
  { id: 'amara', name: 'Amara Okafor', meta: 'Primary 4A · Greenfield Academy', color: '#1C1917' },
  { id: 'david', name: 'David Okafor', meta: 'Primary 1B · Greenfield Academy', color: '#BE185D' },
];

// TODO(ship): replace demo codes 1111 / 0000 with the SMS verification API.
const OTP_OK = (code: string) => code === '1111' || code === '0000';

type Step = 1 | 2 | 3 | 'photo' | 'preview' | 4 | 5 | 6 | 'handler1' | 'handler2' | 'notify' | 'done';

const meetsPassword = (password: string) =>
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);

export function InviteScreen({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: (session: GuardianSession) => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<string[]>(CHILDREN.map((c) => c.id));
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<'Parent' | 'Guardian'>('Parent');
  const [phone, setPhone] = useState('803 456 7890');
  const [email, setEmail] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [code, setCode] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [seconds, setSeconds] = useState(24);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpOk, setOtpOk] = useState(false);
  const [handlerName, setHandlerName] = useState('');
  const [handlerPhone, setHandlerPhone] = useState('');
  const [handlerRel, setHandlerRel] = useState('Nanny');
  const [handlerPhoto, setHandlerPhoto] = useState(false);
  const [pickupOn, setPickupOn] = useState(true);
  const [dropoffOn, setDropoffOn] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [handlerKids, setHandlerKids] = useState<string[]>(CHILDREN.map((c) => c.id));
  const [savedHandler, setSavedHandler] = useState<string | null>(null);
  const [pushOn, setPushOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [waOn, setWaOn] = useState(false);
  const [checkinOn, setCheckinOn] = useState(true);
  const [reminderOn, setReminderOn] = useState(true);
  const [pickedOn, setPickedOn] = useState(true);
  const [authOn, setAuthOn] = useState(false);

  useEffect(() => {
    if (step !== 4 || seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, seconds]);

  const displayName = name.trim() || 'Zara Okafor';
  const maskedPhone = `+234 ${phone.trim().slice(0, 3)} ** ${phone.trim().slice(-4)}`;

  useEffect(() => {
    if (step !== 4 || code.length !== 4 || otpOk) return;
    if (OTP_OK(code)) {
      setOtpError(false);
      setOtpOk(true);
      const t = setTimeout(() => setStep(5), 700);
      return () => clearTimeout(t);
    }
    setOtpError(true);
  }, [code, step, otpOk]);

  const goBack = () => {
    if (step === 'done') setStep('notify');
    else if (step === 'notify') setStep(6);
    else if (step === 'handler2') setStep('handler1');
    else if (step === 'handler1') setStep(6);
    else if (step === 6) setStep(5);
    else if (step === 5) setStep(4);
    else if (step === 4) setStep('preview');
    else if (step === 'preview') setStep('photo');
    else if (step === 'photo') setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    else onBack();
  };

  useAndroidBack(goBack);

  const session = (): GuardianSession => {
    const saved: Handler | null = savedHandler
      ? {
          id: 'onboarded',
          name: handlerName.trim() || savedHandler,
          relationship: handlerRel,
          phone: handlerPhone,
          status: 'ACTIVE',
          pickup: pickupOn,
          dropoff: dropoffOn,
          childIds: handlerKids.filter((id) => selected.includes(id)),
          days: recurring ? 'Any school day' : 'Today only',
          color: '#C45C6A',
        }
      : null;
    return {
      name: name.trim() || 'Zara Okafor',
      phone,
      email,
      relationship,
      hasPhoto,
      childIds: selected,
      handler: saved,
      notifications: {
        push: pushOn,
        sms: smsOn,
        whatsapp: waOn,
        checkin: checkinOn,
        reminder: reminderOn,
        picked: pickedOn,
        auth: authOn,
      },
    };
  };

  const stepNumber =
    step === 'photo' || step === 'preview' ? 3 : typeof step === 'number' ? step : 6;
  const photoNav = step === 'photo' || step === 'preview';
  const handlerNav = step === 'handler1' || step === 'handler2';
  const notifyNav = step === 'notify';
  const mismatch = confirm.length > 0 && confirm !== password;
  const firstHandler = handlerName.trim().split(' ')[0] || 'them';
  const alertsLabel = [pushOn && 'Push', smsOn && 'SMS', waOn && 'WhatsApp'].filter(Boolean).join(' and ');

  return (
    <View style={[styles.root, step === 'done' && { backgroundColor: colors.navyDeep }]}>
      <ExpoStatusBar style={step === 'done' ? 'light' : 'dark'} />
      {step === 'done' ? (
        <AllSet
          childrenNames={CHILDREN.filter((c) => selected.includes(c.id)).map((c) => c.name.split(' ')[0]).join(', ')}
          handler={savedHandler}
          alerts={alertsLabel || 'Off'}
          onHome={() => onDone(session())}
        />
      ) : (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.nav}>
            <Pressable onPress={goBack} hitSlop={12} style={styles.backHit}>
              <Text style={styles.back}>‹</Text>
            </Pressable>
            {photoNav ? <Text style={styles.navTitle}>Your photo</Text> : null}
            {handlerNav ? <Text style={styles.navTitle}>Add handler</Text> : null}
            {notifyNav ? <Text style={styles.navTitle}>Notifications</Text> : null}
            {handlerNav ? (
              <Text style={[styles.stepLabel, styles.stepRight]}>{step === 'handler1' ? '1 of 2' : '2 of 2'}</Text>
            ) : notifyNav ? (
              <View style={{ width: 40 }} />
            ) : (
              <>
                <Text style={[styles.stepLabel, photoNav && styles.stepRight]}>STEP {stepNumber} OF 6</Text>
                {!photoNav ? <View style={{ width: 40 }} /> : null}
              </>
            )}
          </View>

          {step === 1 ? (
            <>
              <View style={styles.ga}>
                <Text style={styles.gaText}>GA</Text>
              </View>
              <Text style={styles.h1}>You've been invited to join SchoolShield for Greenfield Academy.</Text>
              <View style={styles.validCard}>
                <Text style={styles.validTitle}>✓  Invitation valid</Text>
                <Row label="School" value="Greenfield Academy" />
                <Row label="Campus" value="Lekki Phase 1" />
                <Row label="Children linked" value="2" />
              </View>
              <View style={{ flex: 1, minHeight: 24 }} />
              <PrimaryButton label="Continue" onPress={() => setStep(2)} />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Your children</Text>
              <Text style={styles.body}>
                Greenfield Academy linked these children to your invitation, with the photos held on their school record. Are these the children you want to manage?
              </Text>
              {CHILDREN.map((child) => {
                const on = selected.includes(child.id);
                return (
                  <Pressable key={child.id} onPress={() => setSelected((ids) => (ids.includes(child.id) ? ids.filter((x) => x !== child.id) : [...ids, child.id]))} style={styles.childCard}>
                    <InitialsAvatar name={child.name} size={48} color={child.color} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childMeta}>{child.meta}</Text>
                    </View>
                    <View style={[styles.check, on && styles.checkOn]}>
                      {on ? <Text style={styles.checkMark}>✓</Text> : null}
                    </View>
                  </Pressable>
                );
              })}
              <View style={styles.note}>
                <Text style={styles.noteText}>
                  You are being added as a guardian for {selected.length === 2 ? 'both children' : CHILDREN.find((c) => selected.includes(c.id))?.name.split(' ')[0] || 'this child'}. Only Greenfield Academy can add or remove a child.
                </Text>
              </View>
              <PrimaryButton
                label="Confirm children"
                enabled={selected.length > 0}
                onPress={() => {
                  setHandlerKids((ids) => {
                    const kept = ids.filter((id) => selected.includes(id));
                    return kept.length > 0 ? kept : selected;
                  });
                  setStep(3);
                }}
              />
              <View style={{ height: 12 }} />
              <PrimaryButton outline label="Something isn't right" onPress={() => setWrong(true)} />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Your details</Text>
              <Text style={styles.body}>Gate staff see your name and relationship when they verify a handover.</Text>
              <Field label="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
              <View style={{ height: 16 }} />
              <Text style={styles.fieldLabel}>
                Relationship to {CHILDREN.filter((c) => selected.includes(c.id)).map((c) => c.name.split(' ')[0]).join(' and ') || 'your children'}
              </Text>
              <View style={styles.pills}>
                {(['Parent', 'Guardian'] as const).map((item) => {
                  const on = relationship === item;
                  return (
                    <Pressable key={item} onPress={() => setRelationship(item)} style={[styles.pill, on && styles.pillOn]}>
                      <Text style={[styles.pillText, on && styles.pillTextOn]}>{item}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={{ height: 16 }} />
              <Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" prefix="+234" />
              <Text style={styles.hint}>We verify this number next. Alerts about your children go here.</Text>
              <View style={{ height: 16 }} />
              <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <Text style={styles.hint}>Used for your weekly summary and receipts only.</Text>
              <View style={{ height: 24 }} />
              <PrimaryButton
                label="Continue"
                enabled={name.trim().length > 0 && phone.trim().length > 0}
                onPress={() => setStep('photo')}
              />
            </>
          ) : null}

          {step === 'photo' ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Add your photo</Text>
              <Text style={styles.body}>
                Gate staff match this face before releasing {CHILDREN.filter((c) => selected.includes(c.id)).map((c) => c.name.split(' ')[0]).join(' or ') || 'your child'}. It is required — you cannot continue without it.
              </Text>
              <View style={styles.cameraWell}>
                <View style={styles.cameraCircle}>
                  <Text style={styles.cameraIcon}>{hasPhoto ? '✓' : '📷'}</Text>
                </View>
                <Text style={styles.photoEmpty}>{hasPhoto ? 'Photo added' : 'No photo yet'}</Text>
                <Text style={styles.hintCenter}>Face clearly visible, no sunglasses, daylight if you can.</Text>
              </View>
              <View style={styles.rowBtns}>
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    label="Take photo"
                    onPress={() => {
                      setHasPhoto(true);
                      setUploadFailed(false);
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    outline
                    label="Upload"
                    onPress={() => {
                      setHasPhoto(true);
                      setUploadFailed(false);
                    }}
                  />
                </View>
              </View>
              <View style={styles.warn}>
                <Text style={styles.warnText}>
                  Continue stays disabled until a photo is saved. Required for every guardian and every saved handler.
                </Text>
              </View>
              <PrimaryButton label="Continue" enabled={hasPhoto} onPress={() => setStep('preview')} />
            </>
          ) : null}

          {step === 'preview' ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Does this look right?</Text>
              <Text style={styles.body}>This is what gate staff will see beside your name.</Text>
              <View style={styles.previewCard}>
                <InitialsAvatar name={displayName} size={96} color="#C4A574" />
                <Text style={styles.previewName}>{displayName}</Text>
                <Text style={styles.childMeta}>
                  {relationship} · Greenfield Academy
                </Text>
              </View>
              <View style={styles.rowBtns}>
                <View style={{ flex: 1 }}>
                  <PrimaryButton outline label="Retake" onPress={() => { setHasPhoto(false); setStep('photo'); }} />
                </View>
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    success
                    label="Use this photo"
                    onPress={() => {
                      setSeconds(24);
                      setCode('');
                      setOtpError(false);
                      setStep(4);
                    }}
                  />
                </View>
              </View>
              <Text style={styles.failKicker}>IF THE UPLOAD FAILS</Text>
              {uploadFailed ? (
                <View style={styles.failCard}>
                  <Text style={styles.failTitle}>Photo didn't upload</Text>
                  <Text style={styles.failBody}>
                    Weak connection. The photo is saved on your phone — we'll retry automatically, or tap below.
                  </Text>
                  <PrimaryButton dangerOutline label="Retry upload" onPress={() => setUploadFailed(false)} />
                </View>
              ) : (
                <Pressable onPress={() => setUploadFailed(true)}>
                  <Text style={styles.failHint}>Tap if the photo didn't upload</Text>
                </Pressable>
              )}
            </>
          ) : null}

          {step === 4 ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Verify your phone</Text>
              <Text style={styles.body}>We sent a 4-digit code to {maskedPhone}.</Text>
              <OtpBoxes
                value={code}
                error={otpError}
                ok={otpOk}
                onChange={(next) => {
                  setCode(next);
                  setOtpError(false);
                  setOtpOk(false);
                }}
              />
              {otpError ? (
                <View style={styles.errBanner}>
                  <Text style={styles.errBannerText}>Code entered is incorrect. Check input and try again</Text>
                </View>
              ) : null}
              {otpOk ? (
                <View style={styles.okBanner}>
                  <Text style={styles.okBannerText}>Accepted. Loading the next screen…</Text>
                </View>
              ) : null}
              <View style={styles.otpMeta}>
                <Text style={styles.hint}>
                  {seconds > 0 ? `Resend available in 0:${String(seconds).padStart(2, '0')}` : 'Resend available now'}
                </Text>
                <Pressable onPress={() => setCode('')} hitSlop={8}>
                  <Text style={styles.clear}>Clear</Text>
                </Pressable>
              </View>
              {seconds <= 0 ? (
                <Pressable onPress={() => setSeconds(24)} style={{ marginBottom: 16 }}>
                  <Text style={styles.clear}>Resend code</Text>
                </Pressable>
              ) : null}
            </>
          ) : null}

          {step === 5 ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Create a password</Text>
              <Text style={styles.body}>You'll use your phone number and this password to sign in.</Text>
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                password={!showPass}
                placeholder="eg. #ye12563"
                trailing={
                  <Pressable onPress={() => setShowPass((v) => !v)}>
                    <Text style={styles.clear}>{showPass ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                }
              />
              <View style={{ height: 14 }} />
              <Field
                label="Confirm password"
                value={confirm}
                onChangeText={setConfirm}
                password={!showConfirm}
                error={mismatch}
                trailing={
                  <Pressable onPress={() => setShowConfirm((v) => !v)}>
                    <Text style={styles.clear}>{showConfirm ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                }
              />
              {mismatch ? <Text style={styles.mismatch}>Passwords don't match.</Text> : null}
              <View style={styles.reqCard}>
                <Text style={styles.reqKicker}>PASSWORD REQUIREMENTS</Text>
                <Req ok={password.length >= 8} label="At least 8 characters" />
                <Req ok={/[A-Z]/.test(password)} label="One uppercase letter" />
                <Req ok={/\d/.test(password)} label="One number" />
                <Req ok={/[^A-Za-z0-9]/.test(password)} label="One special character" />
              </View>
              <PrimaryButton
                label="Create account"
                enabled={meetsPassword(password) && password === confirm && confirm.length > 0}
                onPress={() => setStep(6)}
              />
            </>
          ) : null}

          {step === 6 ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Who else may pick up your child?</Text>
              <Text style={styles.body}>
                You can save trusted people such as a nanny, driver, grandparent or relative. You can also authorise someone for just one pickup.
              </Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>★  Saved handler</Text>
                <Text style={styles.body}>
                  Someone you trust regularly. You choose which children they may collect and on which days. They stay on your list until you remove them.
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>1  One-time handler</Text>
                <Text style={styles.body}>
                  Authorised for a single pickup window and nothing else. They are never added to your saved list.
                </Text>
              </View>
              <PrimaryButton label="Add a handler" onPress={() => setStep('handler1')} />
              <View style={{ height: 12 }} />
              <PrimaryButton outline label="I'll do this later" onPress={() => setStep('notify')} />
              <View style={styles.warn}>
                <Text style={styles.warnText}>
                  If you skip this, only you can collect Amara and David until you add someone. You will be reminded.
                </Text>
              </View>
            </>
          ) : null}

          {step === 'handler1' ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Handler details</Text>
              <Text style={styles.body}>Enter their name exactly as it appears on their ID. Gate staff check this.</Text>
              <Field label="Full name" value={handlerName} onChangeText={setHandlerName} autoCapitalize="words" placeholder="Stanley Bright" />
              <View style={{ height: 14 }} />
              <Field label="Phone number" value={handlerPhone} onChangeText={setHandlerPhone} keyboardType="phone-pad" prefix="+234" />
              <Text style={styles.hint}>Pickup codes are sent to this number and only work from it.</Text>
              <View style={{ height: 16 }} />
              <Text style={styles.fieldLabel}>Relationship</Text>
              <View style={styles.wrapPills}>
                {['Nanny', 'Driver', 'Grandparent', 'Relative', 'Family friend', 'Other'].map((item) => {
                  const on = handlerRel === item;
                  return (
                    <Pressable key={item} onPress={() => setHandlerRel(item)} style={[styles.pill, on && styles.pillOn]}>
                      <Text style={[styles.pillText, on && styles.pillTextOn]}>{item}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable onPress={() => setHandlerPhoto(true)} style={styles.photo}>
                <View style={styles.plus}>
                  <Text style={styles.plusText}>{handlerPhoto ? '✓' : '+'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.photoTitle}>{handlerPhoto ? 'Photo added' : 'Take their photo · required'}</Text>
                  <Text style={styles.hint}>Required. Staff match this face before releasing your child.</Text>
                </View>
              </Pressable>
              <PrimaryButton
                label="Continue"
                enabled={handlerName.trim().length > 0 && handlerPhone.trim().length > 0 && handlerPhoto}
                onPress={() => setStep('handler2')}
              />
            </>
          ) : null}

          {step === 'handler2' ? (
            <>
              <View style={styles.handlerHead}>
                <InitialsAvatar name={handlerName.trim() || 'New handler'} size={48} color="#C45C6A" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.childName}>{handlerName.trim() || 'New handler'}</Text>
                  <Text style={styles.childMeta}>
                    {handlerRel} · +234 {handlerPhone}
                  </Text>
                </View>
              </View>
              <Text style={[styles.h1, styles.h1Left]}>What may {firstHandler} do?</Text>
              <Text style={styles.body}>You can change this any time. Every handover they make is recorded.</Text>
              <ToggleRow title="Pickup" body="May collect at the end of the school day" value={pickupOn} onValue={setPickupOn} />
              <ToggleRow title="Drop-off" body="May bring your children in the morning" value={dropoffOn} onValue={setDropoffOn} />
              <ToggleRow title="Recurring authorisation" body="Mon, Wed and Fri without asking you each time" value={recurring} onValue={setRecurring} />
              <View style={styles.infoCard}>
                <Text style={styles.fieldLabel}>Which children?</Text>
                {CHILDREN.filter((child) => selected.includes(child.id)).map((child) => {
                  const on = handlerKids.includes(child.id);
                  return (
                    <Pressable
                      key={child.id}
                      onPress={() => setHandlerKids((ids) => (on ? ids.filter((x) => x !== child.id) : [...ids, child.id]))}
                      style={styles.kidCheck}
                    >
                      <View style={[styles.box, on && styles.boxOn]}>{on ? <Text style={styles.checkMark}>✓</Text> : null}</View>
                      <Text style={styles.childName}>
                        {child.name} · {child.meta.split(' · ')[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.note}>
                <Text style={styles.noteText}>
                  Greenfield Academy allows recurring authorizations. {firstHandler} will get a fresh code each school day they are assigned — codes are never reused.
                </Text>
              </View>
              <PrimaryButton
                label="Save handler"
                enabled={handlerKids.length > 0 && (pickupOn || dropoffOn)}
                onPress={() => {
                  setSavedHandler(handlerName.trim());
                  setStep('notify');
                }}
              />
            </>
          ) : null}

          {step === 'notify' ? (
            <>
              <Text style={[styles.h1, styles.h1Left]}>Stay informed</Text>
              <Text style={styles.body}>Stay informed when your child's school handover status changes.</Text>
              <View style={styles.infoCard}>
                <Text style={styles.reqKicker}>CHANNELS</Text>
                <ToggleRow title="Push notifications" body="SchoolShield on this phone" value={pushOn} onValue={setPushOn} />
                <ToggleRow title="SMS" body={`+234 ${phone} · works without data`} value={smsOn} onValue={setSmsOn} />
                <ToggleRow title="WhatsApp" body="Supported by Greenfield Academy" value={waOn} onValue={setWaOn} />
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.reqKicker}>WHAT YOU'LL BE TOLD</Text>
                <AlwaysRow title="Security alert" body="Someone tried to collect without authorization" />
                <AlwaysRow title="Emergency authorization request" body="The gate needs your decision now" />
                <ToggleRow title="Child checked in" body="Arrival confirmed at the gate" value={checkinOn} onValue={setCheckinOn} />
                <ToggleRow title="Pickup reminder" body="30 minutes before the window opens" value={reminderOn} onValue={setReminderOn} />
                <ToggleRow title="Pickup completed" body="Who collected, when and at which gate" value={pickedOn} onValue={setPickedOn} />
                <ToggleRow title="Authorization changed" body="Created, cancelled or expired" value={authOn} onValue={setAuthOn} />
              </View>
              <View style={styles.note}>
                <Text style={styles.noteText}>
                  Security alerts and emergency pickup requests cannot be switched off. They are the reason SchoolShield exists.
                </Text>
              </View>
              <PrimaryButton label="Continue" onPress={() => setStep('done')} />
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
      )}

      <Modal visible={wrong} transparent animationType="fade" onRequestClose={() => setWrong(false)}>
        <Pressable style={styles.modalBg} onPress={() => setWrong(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Something isn't right</Text>
            <Text style={styles.body}>
              Ask Greenfield Academy to check the children on this invitation. Only the school can add or remove a child.
            </Text>
            <PrimaryButton label="Close" onPress={() => setWrong(false)} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Req({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={styles.reqRow}>
      <View style={[styles.reqDot, ok && styles.reqDotOn]}>
        <Text style={styles.reqTick}>{ok ? '✓' : ''}</Text>
      </View>
      <Text style={{ color: ok ? colors.success : colors.mute, fontSize: 14 }}>{label}</Text>
    </View>
  );
}

function OtpBoxes({
  value,
  onChange,
  error,
  ok,
}: {
  value: string;
  onChange: (next: string) => void;
  error?: boolean;
  ok?: boolean;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 4))}
        keyboardType="number-pad"
        maxLength={4}
        autoFocus
        style={styles.hidden}
      />
      <View style={styles.otpRow} pointerEvents="none">
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.otpBox,
              i === value.length && !error && !ok && styles.otpFocus,
              error && styles.otpErr,
              ok && styles.otpGood,
            ]}
          >
            <Text style={[styles.otpChar, error && { color: '#B42318' }]}>{value[i] ?? ''}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ToggleRow({
  title,
  body,
  value,
  onValue,
}: {
  title: string;
  body: string;
  value: boolean;
  onValue: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.childName}>{title}</Text>
        <Text style={styles.childMeta}>{body}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValue}
        trackColor={{ false: '#E4E7EC', true: '#12B76A' }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function AlwaysRow({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.childName}>{title}</Text>
        <Text style={styles.childMeta}>{body}</Text>
      </View>
      <View style={styles.always}>
        <Text style={styles.alwaysText}>ALWAYS ON</Text>
      </View>
    </View>
  );
}

function AllSet({
  childrenNames,
  handler,
  alerts,
  onHome,
}: {
  childrenNames: string;
  handler: string | null;
  alerts: string;
  onHome: () => void;
}) {
  const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 24 : 72;
  return (
    <View style={[styles.doneRoot, { paddingTop: topPad }]}>
      <View style={styles.doneCheck}>
        <Text style={{ color: colors.white, fontSize: 28, fontWeight: '700' }}>✓</Text>
      </View>
      <Text style={styles.doneTitle}>You're all set.</Text>
      <Text style={styles.doneSub}>Your SchoolShield family account is ready.</Text>
      <View style={styles.doneCard}>
        <DoneRow label="School" value="Greenfield Academy" />
        <DoneRow label="Children" value={childrenNames || '—'} />
        <DoneRow label="Saved handlers" value={handler || '—'} />
        <DoneRow label="Alerts" value={alerts} />
      </View>
      <View style={{ flex: 1 }} />
      <PrimaryButton inverted label="Go to Home" onPress={onHome} />
    </View>
  );
}

function DoneRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</Text>
      <Text style={{ color: colors.white, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const top = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingHorizontal: 24, paddingTop: top, paddingBottom: 36, flexGrow: 1 },
  nav: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backHit: { width: 40, height: 40, justifyContent: 'center' },
  back: { fontSize: 32, color: colors.ink, marginTop: -6 },
  navTitle: { flex: 1, textAlign: 'center', fontWeight: '600', fontSize: 16, color: colors.ink },
  stepLabel: {
    flex: 1,
    textAlign: 'center',
    color: colors.mute,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  stepRight: { flex: 0, textAlign: 'right', width: 96, fontSize: 11 },
  ga: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  gaText: { fontSize: 22, fontWeight: '700', color: colors.ink },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.4,
    lineHeight: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
  h1Left: { textAlign: 'left' },
  body: { color: colors.mute, fontSize: 14, lineHeight: 21, marginBottom: 18 },
  validCard: { backgroundColor: colors.white, borderRadius: 20, padding: 18, marginTop: 8 },
  validTitle: { color: colors.success, fontWeight: '700', marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowLabel: { color: colors.mute, fontSize: 14 },
  rowValue: { color: colors.ink, fontWeight: '600', fontSize: 14 },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  childName: { fontWeight: '700', color: colors.ink, fontSize: 16 },
  childMeta: { color: colors.mute, fontSize: 13, marginTop: 2 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  checkMark: { color: colors.white, fontWeight: '700', fontSize: 14 },
  note: { backgroundColor: '#EEF4FF', borderRadius: 16, padding: 14, marginTop: 6, marginBottom: 24 },
  noteText: { color: colors.navy, fontSize: 13, lineHeight: 19 },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: colors.ink, marginBottom: 8 },
  pills: { flexDirection: 'row', gap: 8 },
  pill: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.white },
  pillOn: { backgroundColor: colors.navy },
  pillText: { fontWeight: '600', color: colors.ink },
  pillTextOn: { color: colors.white },
  hint: { color: colors.mute, fontSize: 12, lineHeight: 18, marginTop: 6 },
  hintCenter: { color: colors.mute, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  cameraWell: { alignItems: 'center', marginVertical: 12 },
  cameraCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cameraIcon: { fontSize: 36 },
  photoEmpty: { fontWeight: '700', color: colors.ink, marginBottom: 4 },
  rowBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  warn: {
    backgroundColor: '#FFF6E5',
    borderRadius: 14,
    padding: 12,
    marginVertical: 16,
  },
  warnText: { color: '#B54708', fontSize: 13, lineHeight: 18 },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewName: { fontWeight: '700', fontSize: 18, color: colors.ink, marginTop: 12 },
  failKicker: { color: colors.mute, fontSize: 11, fontWeight: '700', letterSpacing: 1.1, marginTop: 20, marginBottom: 8 },
  failCard: { backgroundColor: '#FEF3F2', borderRadius: 16, padding: 14 },
  failTitle: { color: '#B42318', fontWeight: '700', marginBottom: 6 },
  failBody: { color: '#B42318', fontSize: 13, lineHeight: 18, marginBottom: 12 },
  failHint: { color: colors.mute, fontSize: 12, marginTop: 8 },
  otpMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  clear: { color: colors.navy, fontWeight: '600', fontSize: 14 },
  otpError: { color: '#B42318', fontWeight: '700', marginBottom: 12 },
  hidden: { position: 'absolute', opacity: 0, height: 0, width: 0 },
  otpRow: { flexDirection: 'row', gap: 8 },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpFocus: { borderWidth: 1.5, borderColor: colors.navy },
  otpChar: { fontSize: 22, fontWeight: '600', color: colors.ink },
  reqCard: { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginVertical: 18 },
  reqKicker: { color: colors.mute, fontSize: 11, fontWeight: '700', letterSpacing: 1.1, marginBottom: 10 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  reqDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqDotOn: { backgroundColor: colors.success },
  reqTick: { color: colors.white, fontSize: 12, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(16,24,40,0.4)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.white, borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  errBanner: { backgroundColor: '#FEF3F2', borderRadius: 12, padding: 12, marginBottom: 12 },
  errBannerText: { color: '#B42318', fontSize: 13 },
  okBanner: { backgroundColor: '#ECFDF3', borderRadius: 12, padding: 12, marginBottom: 12 },
  okBannerText: { color: '#027A48', fontSize: 13 },
  otpErr: { borderWidth: 1.5, borderColor: '#F04438', backgroundColor: '#FEF3F2' },
  otpGood: { borderWidth: 1.5, borderColor: '#12B76A' },
  mismatch: { color: '#B42318', fontSize: 13, fontWeight: '600', marginTop: 8 },
  infoCard: { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginBottom: 12 },
  infoTitle: { fontWeight: '700', color: colors.ink, marginBottom: 6 },
  wrapPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginTop: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
  },
  plus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { fontSize: 22, color: colors.navy, fontWeight: '600' },
  photoTitle: { fontWeight: '700', color: colors.ink },
  handlerHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  kidCheck: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  always: { backgroundColor: '#ECFDF3', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  alwaysText: { color: '#027A48', fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  doneRoot: { flex: 1, paddingHorizontal: 24, paddingBottom: 28 },
  doneCheck: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#157A4B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  doneTitle: { color: colors.white, fontSize: 32, fontWeight: '700', textAlign: 'center' },
  doneSub: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  doneCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16 },
});
