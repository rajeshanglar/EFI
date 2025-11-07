import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { WhiteCloseIcon } from '../components/icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface BoardMemberData {
  name: string;
  role: string;
  image?: any;
  country?: string;
  countryCode?: string;
  accreditations?: string[];
  specialties?: string[];
  bio?: string;
}

interface BoardMemberModalProps {
  visible: boolean;
  member: BoardMemberData | null;
  onClose: () => void;
}

export const BoardMemberModal: React.FC<BoardMemberModalProps> = ({
  visible,
  member,
  onClose,
}) => {
  if (!member) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header Section - Dark Blue */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerName}>{member.name}</Text>
              <Text style={styles.headerRole}>{member.role}</Text>
              {member.accreditations && member.accreditations.length > 0 && (
                <Text style={styles.accreditation}>
                  {member.accreditations.join('. ')}
                </Text>
              )}
              {member.specialties && member.specialties.length > 0 && (
                <Text style={styles.specialties}>
                  {member.specialties.join(', ')}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <View style={styles.closeButtonCircle}>
                <WhiteCloseIcon size={16} color={colors.white} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Body Section - White */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={true}
          >
            {member.bio ? (
              <Text style={styles.bioText}>{member.bio}</Text>
            ) : (
              <Text style={styles.bioText}>No biography available.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal:0,
  },
  modalContainer: {
    width: screenWidth * 1,
    maxHeight: screenHeight * 0.95,
    height: screenHeight * 0.9,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    paddingRight:11,
    paddingLeft:7,
    paddingTop:5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderRadius: borderRadius.sm,
    position: 'relative',
  },
  headerContent: {
    paddingRight: spacing.xl,
  },
  headerName: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.primaryLight,
    marginBottom:0,
  },
  headerRole: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  accreditation: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.white,
    marginBottom: spacing.xs,
    lineHeight: screenWidth * 0.045,
  },
  specialties: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.white,
    marginBottom: spacing.xs,
    lineHeight: screenWidth * 0.045,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    backgroundColor: colors.white,
    maxHeight: screenHeight * 0.67,
    minHeight: 200,
   
  },
  bodyContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
    
  },
  bioText: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: screenWidth * 0.067,
    textAlign: 'left',

  },
});

