import { View, Text, TextInput, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useEffect } from 'react';

interface PhoneNumberInputProps {
  header: string;
  description: string;
  countryCode: string;
  setCountryCode: (text: string) => void;
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
  setValidation: (isValid: boolean) => void;
}

const PhoneNumberInput = ({
  header,
  description,
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  setValidation,
}: PhoneNumberInputProps) => {
  useEffect(() => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const validationResult = isValidPhoneNumber(fullPhoneNumber);
    setValidation(validationResult);
  }, [countryCode, phoneNumber, setValidation]);

  return (
    <>
      <Text style={defaultStyles.header}>{header}</Text>
      <Text style={defaultStyles.descriptionText}>{description}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.countryCodeInput]}
          placeholder="Country Code"
          keyboardType="numeric"
          value={countryCode}
          onChangeText={setCountryCode}
        />
        <TextInput
          style={[styles.input, styles.phoneNumberInput]}
          placeholder="Phone number"
          placeholderTextColor={Colors.gray}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
    </>
  );
};

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
  },
  countryCodeInput: {
    flex: 1,
    marginRight: 10,
  },
  phoneNumberInput: {
    flex: 4,
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginTop: -30,
    marginBottom: 10,
  },
});

export default PhoneNumberInput;
