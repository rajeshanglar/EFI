import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { ArrowRightIcon } from './icons';

interface EfiBoardProps {
  onViewAll?: () => void;
}

export const EfiBoard: React.FC<EfiBoardProps> = ({ onViewAll }) => {
  const boardMembers = [
    { 
      name: 'Dr. Vimee Bindra ', 
      title: 'Founder & President',
      image: require('../assets/images/efiboard/vimee.jpg') 
    },
    { 
      name: 'Sandesh Kade', 
      title: 'Vice President',
      image: require('../assets/images/efiboard/sandeshkade.jpg') 
    },
    { 
      name: 'Vivek Salunke', 
      title: 'First Treasurer',
      image: require('../assets/images/efiboard/viveksalunke.png') 
    },
    { 
      name: 'Yashodhan Deka', 
      title: 'Second Treasurer',
      image: require('../assets/images/efiboard/yashodan.jpg')
    },
   
  ];

  return (
    <View style={styles.boardSectionContainer}>
      <View style={styles.boardSection}>
        <View style={styles.boardHeader}>
          <Text style={styles.boardTitle}>EFI Board</Text>
          <TouchableOpacity onPress={onViewAll}>
            <View style={styles.viewAllContainer}>
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRightIcon size={14} color={colors.primaryLight} style={styles.viewAllIcon} />
            </View>           
          </TouchableOpacity>
        </View>
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boardScroll} contentContainerStyle={styles.boardContent}> */}
         <View style={styles.boardScroll}>
          {boardMembers.map((member, index) => (
            <View key={index} style={styles.boardMemberCard}>
              <View style={styles.boardImageContainer}> 
                <Image 
                  source={member.image} 
                  style={styles.boardImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberTitle}>{member.title}</Text>
            </View>
          ))}
        {/* </ScrollView> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardSectionContainer: {  
    marginTop: spacing.sm,
    marginBottom:0,
    borderRadius: borderRadius.lg,
    width: '100%', 
  },
  boardSection: {
    marginBottom: spacing.lg,
  },
  boardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  boardTitle: {
    color: colors.black,
    fontSize: Dimensions.get('window').width * 0.04,  
    fontWeight: 600,
 
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: Dimensions.get('window').width * 0.034,     
    fontFamily: Fonts.SemiBold,
  },

  viewAllIcon: {
    marginLeft: spacing.xs,
  },
  boardScroll: {
    flexDirection: 'row',
  },
  boardContent: {
    paddingRight: spacing.md,
  },
  boardMemberCard: {
    alignItems: 'center',
    marginRight:Dimensions.get('window').width * 0.020,
    minWidth:Dimensions.get('window').width * 0.15,
  },
 boardImageContainer: {
    marginBottom: spacing.sm,
  },
  boardImage: {
    width:Dimensions.get('window').width * 0.19,
    height:Dimensions.get('window').width * 0.19,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.lightGray,
  },
  memberName: {
    fontSize: Dimensions.get('window').width * 0.028,  
    fontWeight:600, 
  
    color: colors.black,
    textAlign: 'center',
    marginBottom:2,
  },
  memberTitle: {
    fontSize: Dimensions.get('window').width * 0.026,  
    fontWeight: '400',   
    color: colors.black,
    textAlign: 'center',
    marginBottom:2,
  },
});

export default EfiBoard;
