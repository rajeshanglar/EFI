import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles';
import { colors } from '../../../styles/globalStyles';

interface Props {
  onPress: () => void;
  loading: boolean;
}

const LoginButton: React.FC<Props> = React.memo(({ onPress, loading }) => (
  <TouchableOpacity
    style={styles.loginButton}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={[colors.blue, colors.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.loginButtonGradient}
    >
      <Text style={styles.loginButtonText}>
        {loading ? 'LOGGING IN...' : 'LOGIN'}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
));

export default LoginButton;
