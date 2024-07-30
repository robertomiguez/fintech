import { View, Text, TextInput, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CountryPickerModal from '@/components/CountryPickerModal';
import { Country } from '@/types/Country';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import { getRegionCode } from '@/utils/CountryUtils';

interface PhoneNumberInputProps {
  header: string;
  description: string;
  fullPhoneNumber: string;
  setFullPhoneNumber: (text: string) => void;
  setValidation: (isValid: boolean) => void;
}

const fetchCountries = async () => {
  try {
    const response = await fetch('/api/countries/all');
    if (!response.ok) throw new Error('Failed to fetch countries');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const PhoneNumberInput = ({
  header,
  description,
  fullPhoneNumber,
  setFullPhoneNumber,
  setValidation,
}: PhoneNumberInputProps) => {
  const {
    data: countries,
    isLoading: isCountriesLoading,
    error: countriesError,
  } = useQuery({ queryKey: ['countries'], queryFn: fetchCountries });
  const [country, setCountry] = useState<Country>();
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const regionCode = getRegionCode();

  useEffect(() => {
    if (countries && countries.length > 0) {
      const matchingCountry = countries.find(
        (country: Country) => country.regionCode === regionCode
      );

      if (matchingCountry) {
        setCountry(matchingCountry);
      }
    }
  }, [countries, regionCode]);

  useEffect(() => {
    const validationResult = isValidPhoneNumber(
      `${country?.phoneCode}${phoneNumber}`
    );
    if (validationResult) {
      setFullPhoneNumber(`${country?.phoneCode}${phoneNumber}`);
      setValidation(true);
    }
  }, [
    country?.phoneCode,
    fullPhoneNumber,
    phoneNumber,
    setFullPhoneNumber,
    setValidation,
  ]);
  return (
    <>
      <Loading show={isCountriesLoading} />
      <ErrorMessage show={countriesError} />
      <Text style={defaultStyles.header}>{header}</Text>
      <Text style={defaultStyles.descriptionText}>{description}</Text>
      <View style={styles.inputContainer}>
        {countries && (
          <>
            <CountryPickerModal
              countries={countries}
              selectedCountry={country as Country}
              onSelectCountry={setCountry}
              displayProperty="phoneCode"
              placeholder="Select phone code"
              pickerButtonWidth={110}
            />
            <TextInput
              style={[styles.input, styles.phoneNumberInput]}
              placeholder="Phone number"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </>
        )}
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
    backgroundColor: '#fff',
    // padding: 20,
    borderRadius: 16,
    fontSize: 23,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginLeft: 10,
    paddingLeft: 20,
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
