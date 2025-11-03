import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../../../styles/globalStyles';
import { CardRightArrowIcon } from '../../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

interface DocumentItem {
  id: string;
  title: string;
  thumbnail?: ImageSourcePropType;
}

interface DocumentsContentProps {
  documents?: DocumentItem[];
  onDocumentPress?: (documentId: string) => void;
}

export const DocumentsContent: React.FC<DocumentsContentProps> = ({
  documents = [],
  onDocumentPress,
}) => {
  // Default documents data
  const defaultDocuments: DocumentItem[] = [
    {
      id: '1',
      thumbnail: require('../../../assets/images/pdfscreen.jpg'),
      title: 'Characterizing the Genetic and Biological Structure',
    },
      {
        id: '2',
        thumbnail: require('../../../assets/images/pdfscreen.jpg'),
        title: 'Advanced Endometriosis Research Methods',
      },
      {
        id: '3',
        thumbnail: require('../../../assets/images/pdfscreen.jpg'),
        title: 'Clinical Guidelines for Endometriosis Treatment',
      },
      {
        id: '4',
        thumbnail: require('../../../assets/images/pdfscreen.jpg'),
        title: 'Understanding Endometriosis Pathology',
      },
      {
        id: '5',
        thumbnail: require('../../../assets/images/pdfscreen.jpg'),
        title: 'Understanding Endometriosis Pathology',
      },
      {
        id: '6',
        thumbnail: require('../../../assets/images/pdfscreen.jpg'),
        title: 'Understanding Endometriosis Pathology',
      },
      {
        id: '7',
        thumbnail: require('../../../assets/images/pdfscreen.jpg'),
        title: 'Understanding Endometriosis Pathology',
      },
      {
        id: '8',
        thumbnail: require('../../../assets/images/pdfscreen.jpg'),
        title: 'Understanding Endometriosis Pathology',
      },
  ];

  const documentList = documents.length > 0 ? documents : defaultDocuments;

  const handleDocumentPress = (documentId: string) => {
    onDocumentPress?.(documentId);
    console.log('Document pressed:', documentId);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Documents Grid */}
      <View style={styles.documentGrid}>
        {documentList.map((document) => (
          <TouchableOpacity
            key={document.id}
            style={styles.documentCard}
            activeOpacity={0.85}
            onPress={() => handleDocumentPress(document.id)}
          >
            <Image
              source={document.thumbnail || require('../../../assets/images/pdfscreen.jpg')}
              style={styles.documentImage}
            />
            <View style={styles.documentFooter}>
              <Text style={styles.documentTitle} numberOfLines={2}>
                {document.title}
              </Text>
              <CardRightArrowIcon size={14} color={colors.black} style={styles.documentArrowIcon} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  titleContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  documentsTitle: {
    fontSize: screenWidth * 0.06,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  documentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  documentCard: {
    width: (screenWidth - spacing.md * 3) / 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  documentImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  documentFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  documentTitle: {
    flex: 1,
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginRight: spacing.xs,
  },
  documentArrowIcon: {
    marginTop: Dimensions.get('window').height * 0.005,
  },
});

