import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Header from '../../../../components/Header';
import { SearchIcon, CardRightArrowIcon } from '../../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Delegate {
  id: string;
  name: string;
  affiliation: string;
  image?: any;
}

interface DelegateListProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onDelegatePress?: (delegate: Delegate) => void;
}

// Static mock data for delegates
const mockDelegates: Delegate[] = [
  { id: '1', name: 'Abhinay', affiliation: 'University of New South Wales' },
  { id: '2', name: 'Abhijith', affiliation: 'University of New South Wales' },
   { id: '3', name: 'Abhay', affiliation: 'University of New South Wales' },
   { id: '4', name: 'Bhavya', affiliation: 'University of New South Wales' },
   { id: '5', name: 'Bhanu', affiliation: 'University of New South Wales' },
  { id: '6', name: 'Bhuvanesh', affiliation: 'University of New South Wales' },
  { id: '7', name: 'Chaitanya', affiliation: 'University of New South Wales' },
  { id: '8', name: 'Chandrika', affiliation: 'University of New South Wales' },
  { id: '9', name: 'Chandra', affiliation: 'University of New South Wales' },
  { id: '10', name: 'Chandraprakash', affiliation: 'University of New South Wales' },
];

const DelegateList: React.FC<DelegateListProps> = ({
  onBack,
  onNavigateToHome,
  onDelegatePress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Group delegates alphabetically
  const groupedDelegates = useMemo(() => {
    const filtered = mockDelegates.filter(delegate =>
      delegate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegate.affiliation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped: { [key: string]: Delegate[] } = {};
    filtered.forEach(delegate => {
      const firstLetter = delegate.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(delegate);
    });

    // Sort groups and delegates within each group
    const sortedGroups: { [key: string]: Delegate[] } = {};
    Object.keys(grouped)
      .sort()
      .forEach(letter => {
        sortedGroups[letter] = grouped[letter].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });

    return sortedGroups;
  }, [searchQuery]);

  const handleDelegatePress = (delegate: Delegate) => {
    onDelegatePress?.(delegate);
  };


    // Color array for profile placeholders
    const placeholderColors = [
      '#E8F5E9', // Light Green   
      '#F2E9FF', // Light Purple    
      '#E3F2FD', // Light Blue
      '#FFE8C5', // Light Orange
      '#F3E5F5', // Light Pink
      '#D0FFE5', // Light Green
      '#CCE9FF', // Mid Blue
      '#FFF3E0', // Mid Yellow
      '#E2FFD0', // Mid Green
      '#C7F3FF', // Light Picako blue
    ];
  
    const getPlaceholderColor = (index: number) => {
      return placeholderColors[index % placeholderColors.length];
    };

  return (
    <View style={styles.container}>
      <Header
        title="Delegate List"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <View style={styles.contentContainer}>
        {/* Search Bar */}
        <View style={globalStyles.searchContainer}>
          <View style={globalStyles.searchIconContainer}>
            <SearchIcon size={20} color={colors.gray} />
          </View>
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Delegates List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {Object.keys(groupedDelegates).length === 0 ? (
            <View style={styles.emptyContainer}>        
              <Text style={styles.emptyText}>No delegates found</Text>
            </View>
          ) : (
            Object.keys(groupedDelegates).map(letter => (
              <View key={letter} style={styles.sectionContainer}>
                {/* Section Header */}
                <Text style={globalStyles.contactHeaderLetter}>{letter}</Text>

                {/* Delegates in this section */}
                {groupedDelegates[letter].map((delegate, index) => (
                  <TouchableOpacity
                    key={delegate.id}
                    style={[
                      globalStyles.contactItem,
                      index === groupedDelegates[letter].length - 1 && globalStyles.contactlastItem,
                    ]}
                    onPress={() => handleDelegatePress(delegate)}
                    activeOpacity={0.7}
                  >
                    {/* Profile Picture */}
                    <View style={globalStyles.contactProfileImageContainer}>
                      {delegate.image ? (
                        <Image
                          source={delegate.image}
                          style={globalStyles.contactProfileImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[globalStyles.contactProfilePlaceholder, { backgroundColor: getPlaceholderColor(index) }]}>
                          <Text style={globalStyles.contactProfilePlaceholderText}>
                            {delegate.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Name and Affiliation */}
                    <View style={globalStyles.contactInfo}>
                      <Text style={globalStyles.conatctName}>{delegate.name}</Text>
                      <Text style={globalStyles.conatctAffiliation}>
                        {delegate.affiliation}
                      </Text>
                    </View>

                    {/* Right Arrow */}
                    <CardRightArrowIcon
                      size={16}
                      color={colors.gray}
                      style={globalStyles.conatctArrowIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionContainer: {
    marginTop: spacing.md,
  },
  scrollView: {
    flex: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.gray,
  },
  emptyImage: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    marginBottom: spacing.md,
  },
});

export default DelegateList;

