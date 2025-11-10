import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../../../styles/globalStyles';
import { informationStyles as styles } from '../styles';

const faqItems = [
  {
    question: 'What is Endometriosis?',
    answer:
      'A chronic, estrogen-dependent condition where tissue similar to the uterine lining grows outside the uterus. It leads to pain, inflammation, scar tissue (adhesions), and in some cases, infertility. Endometriosis is systemic, inflammatory, and often progressive if left untreated.\n\n- Global: Affects over 190–247 million women and AFAB individuals (approx. 10% of reproductive-age population).',
  },
  {
    question: 'How common is Endometriosis?',
    answer:
      'Endometriosis impacts roughly one in ten people assigned female at birth during their reproductive years worldwide. Many remain undiagnosed for years due to delayed recognition of symptoms.',
  },
  {
    question: 'What are the core symptoms?',
    answer:
      'Common symptoms include debilitating period pain, chronic pelvic pain, pain during or after intercourse, heavy or irregular periods, fatigue, bloating, digestive issues, and fertility challenges.',
  },
  {
    question: 'Can Endometriosis be cured?',
    answer:
      'There is currently no known cure. However, with the right combination of excision surgery, medical management, lifestyle support, and ongoing care, symptoms can be significantly reduced and quality of life improved.',
  },
];

const FaqsContent: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <View style={styles.section}>
      <Text style={globalStyles.headingH1}>FAQ on Endometriosis</Text>
      <Text style={globalStyles.paragraphP}>
        Learn everything you need to know, from symptoms to surgery.
      </Text>

      <View style={styles.faqContainer}>
        {faqItems.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <View
              key={item.question}
              style={[styles.faqCard, isExpanded && styles.faqCardActive]}
            >
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => handleToggle(index)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.faqQuestion,
                    isExpanded && styles.faqQuestionActive,
                  ]}
                >
                  {`${index + 1}. ${item.question}`}
                </Text>
                <Text style={styles.faqToggle}>{isExpanded ? '–' : '+'}</Text>
              </TouchableOpacity>
              {isExpanded && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default FaqsContent;


