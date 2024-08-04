import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import type { Country } from '@/types/Country';
import CountryPickerModal from '@/components/CountryPickerModal';
import CountryService from '@/services/CountryService';

interface EditUserInfoProps {
  firstName: string;
  lastName: string;
  birthday: string;
  country: Country | null;
  setFirstName: (text: string) => void;
  setLastName: (text: string) => void;
  setBirthday: (text: string) => void;
  setCountry: (text: Country | null) => void;
  onSaveUser: () => void;
}

const fetchCountries = async () => {
  return await CountryService.getCountries();
};

const EditUserInfo = ({
  firstName = '',
  lastName = '',
  birthday = '',
  country = null,
  setFirstName,
  setLastName,
  setBirthday,
  setCountry,
  onSaveUser,
}: EditUserInfoProps) => {
  const {
    data: countries,
    isLoading: isCountriesLoading,
    error: countriesError,
  } = useQuery({ queryKey: ['countries'], queryFn: fetchCountries });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirm = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setBirthday(format(selectedDate, 'dd/MM/yyyy'));
    }
    setDatePickerVisibility(false);
  };

  return (
    <View style={styles.editRow}>
      <Loading show={isCountriesLoading} />
      <ErrorMessage show={countriesError} />
      {!isCountriesLoading && (
        <>
          <View style={styles.row}>
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.inputField}
            />
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              style={styles.inputField}
            >
              <Text style={birthday ? {} : { color: Colors.gray }}>
                {birthday || 'dd/mm/yyyy'}
              </Text>
            </TouchableOpacity>
            {countries && (
              <CountryPickerModal
                countries={countries}
                selectedCountry={country}
                onSelectCountry={setCountry}
                displayProperty="name"
              />
            )}
          </View>
          <TouchableOpacity onPress={onSaveUser} style={styles.saveButton}>
            <Text>Save</Text>
            <Ionicons name="checkmark-outline" size={30} color={Colors.blue} />
          </TouchableOpacity>
        </>
      )}

      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleConfirm}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  editRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    top: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  inputField: {
    width: 140,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 16,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EditUserInfo;
