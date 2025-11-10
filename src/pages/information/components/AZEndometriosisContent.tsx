import React from 'react';
import { View, Text } from 'react-native';
import globalStyles, { spacing } from '../../../styles/globalStyles';
import { informationStyles as styles } from '../styles';

const glossaryData = [
  {
    letter: 'A',
    entries: [
      {
        title: 'Adhesions',
        description:
          'Bands of scar tissue that can form due to endometriosis or surgeries. They may bind organs together abnormally, leading to pain and organ dysfunction.',
        points: [
          'May tether pelvic organs, causing sharp or pulling pain during movement.',
          'Can obstruct the bowels or bladder when severe.',
          'Often require careful surgical excision for lasting relief.',
        ],
      },
      {
        title: 'Ablation',
        description:
          'A surgical technique that destroys endometriosis tissue on the surface of organs, often using heat, laser, or electrical energy.',
        points: [
          'Targets superficial lesions rather than deeply infiltrating disease.',
          'May offer short-term relief but carries a higher recurrence risk than excision.',
          'Commonly performed via laparoscopy in outpatient settings.',
        ],
      },
      {
        title: 'Adenomyosis',
        description:
          'A condition where tissue similar to the uterine lining grows into the muscle wall of the uterus, leading to pain and heavy periods.',
        points: [
          'Frequently co-exists with endometriosis in reproductive-age women.',
          'Causes enlarged, tender uterus and severe menstrual cramps.',
          'Managed with hormonal therapy, uterine-sparing procedures, or hysterectomy in advanced cases.',
        ],
      },
    ],
  },
  {
    letter: 'B',
    entries: [
      {
        title: 'Bloating ("Endo Belly")',
        description:
          'A common symptom where the abdomen becomes visibly swollen due to inflammation, often cyclic and painful.',
        points: [
          'Typically worsens around menstruation or ovulation.',
          'Linked to inflammation, fluid retention, and gut dysbiosis.',
          'Improved through anti-inflammatory diet, pelvic floor therapy, and coordinated medical care.',
        ],
      },
      {
        title: 'Brain Fog',
        description:
          'Difficulty concentrating, remembering, or thinking clearly, often linked to chronic pain, fatigue, or hormonal changes.',
        points: [
          'Can be triggered by chronic inflammation and sleep disruption.',
          'Impacts work productivity, mood, and daily decision making.',
          'Addressed through pain management, restorative sleep, and cognitive coping strategies.',
        ],
      },
    ],
  },
  {
    letter: 'C',
    entries: [
      {
        title: 'Chronic Pelvic Pain',
        description:
          'Persistent pain in the lower abdomen or pelvis lasting six months or more, commonly associated with endometriosis.',
        points: [
          'May be sharp, stabbing, or dull and radiate to the back or legs.',
          'Often worsens during menstruation, intercourse, or bowel movements.',
          'Requires multidisciplinary management including excision surgery, physiotherapy, and pain specialists.',
        ],
      },
      {
        title: 'Cysts',
        description:
          'Fluid-filled sacs. In endometriosis, ovarian cysts known as endometriomas may form and are often filled with old blood.',
        points: [
          'Also called “chocolate cysts” due to their dark fluid content.',
          'Can compromise ovarian reserve if large or recurrent.',
          'Best treated with fertility-sparing surgical excision by an experienced surgeon.',
        ],
      },
    ],
  },
];

// const highlightPoints = [
//   'Recognize symptoms early to reduce diagnostic delays.',
//   'Track cycle patterns to identify pain triggers and flare-ups.',
//   'Seek multidisciplinary care combining medical and lifestyle support.',
// ];

const AZEndometriosisContent: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={globalStyles.headingH1}>A–Z of Endometriosis</Text>
      <Text style={globalStyles.paragraphP}>
        Complete glossary of terms, symptoms, treatments, and key concepts
        related to Endometriosis.
      </Text>

      {/* <View style={styles.highlightCard}>
        <Text style={styles.highlightTitle}>Key Highlights</Text>
        <View style={{ gap: spacing.sm }}>
          {highlightPoints.map(point => (
            <View key={point} style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDot} />
              <Text style={globalStyles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>
      </View> */}

      <View style={styles.glossaryList}>
        {glossaryData.map(section => (
          <View key={section.letter} style={styles.glossaryCard}>
            <View style={styles.letterBadge}>
              <Text style={styles.letterText}>{section.letter}</Text>
            </View>
            <View style={styles.glossaryEntries}>
              {section.entries.map(entry => (
                <View key={entry.title} style={styles.entryBlock}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryDescription}>
                    {entry.description}
                  </Text>
                  {entry.points && (
                    <View style={styles.entryPoints}>
                      {entry.points.map(point => (
                        <View
                          key={point}
                          style={globalStyles.bulletRowLight}
                        >
                          <View style={globalStyles.bulletDot} />
                          <Text style={globalStyles.bulletText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AZEndometriosisContent;


