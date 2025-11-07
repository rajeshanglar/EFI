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

interface CommitteeContentProps {
  onMemberPress?: (member: ConferenceMemberData) => void;
}

const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    GB: '🇬🇧',
    IN: '🇮🇳',
    DE: '🇩🇪',
  };
  return flags[countryCode] || '🏳️';
};

const committeeMembers: ConferenceMemberData[] = [
  {
    name: 'Mohd Mabrouk',
    country: 'United Kingdom',
    countryCode: 'GB',
    image: null,
    role: 'Committee Member',
    bio: 'Mohd Mabrouk serves on the conference committee.',
  },
  {
    name: 'Seema Pandey',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/swethareddy.jpg'),
    role: 'Committee Member',
    bio: 'Seema Pandey is a valued committee member.',
  },
  {
    name: 'Harald Krentel',
    country: 'Germany',
    countryCode: 'DE',
    image: null,
    role: 'Committee Member',
    bio: 'Harald Krentel contributes to the committee.',
  },
  {
    name: 'Alin Constantin',
    country: 'Germany',
    countryCode: 'DE',
    image: null,
    role: 'Committee Member',
    bio: 'Alin Constantin serves on the committee.',
  },
  {
    name: 'Hemant Kanojia',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/vimee.jpg'),
    role: 'Committee Member',
    bio: 'Hemant Kanojia is a committee member.',
  },
];

export const CommitteeContent: React.FC<CommitteeContentProps> = ({ onMemberPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - spacing.lg * 3) / 2;

  return (
    <View style={styles.container}>
      <View style={globalStyles.boardGrid}>
        {committeeMembers.map((member, index) => (
          <TouchableOpacity
            key={index}
            style={[globalStyles.boardCard, styles.card, { width: cardWidth }]}
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
  card: {
    backgroundColor: colors.lightYellow,
  },
});



