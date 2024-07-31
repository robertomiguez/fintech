import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';

const AlreadyHaveAccount = () => {
  return (
    <>
      <Link href={'/authpage?type=login'} replace asChild>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>
            Already have an account? Log in.
          </Text>
        </TouchableOpacity>
      </Link>
      <View style={{ flex: 1 }} />
    </>
  );
};
export default AlreadyHaveAccount;
