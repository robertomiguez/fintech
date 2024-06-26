import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { SignIn } from '@/types/SignIn';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const Page = () => {
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { signIn } = useSignIn();
  const onSignIn = async (type: SignIn) => {
    if (type === SignIn.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
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
      } catch (error) {
        console.error(error, JSON.stringify(error, null, 2));
        if (isClerkAPIResponseError(error)) {
          if (error.errors[0].code === 'form_identifier_not_found') {
            console.warn('error', error.errors[0].message);
          }
        }
      }
      console.warn(`logged by ${SignIn[type]}`);
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number associated with your account.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country Code"
            keyboardType="numeric"
            value={countryCode}
            onChangeText={(text) => setCountryCode(text)}
          ></TextInput>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Phone number"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          ></TextInput>
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== '' ? styles.enabled : styles.disabled,
            {
              marginBottom: 20,
              width: 250,
            },
          ]}
          onPress={() => onSignIn(SignIn.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => onSignIn(SignIn.Email)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
              width: 250,
              paddingLeft: 13,
            },
          ]}
        >
          <Ionicons name="mail" size={24} color={'fff'} />
          <Text style={[defaultStyles.buttonText, { color: 'fff' }]}>
            Continue with email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSignIn(SignIn.Google)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
              width: 250,
              paddingLeft: 13,
            },
          ]}
        >
          <Ionicons name="logo-google" size={24} color={'fff'} />
          <Text style={[defaultStyles.buttonText, { color: 'fff' }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};
export default Page;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
