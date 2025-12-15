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
import { ArrowRightIcon } from '../../components/icons';
import { BoardMemberData } from '../../components/BoardMemberModal';

interface EFIBoardContentProps {
  onMemberPress?: (member: BoardMemberData) => void;
}

const boardMembers: BoardMemberData[] = [
  {
    name: 'Dr. Vimee Bindra Basu',
    role: 'Founder & President',
    image: require('../../assets/images/efiboard/vimee.jpg'),
    accreditations: [
      'SRC Accredited Master Surgeon Multidisciplinary Endometriosis Care (MSMEC).Consultant Gynaecologist, Robotic and Laparoscopic Surgeon, Endometriosis Excision Surgeon.'
    ],
    specialties: [
      'Consultant Gynaecologist, Robotic and Laparoscopic Surgeon, Endometriosis Excision Surgeon'
    ],
    bio:`Dr. Bindra is widely recognized as one of India’s leading Endometriosis surgeons, specializing in minimally invasive gynecological surgeries, particularly advanced excision procedures for Endometriosis, with over 15+ years of experience. Under her leadership, EFI has pioneered national-level initiatives including public awareness campaigns, international congresses, and specialized cadaveric dissection courses designed to train surgeons in advanced pelvic and neuroanatomy relevant to endometriosis surgery. These programs have been instrumental in bridging knowledge gaps, promoting early diagnosis, and advancing multidisciplinary care for women affected by this complex disease.Her contributions have been recognized with several accolades, including the Telangana Woman Leaders Award (2022) and the Young Clinician Award from Apollo Hospitals (2020). She has also authored multiple scientific publications and contributed chapters to leading gynecology textbooks. Dr. Bindra remains committed to advancing women’s healthcare through clinical excellence, surgical innovation, patient advocacy, and medical education.`,
  },
  {
    name: 'Sandesh Kade',
    role: 'Vice President',
    image: require('../../assets/images/efiboard/sandeshkade.jpg'),
    bio: ``,
  },
  {
    name: 'Vivek Salunke',
    role: 'First Treasurer',
    image: require('../../assets/images/efiboard/viveksalunke.png'),
    bio: ``,
  },
  {
    name: 'Yashodhan Deka',
    role: 'Second Treasurer',
    image: require('../../assets/images/efiboard/yashodan.jpg'),
    bio: ``,
  },
  {
    name: 'Sonu Singh',
    role: 'Third Treasurer',
    image: require('../../assets/images/efiboard/sonusingh.jpg'),
    bio: ``,
  },
  {
    name: 'Dr. Archana Reddy',
    role: 'Secretary',
    image: require('../../assets/images/efiboard/archana-reddy.jpg'),
    accreditations: [
      'Laparoscopic Surgeon (Ob-Gyn), Infertility Specialist'
    ],
    bio: ``,
  },

  {
    name: 'Dr. Swetha Reddy',
    role: 'Joint Secretary,',
    image: require('../../assets/images/efiboard/swethareddy.jpg'),
    accreditations: [
      'Consultant Ob-Gyn, Minimally Invasive Surgeon'
    ],
    bio: ``,
  },
];

export const EFIBoardContent: React.FC<EFIBoardContentProps> = ({ onMemberPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - spacing.lg * 3) / 2;

  return (
    <View style={styles.boardContainer}>
      <View style={globalStyles.boardGrid}>
        {boardMembers.map((member, index) => {
          const hasBio = typeof member.bio === 'string' && member.bio.trim().length > 0;

          return (
            <TouchableOpacity
              key={index}
              style={[globalStyles.boardCard, { width: cardWidth }]}
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
                  <View style={globalStyles.boardMemberPlaceholderImage} />
                )}
              </View>
              <Text style={globalStyles.boardMemberName}>{member.name}</Text>
              <Text style={globalStyles.boardMemberRole}>{member.role}</Text>
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
  boardContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
  },
  
});

