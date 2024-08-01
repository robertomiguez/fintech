import Colors from '@/constants/Colors';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import EditUserInfo from '@/components/EditUserInfo';
import ActionButton from '@/components/ActionButton';
import { validateRequiredFields } from '@/utils/ValidationUtils';
import { Country } from '@/types/Country';

interface User {
  unsafeMetadata?: {
    country?: Country;
  };
}

const Page = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [birthday, setBirthday] = useState(user?.unsafeMetadata?.birthday);
  const [country, setCountry] = useState<Country | null>(() => {
    const flag = (user as User | null)?.unsafeMetadata?.country?.flag;
    const name = (user as User | null)?.unsafeMetadata?.country?.name;
    return flag && name ? { flag, name } : null;
  });

  const [edit, setEdit] = useState(false);

  const navigation = useNavigation();

  const onSaveUser = async () => {
    try {
      const userToUpdate = {
        firstName: (firstName as string) || undefined,
        lastName: (lastName as string) || undefined,
        unsafeMetadata: {
          birthday: (birthday as string) || undefined,
          country: {
            name: (country as Country)?.name || undefined,
            flag: (country as Country)?.flag || undefined,
          },
        },
      };

      const { isValid, missingFields } = validateRequiredFields(userToUpdate);

      if (!isValid) {
        Alert.alert('Required fields:', missingFields.join(', '));
        return;
      }

      await user?.update(userToUpdate);
      setEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onCaptureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64 = result.assets[0].base64;
      const file = `data:image/png;base64,${base64}`;

      user?.setProfileImage({ file });
    }
  };

  const onSignOut = async () => {
    await signOut();
    navigation.goBack();
    router.replace('/');
  };

  return (
    <BlurView
      intensity={Platform.OS === 'ios' ? 80 : 250}
      tint="systemUltraThinMaterialLight"
      style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
    >
      {user && (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={onCaptureImage} style={styles.captureBtn}>
            {user?.imageUrl && (
              <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            )}
          </TouchableOpacity>
          <View style={styles.userInfoContainer}>
            {!edit ? (
              <View style={styles.editRow}>
                <Text>
                  {firstName} {lastName}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <EditUserInfo
                firstName={firstName as string}
                lastName={lastName as string}
                birthday={birthday as string}
                country={country as Country}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setBirthday={setBirthday}
                setCountry={setCountry}
                onSaveUser={onSaveUser}
              />
            )}
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <ActionButton
          iconName="log-out"
          text="Log out"
          onPress={onSignOut}
          textColor={Colors.primary}
        />
        <ActionButton
          iconName="person"
          text="Account"
          textColor={Colors.gray}
        />
        <ActionButton iconName="bulb" text="Learn" textColor={Colors.gray} />
        <ActionButton
          iconName="megaphone"
          text="Inbox"
          textColor={Colors.gray}
          notificationCount={0}
        />
      </View>
    </BlurView>
  );
};

export default Page;

const styles = StyleSheet.create({
  editRow: {
    flexDirection: 'row', // Change to row
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
  userInfoContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  captureBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    top: 80,
  },
  inputField: {
    width: 140,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  actions: {
    backgroundColor: 'rgba(0, 0, 256, 0.1)',
    borderRadius: 16,
    gap: 0,
    margin: 20,
    top: 120,
  },
  btn: {
    padding: 14,
    flexDirection: 'row',
    gap: 20,
  },
});
