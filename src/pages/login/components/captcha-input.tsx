import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RefreshIcon } from '../../../components/icons';
import styles from '../styles';
import { colors } from '../../../styles/globalStyles';

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
        <TouchableOpacity style={styles.captchaRefresh} onPress={onRefresh}>
          <RefreshIcon size={20} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.captchaInput}
          placeholder="Enter CAPTCHA"
          placeholderTextColor={colors.gray}
          value={captcha}
          onChangeText={setCaptcha}
          autoCapitalize="characters"
          maxLength={6}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  ),
);

export default CaptchaInput;
