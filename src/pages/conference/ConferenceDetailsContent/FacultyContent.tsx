import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import globalStyles, { colors, spacing } from '../../../styles/globalStyles';
import { ArrowRightIcon, DoctorIcon } from '../../../components/icons';
import { ConferenceMemberData } from '../../../components/CommitteeFacultyModal';

interface FacultyContentProps {
  onMemberPress?: (member: ConferenceMemberData) => void;
}

const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    GB: '🇬🇧',
    IN: '🇮🇳',
    DE: '🇩🇪',
    US: '🇺🇸',
  };
  return flags[countryCode] || '🏳️';
};

const facultyMembers: ConferenceMemberData[] = [
  {
    name: 'Dr. Vimee Bindra',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/vimeebindra.jpg'),
    role: 'Faculty Member',
    bio: 'Dr. Vimee Bindra is a distinguished faculty member specializing in endometriosis care.',
  },
  {
    name: 'Harald Krentel',
    country: 'UK',
    countryCode: 'GB',
    image: null,
    role: 'Faculty Member',
    bio: 'Harald Krentel brings international expertise to the faculty.',
  },
  {
    name: 'Vivek Salunke',
    country: 'Germany',
    countryCode: 'DE',
    image: require('../../../assets/images/efiboard/viveksalunke.png'),
    role: 'Faculty Member',
    bio: 'Vivek Salunke contributes expertise from Germany.',
  },
  {
    name: 'Yashodhan Deka',
    country: 'Germany',
    countryCode: 'DE',
    image: require('../../../assets/images/efiboard/yashodan.jpg'),
    role: 'Faculty Member',
    bio: 'Yashodhan Deka is a valued faculty member.',
  },
  {
    name: 'Sonu Singh',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/sonusingh.jpg'),
    role: 'Faculty Member',
    bio: 'Sonu Singh brings expertise from India.',
  },
];

export const FacultyContent: React.FC<FacultyContentProps> = ({ onMemberPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - spacing.lg * 3) / 2;

  return (
    <View style={styles.container}>
      <View style={globalStyles.boardGrid}>
        {facultyMembers.map((member, index) => (
          <TouchableOpacity
            key={index}
            style={[globalStyles.boardCard, { width: cardWidth }]}
            activeOpacity={0.9}
            onPress={() => onMemberPress?.(member)}
          >
            <View style={globalStyles.boardImageContainer}>
              {member.image ? (
                <Image
                  source={member.image}
                  style={globalStyles.boardMemberImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={globalStyles.boardMemberPlaceholderImage}>
                  <DoctorIcon size={40} color={colors.primary} />
                </View>
              )}
            </View>
            <Text style={globalStyles.boardMemberName}>{member.name}</Text>
            {member.country && (
              <View style={globalStyles.boardMembercountryContainer}>
                <Text style={globalStyles.boardMemberflag}>
                  {getCountryFlag(member.countryCode || '')}
                </Text>
                <Text style={globalStyles.boardMembercountry}>{member.country}</Text>
              </View>
            )}
            <View style={globalStyles.boardArrowContainer}>
              <ArrowRightIcon size={14} color={colors.white} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
  },
});