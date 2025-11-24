import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { EmailIcon, PasswordIcon } from '../../../components/icons';
import styles from '../styles';
import { colors } from '../../../styles/globalStyles';

interface Props {
  email: string;
  password: string;
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  errors: { email?: string; password?: string };
}

const LoginForm: React.FC<Props> = React.memo(
  ({
     email,
    password,
    setEmail,
    setPassword,
    errors,
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
    <View>
      
      <Text style={styles.welcomeTitle}>WELCOME TO LOGIN</Text>
    
      {/* Email */}

      <View style={styles.emailContainer}>
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
      </View>
      {/* Password */}

        <View style={styles.emailContainer}>
            <View style={styles.inputContainer}>
              <PasswordIcon size={26} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <View style={styles.passwordActionsContainer}>
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIconContainer}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁'}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
        </View>
    </View>
    );
  },
);

export default LoginForm;
