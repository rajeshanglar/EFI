import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../../styles/globalStyles';
import { informationStyles as styles } from '../styles';

const papers = [
  {
    title: 'Comprehensive Review of Excision Outcomes in Stage IV Endometriosis',
    description:
      'A multi-centre analysis exploring long-term symptom relief, fertility improvements, and complication rates following complete excision surgery.',
  },
  {
    title: 'Hormonal Therapies and Their Role in Endometriosis Management',
    description:
      'Evaluates current evidence for GnRH analogues, progestins, and emerging hormonal options in managing recurrent pain and disease progression.',
  },
  {
    title: 'Impact of Endometriosis on Mental Health and Quality of Life',
    description:
      'Highlights the psychological burden of delayed diagnosis and underscores integrated care models that address both physical and emotional wellbeing.',
  },
];

const PublishedPapersContent: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={globalStyles.headingH1}>Published Papers</Text>
      <Text style={globalStyles.paragraphP}>
        
      </Text>

      {/* <View style={styles.paperList}>
        {papers.map(paper => (
          <View key={paper.title} style={styles.paperCard}>
            <Text style={styles.paperTitle}>{paper.title}</Text>
            <Text style={styles.paperDescription}>{paper.description}</Text>
          </View>
        ))}
      </View> */}
    </View>
  );
};

export default PublishedPapersContent;


