import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { EmailIcon, PasswordIcon } from '../../../components/icons';
import styles from '../styles';
import { colors } from '../../../styles/globalStyles';

interface Props {
  loginType: 'member' | 'conference';
  onLoginTypeChange: (type: 'member' | 'conference') => void;
  email: string;
  password: string;
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  errors: { email?: string; password?: string };
}

const LoginForm: React.FC<Props> = React.memo(
  ({
    loginType,
    onLoginTypeChange,
    email,
    password,
    setEmail,
    setPassword,
    errors,
  }) => (
    <View>
      
      <Text style={styles.welcomeTitle}>WELCOME TO LOGIN</Text>

      {/* Radio Buttons */}
      <View style={styles.loginTypeContainer}>
        {['member', 'conference'].map(type => (
          <TouchableOpacity
            key={type}
            style={styles.radioOption}
            onPress={() => onLoginTypeChange(type as any)}
          >
            <View
              style={[styles.radio, loginType === type && styles.radioSelected]}
            >
              {loginType === type && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>
              {type === 'member' ? 'Member Login' : 'Conference Login'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <EmailIcon size={26} color={colors.primary} />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor={colors.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Password */}
      <View style={styles.inputContainer}>
        <PasswordIcon size={26} color={colors.primary} />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor={colors.gray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot?</Text>
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
    </View>
  ),
);

export default LoginForm;
