import AuthPageLayout from '@/components/AuthPageLayout';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import PillButton from '@/components/PillButton';
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import AlreadyHaveAccount from '@/components/AlreadyHaveAccount';

interface Factor {
  strategy: string;
  phoneNumberId?: string;
}

const Page = () => {
  const [fullPhoneNumber, setFullPhoneNumber] = useState<string>('');
  const [validation, setValidation] = useState(false);

  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'login' | 'signup' }>();

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const header = type === 'login' ? 'Welcome back' : "Let's get started";
  const description =
    type === 'login'
      ? 'Enter the phone number associated with your account.'
      : 'Enter your phone number. We will send you a confirmation code there.';

  const onSubmit = async () => {
    if (type === 'login') {
      try {
        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });
        const firstPhoneFactor: Factor | undefined = supportedFirstFactors.find(
          (factor: Factor) => factor.strategy === 'phone_code'
        );
        if (firstPhoneFactor && firstPhoneFactor.phoneNumberId) {
          const { phoneNumberId } = firstPhoneFactor;
          await signIn!.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId,
          });
          router.push({
            pathname: '/verify/[phone]',
            params: { phone: fullPhoneNumber, signin: 'true' },
          });
        } else {
          Alert.alert('Error', 'No phone verification method available');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (isClerkAPIResponseError(error)) {
            Alert.alert('Error', error.errors[0].message);
          } else {
            Alert.alert('Error', error.message);
          }
        }
      }
    } else {
      const header = "Let's get started";
      try {
        await signUp!.create({
          phoneNumber: fullPhoneNumber,
        });
        signUp!.preparePhoneNumberVerification();
        router.push({
          pathname: '/verify/[phone]',
          params: { phone: fullPhoneNumber },
        });
      } catch (error) {
        if (isClerkAPIResponseError(error)) {
          Alert.alert('Error', error.errors[0].message);
        }
      }
    }
  };

  return (
    <AuthPageLayout>
      <PhoneNumberInput
        header={header}
        description={description}
        fullPhoneNumber={fullPhoneNumber}
        setFullPhoneNumber={setFullPhoneNumber}
        setValidation={setValidation}
      />

      {type === 'signup' && <AlreadyHaveAccount />}

      <PillButton
        title={type === 'login' ? 'Log in' : 'Sign up'}
        onPress={onSubmit}
        disabled={!validation}
        style={{ marginBottom: 20, width: 250 }}
      />
    </AuthPageLayout>
  );
};

export default Page;
