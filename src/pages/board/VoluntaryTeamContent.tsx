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

interface VoluntaryTeamContentProps {
  onMemberPress?: (member: BoardMemberData) => void;
}




interface VoluntaryMember {
  name: string;
  role?: string;
  image?: any;
  place?: string;
  bio?: string;
}

// Placeholder data - replace with actual data when available
const voluntaryMembers: VoluntaryMember[] = [
  // Add voluntary team members here when data is available
  {
    name: 'Pranay Desai', 
    image: null,
    role: 'Voluntary Team Member', 
    place:'Mumbai',  
  },
  {
    name: 'Puja Pathak',   
    image: null,
    role: 'Voluntary Team Member', 
    place:'New Delhi',  
  },
  {
    name: 'Saranya Ravi',   
    image: null,
    role: 'Voluntary Team Member', 
    place:'Chennai',  
  },
  {
    name: 'Vashishtiny Reddy',   
    image: null,
    role: 'Voluntary Team Member', 
    place:'Hyderabad',  
  },
  {
    name: 'Harika Chikkam',   
    image: null,
    role: 'Voluntary Team Member', 
    place:'Hyderabad',  
  },

  {
    name: 'Deepika',   
    image: null,
    role: 'Voluntary Team Member', 
    place:'Bangalore',  
  },
  {
    name: 'Shivanka',   
    image: null,
    role: 'Voluntary Team Member', 
    place:'Hyderabad',  
  },

];

export const VoluntaryTeamContent: React.FC<VoluntaryTeamContentProps> = ({ onMemberPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - spacing.lg * 3) / 2;

  if (voluntaryMembers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No voluntary team members available yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={globalStyles.boardGrid}>
        {voluntaryMembers.map((member, index) => {
          const hasBio = typeof member.bio === 'string' && member.bio.trim().length > 0;
          const memberData: BoardMemberData = {
            name: member.name,
            role: member.role || 'Voluntary Team Member',
            image: member.image,
            country: member.place,
            bio: member.bio,
          };

          return (
            <TouchableOpacity
              key={index}
              style={[globalStyles.boardCard, { width: cardWidth }]}
              activeOpacity={0.9}
              disabled={!hasBio}
              onPress={() => {
                if (hasBio) {
                  onMemberPress?.(memberData);
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
              <Text style={globalStyles.boardMembercountry}>{member.place}</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: Dimensions.get('window').width * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
    textAlign: 'center',
  },
 
});

