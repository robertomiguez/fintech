import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
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
import { Picker } from '@react-native-picker/picker';

interface EditUserInfoProps {
  firstName: string;
  lastName: string;
  birthday: string;
  country: string;
  setFirstName: (text: string) => void;
  setLastName: (text: string) => void;
  setBirthday: (text: string) => void;
  setCountry: (text: string) => void;
  onSaveUser: () => void;
}

const fetchCountries = async () => {
  const response = await fetch('/api/countries');
  if (!response.ok) throw new Error('Failed to fetch countries');
  return await response.json();
};

const EditUserInfo = ({
  firstName = '',
  lastName = '',
  birthday = '',
  country = '',
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
        <Picker
          selectedValue={country}
          onValueChange={(itemValue) => setCountry(itemValue)}
          style={styles.inputField}
        >
          <Picker.Item label="Select Country" value="" />
          {countries?.map((country: { name: string }, index: number) => (
            <Picker.Item
              key={index}
              label={country.name}
              value={country.name}
            />
          ))}
        </Picker>
      </View>
      <TouchableOpacity onPress={onSaveUser} style={styles.saveButton}>
        <Text>Save</Text>
        <Ionicons name="checkmark-outline" size={30} color={Colors.blue} />
      </TouchableOpacity>

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
    borderColor: Colors.gray,
    borderRadius: 8,
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
