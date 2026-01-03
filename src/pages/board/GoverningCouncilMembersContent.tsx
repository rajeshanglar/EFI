import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { ArrowRightIcon, CardRightArrowIcon, DoctorIcon } from '../../components/icons';
import { BoardMemberData } from '../../components/BoardMemberModal';

interface GoverningCouncilMembersContentProps {
  onMemberPress?: (member: BoardMemberData) => void;
}

const governingCouncilMembers: BoardMemberData[] = [
  {
    name: 'Shinjini Pande',  
    image: null,
    role: 'Advisory Board Member',
    bio: ``,
  },
  {
    name: 'Radhika Nallamili ',
    image: null,
    role: 'Advisory Board Member',
    bio: ``,
  },
  {
    name: 'Aishwarya Nupur  ',
    image: null,
    role: 'Advisory Board Member',
    bio: ``,
  },
  {
    name: 'Shraddha Ramchnadani ',
    image: null,
    role: 'Advisory Board Member',
    bio: ``,
  },
];

// Country flag emojis
const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    GB: '🇬🇧',
    IN: '🇮🇳',
    DE: '🇩🇪',
    KE: '🇰🇪',
    US: '🇺🇸',
    CA: '🇨🇦',
    AU: '🇦🇺',
  };
  return flags[countryCode] || '🏳️';
};

export const GoverningCouncilMembersContent: React.FC<GoverningCouncilMembersContentProps> = ({ onMemberPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - spacing.lg * 3) / 2;

  return (
    <View style={styles.governingCouncilContainer}>
      <View style={globalStyles.boardGrid}>
        {governingCouncilMembers.map((member, index) => {
          const hasBio = typeof member.bio === 'string' && member.bio.trim().length > 0;

          return (
            <TouchableOpacity
              key={index}
              style={[globalStyles.boardCard, styles.card, { width: cardWidth }]}
              activeOpacity={0.9}
              disabled={!hasBio}
              onPress={() => {
                if (hasBio) {
                  onMemberPress?.(member);
                }
              }}
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
              {/* <View style={globalStyles.boardMembercountryContainer}>
                <Text style={globalStyles.boardMemberflag}>{getCountryFlag(member.countryCode || '')}</Text>
                <Text style={globalStyles.boardMembercountry}>{member.country}</Text>
              </View> */}
              {hasBio && (
                <View style={globalStyles.boardArrowContainer}>
                  <ArrowRightIcon size={14} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  governingCouncilContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
  },
  card: {
    backgroundColor: colors.lightYellow,
  },
});

