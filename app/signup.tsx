import AuthPageLayout from '@/components/AuthPageLayout';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import PillButton from '@/components/PillButton';
import { defaultStyles } from '@/constants/Styles';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Page = () => {
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validation, setValidation] = useState(false);

  const router = useRouter();
  const { signUp } = useSignUp();
  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
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
        if (error.errors[0].code === 'form_identifier_not_found') {
          Alert.alert('error', error.errors[0].message);
        }
      }
    }
  };

  return (
    <AuthPageLayout>
      <PhoneNumberInput
        header="Let's get started"
        description="Enter your phone number. We will send you a confirmation code there."
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        setValidation={setValidation}
      />

      <Link href={'/login'} replace asChild>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>
            Already have an account? Log in.
          </Text>
        </TouchableOpacity>
      </Link>
      <View style={{ flex: 1 }} />
      <PillButton
        title="Sign up"
        onPress={onSignUp}
        disabled={!validation}
        style={{ marginTop: 'auto', marginBottom: 20 }}
      />
    </AuthPageLayout>
  );
};

export default Page;

const styles = StyleSheet.create({});
