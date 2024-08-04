import { Alert } from 'react-native';

export const showNotImplementedAlert = (
  featureName: string,
  additionalMessage?: string
) => {
  Alert.alert(
    'Not Implemented',
    `The ${featureName} feature has not been implemented yet. ${additionalMessage ? `\n\n${additionalMessage}` : ''}`
  );
};
