import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../../components/Header';
import { SearchIcon, CardRightArrowIcon } from '../../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../../styles/globalStyles';
import { GetSpeakers } from '../../../../services/staticService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Speaker {
  id: string;
  name: string;
  affiliation: string;
  image?: string | null;
  profile_image?: string | null;
}

interface KeynoteSpeakersProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onSpeakerPress?: (speaker: Speaker) => void;
}

const KeynoteSpeakers: React.FC<KeynoteSpeakersProps> = ({
  onBack,
  onNavigateToHome,
  onSpeakerPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch speakers from API
  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    try {
      setLoading(true);
      const payload = { page: 1, per_page: 100 };
      console.log('GetSpeakers - Payload:', JSON.stringify(payload, null, 2));
      const res = await GetSpeakers(1, 100);
      console.log('GetSpeakers - Response:', JSON.stringify(res, null, 2));
      
      if (res?.success && res?.data?.speakers) {
        // Map API response to component format
        const mappedSpeakers: Speaker[] = res.data.speakers
          .filter((speaker: any) => speaker && (speaker.full_name || speaker.first_name || speaker.last_name))
          .map((speaker: any) => ({
            id: String(speaker.speaker_id),
            name: speaker.full_name || `${speaker.first_name || ''} ${speaker.last_name || ''}`.trim() || 'Unknown',
            affiliation: speaker.specialization || speaker.qualification || speaker.bio || '',
            profile_image: speaker.profile_image,
          }));
        console.log('GetSpeakers - Mapped Speakers:', JSON.stringify(mappedSpeakers, null, 2));
        setSpeakers(mappedSpeakers);
      } else {
        console.log('GetSpeakers - No speakers in response or response not successful');
        setSpeakers([]);
      }
    } catch (e: any) {
      console.error('GetSpeakers - Error:', e?.response?.data || e?.message);
      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  // Group speakers alphabetically
  const groupedSpeakers = useMemo(() => {
    const filtered = speakers.filter(speaker =>
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.affiliation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped: { [key: string]: Speaker[] } = {};
    filtered.forEach(speaker => {
      const firstLetter = speaker.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(speaker);
    });

    // Sort groups and speakers within each group
    const sortedGroups: { [key: string]: Speaker[] } = {};
    Object.keys(grouped)
      .sort()
      .forEach(letter => {
        sortedGroups[letter] = grouped[letter].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });

    return sortedGroups;
  }, [speakers, searchQuery]);

  const handleSpeakerPress = (speaker: Speaker) => {
    onSpeakerPress?.(speaker);
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
        title="Keynote Speakers"
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

        {/* Speakers List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.emptyText}>Loading speakers...</Text>
            </View>
          ) : Object.keys(groupedSpeakers).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No speakers found</Text>
            </View>
          ) : (
            (() => {
              let globalIndex = 0;
              return Object.keys(groupedSpeakers).map(letter => (
                <View key={letter} style={styles.sectionContainer}>
                  {/* Section Header */}
                  <Text style={globalStyles.contactHeaderLetter}>{letter}</Text>

                  {/* Speakers in this section */}
                  {groupedSpeakers[letter].map((speaker, index) => {
                    const currentIndex = globalIndex++;
                    return (
                    <TouchableOpacity
                      key={speaker.id}
                      style={[
                        globalStyles.contactItem,
                        index === groupedSpeakers[letter].length - 1 && globalStyles.contactlastItem,
                      ]}
                      onPress={() => handleSpeakerPress(speaker)}
                      activeOpacity={0.7}
                    >
                      {/* Profile Picture */}
                      <View style={globalStyles.contactProfileImageContainer}>
                        {(speaker.profile_image || speaker.image) ? (
                          <Image
                            source={{ uri: (speaker.profile_image || speaker.image) as string }}
                            style={globalStyles.contactProfileImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={[globalStyles.contactProfilePlaceholder, { backgroundColor: getPlaceholderColor(currentIndex) }]}>
                            <Text style={globalStyles.contactProfilePlaceholderText}>
                              {speaker.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </View>

                    {/* Name and Affiliation */}
                    <View style={globalStyles.contactInfo}>
                      <Text style={globalStyles.conatctName} numberOfLines={1} ellipsizeMode="tail">{speaker.name}</Text>
                      <Text style={globalStyles.conatctAffiliation} numberOfLines={2} ellipsizeMode="tail">
                        {speaker.affiliation}
                      </Text>
                    </View>

                    {/* Right Arrow */}
                    <CardRightArrowIcon
                      size={16}
                      color={colors.gray}
                      style={globalStyles.conatctArrowIcon}
                    />
                  </TouchableOpacity>
                    );
                  })}
                </View>
              ));
            })()
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
 
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: spacing.md,
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
});

export default KeynoteSpeakers;

