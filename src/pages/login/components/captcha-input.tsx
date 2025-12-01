import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { RefreshIcon } from '../../../components/icons';
import styles from '../styles';
import { colors } from '../../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
interface Props {
  captcha: string;
  setCaptcha: (value: string) => void;
  captchaCode: string;
  onRefresh: () => void;
  error?: string;
}

const CaptchaInput: React.FC<Props> = React.memo(
  ({ captcha, setCaptcha, captchaCode, onRefresh, error }) => (
    <View style={styles.mainInputContainer}>
      <View style={styles.captchaContainer}>
        <Text style={styles.captchaText}>{captchaCode}</Text>
       
        <TextInput
          style={styles.captchaInput}
          placeholder="Enter CAPTCHA"
          placeholderTextColor={colors.gray}
          value={captcha}
          onChangeText={setCaptcha}
          autoCapitalize="characters"
          maxLength={6}
        />
         <TouchableOpacity style={styles.captchaRefresh} onPress={onRefresh}>
          <RefreshIcon size={screenWidth * 0.043} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  ),
);

export default CaptchaInput;
