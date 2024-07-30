import AuthPageLayout from '@/components/AuthPageLayout';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import PillButton from '@/components/PillButton';
import { SignIn } from '@/types/SignIn';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

const Page = () => {
  const [fullPhoneNumber, setFullPhoneNumber] = useState<string>('');
  const [validation, setValidation] = useState(false);

  const router = useRouter();
  const { signIn } = useSignIn();
  const onSignIn = async (type: SignIn) => {
    if (type === SignIn.Phone) {
      try {
        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstPhoneFactor: any = supportedFirstFactors.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (factor: any) => {
            return factor.strategy === 'phone_code';
          }
        );
        const { phoneNumberId } = firstPhoneFactor;
        await signIn!.prepareFirstFactor({
          strategy: 'phone_code',
          phoneNumberId,
        });
        router.push({
          pathname: '/verify/[phone]',
          params: { phone: fullPhoneNumber, signin: 'true' },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (isClerkAPIResponseError(error)) {
            Alert.alert('error', error.errors[0].message);
          } else {
            Alert.alert('error', error.message);
          }
        }
      }
    }
  };
  return (
    <AuthPageLayout>
      <>
        <PhoneNumberInput
          header="Let's get started"
          description="Enter your phone number. We will send you a confirmation code there."
          fullPhoneNumber={fullPhoneNumber}
          setFullPhoneNumber={setFullPhoneNumber}
          setValidation={setValidation}
        />
        <PillButton
          title="Continue"
          onPress={() => onSignIn(SignIn.Phone)}
          disabled={!validation}
          style={{ marginBottom: 20, width: 250 }}
        />
      </>
    </AuthPageLayout>
  );
};
export default Page;

const styles = StyleSheet.create({});
