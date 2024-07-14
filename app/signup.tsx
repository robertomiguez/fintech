import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
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
  const { signUp } = useSignUp();
  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    try {
      console.log(fullPhoneNumber);
      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });

      signUp!.preparePhoneNumberVerification();
      router.push({
        pathname: '/verify/[phone]',
        params: { phone: fullPhoneNumber },
      });
    } catch (error) {
      console.error(error, JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0].code === 'form_identifier_not_found') {
          console.warn('error', error.errors[0].message);
        }
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let`s get started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there.
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
        <Link href={'/login'} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in.
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== '' ? styles.enabled : styles.disabled,
            {
              marginBottom: 20,
            },
          ]}
          onPress={onSignUp}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
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
