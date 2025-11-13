import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import globalStyles, { colors, spacing, Fonts, borderRadius } from '../../../styles/globalStyles';
import { ArrowRightIcon, DoctorIcon } from '../../../components/icons';
import { ConferenceMemberData } from '../../../components/CommitteeFacultyModal';

interface CommitteeContentProps {
  onMemberPress?: (member: ConferenceMemberData) => void;
  activeCommitteeTab?: 'organising' | 'scientific';
  onCommitteeTabChange?: (tab: 'organising' | 'scientific') => void;
}

const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    GB: '🇬🇧',
    IN: '🇮🇳',
    DE: '🇩🇪',
  };
  return flags[countryCode] || '🏳️';
};


const organisingCommittee: ConferenceMemberData[] = [
  {
    name: 'Dr. Vimee Bindra',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/vimeebindra.jpg'),
    role: 'Organising Committee',
    bio: 'Dr. Vimee Bindra Founder and President Endometriosis Foundation of India SRC Accredited Master Surgeon Multidisciplinary Endometriosis Care (MSMEC).Robotic and Laparoscopic Endometriosis Excision Surgeon ,Gynaecologist Apollo Health City, Hyderabad. Dr. Vimee Bindra is a distinguished robotic and laparoscopic gynaecologist based in Hyderabad, India, with over 15 years of experience in women’s health. She is widely recognized as one of India’s leading endometriosis surgeons, specializing in minimally invasive gynecological surgeries, particularly advanced excision procedures for endometriosis.She serves as a Consultant at Apollo Health City, Hyderabad, and is the Founder and President of the Endometriosis Foundation of India (EFI). Under her leadership, EFI has pioneered national-level initiatives including public awareness campaigns, international congresses, and specialized cadaveric dissection courses designed to train surgeons in advanced pelvic and neuroanatomy relevant to endometriosis surgery. These programs have been instrumental in bridging knowledge gaps, promoting early diagnosis, and advancing multidisciplinary care for women affected by this complex disease.Her contributions have been recognized with several accolades, including the Telangana Woman Leaders Award (2022) and the Young Clinician Award from Apollo Hospitals (2020). She has also authored multiple scientific publications and contributed chapters to leading gynecology textbooks.Fluent in English, Hindi, Bengali, Punjabi, and Telugu, Dr. Bindra remains committed to advancing women’s healthcare through clinical excellence, surgical innovation, patient advocacy, and medical education.',
  },
  {
    name: 'Dr. Archana Reddy',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/archana-reddy.jpg'),
    role: 'Organising Committee',
    bio: '',
  },
  {
    name: 'Dr. Swetha P',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/swethareddy.jpg'),
    role: 'Organising Committee',
    bio: '',
  },
  {
    name: 'Dr. Nandini Mupidi',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Organising Committee',
    bio: '',
  },
  {
    name: 'Dr. Nivya',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Organising Committee',
    bio: '',
  },
  {
    name: 'Dr. Radhika Nallamili',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Organising Committee',
    bio: '',
  },
  {
    name: 'Dr. Shradha Ramchandani',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Organising Committee',
    bio: '',
  },
  {
    name: 'Dr. Vashishtiny Reddy',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Organising Committee',
    bio: '',
  },
  {
    name: 'Dr. Harika Chikkam',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Organising Committee',
    bio: '',
  },
];


const scientificCommittee: ConferenceMemberData[] = [
  {
    name: 'Dr. Vimee Bindra',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/vimeebindra.jpg'),
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Vivek Salunke',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/viveksalunke.png'),
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Shinjini Pande',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Sandesh Kade',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/sandeshkade.jpg'),
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Seema Pandey',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Hemant Kanojia',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Sonu Singh',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Yashodhan Deka',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/yashodan.jpg'),
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Archana Reddy',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/archana-reddy.jpg'),
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. P Swetha',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/swethareddy.jpg'),
    role: 'Scientific Committee',
    bio: '',
  },
  {
    name: 'Dr. Sai Daayana',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'Scientific Committee',
    bio: '',
  },
  
];

const { width: screenWidth } = Dimensions.get('window');

export const CommitteeContent: React.FC<CommitteeContentProps> = ({ 
  onMemberPress,
  activeCommitteeTab = 'organising',
  onCommitteeTabChange,
}) => {
  const cardWidth = (screenWidth - spacing.lg * 3) / 2;

  // Get committee members based on active tab
  const committeeMembers = useMemo(() => {
    return activeCommitteeTab === 'organising' ? organisingCommittee : scientificCommittee;
  }, [activeCommitteeTab]);

  return (
    <View style={styles.container}>
      {/* Committee Grid */}
      <View style={styles.contentContainer}>
        <View style={globalStyles.boardGrid}>
          {committeeMembers.map((member, index) => {
            const hasBio = member.bio && member.bio.trim().length > 0;
            const CardComponent = hasBio ? TouchableOpacity : View;
            
            return (
              <CardComponent
                key={index}
                style={[globalStyles.boardCard, styles.card, { width: cardWidth }]}
                activeOpacity={hasBio ? 0.9 : 1}
                onPress={hasBio ? () => onMemberPress?.(member) : undefined}
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
                {hasBio && (
                  <View style={globalStyles.boardArrowContainer}>
                    <ArrowRightIcon size={14} color={colors.white} />
                  </View>
                )}
              </CardComponent>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// Export committee tabs component and styles for use in parent
export const CommitteeTabs: React.FC<{
  activeTab: 'organising' | 'scientific';
  onTabChange: (tab: 'organising' | 'scientific') => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <View style={committeeTabsStyles.committeeTabsContainer}>
      <TouchableOpacity
        style={[
          committeeTabsStyles.committeeTab,
          activeTab === 'organising' && committeeTabsStyles.committeeTabActive,
        ]}
        onPress={() => onTabChange('organising')}
        activeOpacity={0.85}
      >
        <Text
          style={[
            committeeTabsStyles.committeeTabText,
            activeTab === 'organising' && committeeTabsStyles.committeeTabTextActive,
          ]}
        >
          Organising Committee
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          committeeTabsStyles.committeeTab,
          activeTab === 'scientific' && committeeTabsStyles.committeeTabActive,
        ]}
        onPress={() => onTabChange('scientific')}
        activeOpacity={0.85}
      >
        <Text
          style={[
            committeeTabsStyles.committeeTabText,
            activeTab === 'scientific' && committeeTabsStyles.committeeTabTextActive,
          ]}
        >
          Scientific Committee
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const committeeTabsStyles = StyleSheet.create({
  committeeTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  committeeTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  committeeTabActive: {
    backgroundColor: colors.primary,
  },
  committeeTabText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  committeeTabTextActive: {
    color: colors.white,
    
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
  },
  card: {
    backgroundColor: colors.lightYellow,
  },
});



