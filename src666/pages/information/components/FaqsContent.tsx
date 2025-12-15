import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../../../styles/globalStyles';
import { informationStyles as styles } from '../styles';

type FaqPointSection = {
  heading?: string;
  points: string[];
};

type FaqItem = {
  question: string;
  answer?: string;
  pointsHeading?: string; // legacy support
  pointsTitle?: string; // legacy support
  heading?: string; // legacy support
  points?: string[]; // legacy support
  pointSections?: FaqPointSection[];
};

const faqItems: FaqItem[] = [
  {
    question: 'What is Endometriosis?',
    answer:
      'A chronic, estrogen-dependent condition where tissue similar to the uterine lining grows outside the uterus. It leads to pain, inflammation, scar tissue (adhesions), and in some cases, infertility. Endometriosis is systemic, inflammatory, and often progressive if left untreated.',
  },
  {
    question: 'How common is Endometriosis?',
    pointSections: [
      {
        points: [
          'Global: Affects over 190–247 million women and AFAB individuals (approx. 10% of reproductive-age population).',
          'India: Estimated 42–43 million women live with Endometriosis, many undiagnosed.',
        ],
      },
    ],
  },
  {
    question: 'What are the core symptoms?',
    pointSections: [
      {
        heading: 'Common Symptoms',
        points: [
          'Severe period pain (dysmenorrhea, not relieved by OTC meds)',
          'Chronic pelvic pain (may occur outside periods too)',
          'Painful sex (dyspareunia), Painful urination or bowel movements (especially during periods)',
          'Infertility',
          'Fatigue',
          'Abdominal bloating (“endo belly”)',
          'Heavy or irregular periods',
          'Back pain, leg pain, or nerve pain',
          'Nausea, constipation, diarrhea, or other digestive issues',
        ],
      },
      {
        heading: 'Additional Symptoms',
        points: [
          'Shoulder or chest pain → if lesions are on the diaphragm or thoracic area (can worsen around periods).',
          'Pain while standing or walking → sometimes from deep pelvic lesions or nerve involvement.',
          'Sciatica-like symptoms → if endo affects pelvic nerves.',
          'Pain during ovulation → due to active ovarian or pelvic lesions.',
          'Blood in urine or stool (cyclical, around periods) → when bladder or bowel is involved.',
          'Pain radiating to thighs, hips, or buttocks → from adhesions or nerve involvement.',
          'Painful pelvic exams → tenderness or nodularity on exam.',
          'Irregular spotting or bleeding between cycles.',
          'Allergic-type symptoms or immune dysfunction (some women report higher rates of allergies, migraines, autoimmune symptoms).',
        ],
      },
      {
        heading: 'Less Common but Reported',
        points: [
          'Shortness of breath or cough with blood → rare, linked to thoracic endo.',
          'Painful abdominal scars → if endometriosis grows in surgical scars (like C-section scars).',
          'Chronic low mood, anxiety, sleep disturbance → often secondary to chronic pain and fatigue.',
        ],
      },
    ],
  },
  {
    question: 'What causes Endometriosis?',
    pointSections: [
      {
        heading: 'The exact cause is unknown. Possible factors include',
        points: [
          'Retrograde menstruation',
          'Genetic predisposition',
          'Immune dysfunction',
          'Hormonal imbalances',
          'Environmental toxins',         
        ],
      },
     
    ],
    },
    {
      question: 'How long does it usually take to diagnose?',
      answer:
        'On average, 7–10 years from onset of symptoms — due to misdiagnosis, normalizing of period pain, and lack of trained specialists.',
    },
    {
      question: 'Can Endometriosis affect teenagers?',
      answer:
        'Yes. This is called Juvenile Endometriosis. Many teens with painful periods are misdiagnosed or ignored, delaying care.',
    },
    {
      question: 'At what age does Endometriosis occur?',
      pointSections: [
        {
          points: [
            'Can start at menarche (as early as age 10–12)',
            'Common in women aged 20–40 years',
            'Can persist or recur after menopause, especially if severe or untreated',                   
          ],
        },       
      ],
    },
    {
      question: 'How is Endometriosis diagnosed?',
      pointSections: [
        {
          points: [
            'Clinical history & pelvic exam',
            'Imaging: TVS (transvaginal ultrasound), MRI (may miss small or deep lesions)',
            'Laparoscopy with biopsy: Gold standard for confirmation',                   
          ],
        },       
      ],
    },
    {
      question: 'Where can Endometriosis occur in the body?',
      pointSections: [
        {
          points: [
            'Pelvic organs: ovaries, uterus, tubes, bowel, bladder',
            'Abdominal wall and surgical scars',
            'Diaphragm, chest cavity, lungs (thoracic endometriosis)',                   
          ],
        },       
      ],
    },
    {
      question: 'What are the types/classifications of Endometriosis?',
      pointSections: [
        {
          heading: 'Based on location',
          points: [
            'Superficial peritoneal',
            'Ovarian endometrioma (“chocolate cysts”)',
            'Deep infiltrating Endometriosis (DIE)', 
            'Extragenital/Extrapelvic: bladder, bowel, diaphragm, thorax',   
            'Scar Endometriosis: following C-section or surgery',                       
          ],
        },  
        {
          heading: 'Based on stage (ASRM classification):',
          points: [
            'Stage I (Minimal)',
            'Stage II (Mild)',
            'Stage III (Moderate)', 
            'Stage IV (Severe), Note: Stage does not always reflect symptom severity.',
          ],
        },         
      ],
    },

    {
      question: 'What complications can Endometriosis cause?',
      pointSections: [
        {
          points: [
            'Chronic pain',
           ' Infertility/subfertility',
            'Ovarian cysts',
            'Bowel or urinary tract obstruction',
            'Adhesions and organ sticking',
            'Nerve entrapment',
            'Mental health issues (anxiety, depression)',
                  
          ],
        },       
      ],
    },

    {
      question: 'How does Endometriosis affect fertility?',
      pointSections: [
        {
          points: [
           ' Can distort reproductive organs',
           ' Interfere with ovulation or implantation ',
           ' Damage egg quality or ovarian reserve',
           ' Cause inflammation in the uterus (Up to 50% of infertile women have Endometriosis).',            
          ],
        },       
      ],
    },

    {
      question: 'What are the treatment options?',
      pointSections: [
        {
          heading: 'Medical Management',
          points: [
            'NSAIDs for pain relief',
            'Hormonal therapy: contraceptives, progestins, GnRH analogues These manage symptoms, not the root cause.',
          ],
        },  
        {
          heading: 'Surgical Management',
          points: [
            'Excision surgery (preferred): removes the lesion from the root',
            'Ablation/cauterization: burns the surface — less effective, higher recurrence',
          ],
        },   
        {
          heading: 'Supportive Care',
          points: [
            'Pelvic physiotherapy',
            'Nutrition/dietary support',      
            'Mental health therapy',
            'Fertility counseling',
            'Pain management team',            
          ],
        },     
      ],
    },
    {
      question: 'What is the best treatment option?',
      answer:
        'Excision surgery by an expert is the gold standard. It addresses all types of lesions and offers better long-term outcomes compared to ablation or hormone suppression alone.',
    },
    {
      question: 'Can Endometriosis come back?',
      pointSections: [
        {
          heading: 'Yes. Recurrence rates vary',
          points: [
            '40–50% within 5 years post-surgery (higher with incomplete excision)',
            'Lifelong management may be required in severe cases',
          ],
        },        
      ],
    },
    {
      question: 'What is Adenomyosis, and how is it different?',
      pointSections: [
        {        
          points: [
            'Endometriosis: tissue grows outside the uterus',
            'Adenomyosis: tissue grows within the muscular wall of the uterus Both cause heavy bleeding and pain; adenomyosis often co-exists with Endometriosis.',
          ],
        },        
      ],
    },
    {
      question: 'Is Endometriosis hereditary?',
      answer: 'Yes. First-degree relatives have 6–7 times higher risk. Genetics plays a major role in susceptibility.',        
    },
    {
      question: 'Can Endometriosis be detected on scans?',
      pointSections: [
        {        
          points: [
            'Ovarian cysts may be seen via ultrasound',
            'Deep lesions need high-resolution ultrasound/MRI',
          ],
        },        
      ],
      answer: 'But imaging often misses small or hidden lesions — laparoscopy is definitive.',        
    },
    {
      question: 'Can Endometriosis affect your mental health?',
      answer:'Absolutely. Chronic pain, social isolation, fertility challenges, and being misunderstood lead to:',
      pointSections: [
        {        
          points: [
            'Depression',
            'Anxiety',
            'PTSD', 
            'Body image issues',
            ' Psychological support is essential.',
          ],
        },        
      ],
    },
    {
      question: 'What lifestyle changes help manage Endometriosis?',
      pointSections: [
        {        
          points: [
            'Anti-inflammatory diet',
            'Regular, gentle exercise',  
            'Stress management (yoga, mindfulness)',
            'Pelvic floor physiotherapy',
            'Avoiding toxins (plastics, processed foods)',            
          ],
        },        
      ],
      answer: ' These support symptom management, but do not replace excision surgery.',
    },
    {
      question: 'Can men or transgender individuals get Endometriosis?',
      pointSections: [
        {        
          points: [
            'Rare in cisgender men',
            'Transgender men and non-binary people with a uterus and ovaries can have Endometriosis',
          ],
        },        
      ],   
    },
    {
      question: 'What is the economic impact of Endometriosis?',
      pointSections: [
        {        
          points: [
            'Global cost exceeds over 80 billion dollars annually in lost productivity and healthcare',
            'Women often face job losses, education disruptions, and high out-of-pocket medical costs',
          ],
        },        
      ],   
      answer: 'Advocacy for insurance and workplace rights is critical. Many insurance companies classify endometriosis primarily as a fertility issue rather than a chronic, systemic disease, which leads to denial of coverage for excision surgery. This overlooks that endometriosis can cause severe pain, organ damage, and loss of quality of life independent of infertility. As a result, patients often face high out-of-pocket costs for medically necessary treatment. Advocacy for workplace rights is essential because endometriosis can cause chronic pain, fatigue, and unpredictable flare-ups that make traditional work structures challenging. Supportive policies like flexible schedules, medical leave, and awareness programs help employees manage their health while remaining productive.',
    },
    {
      question: 'Can Endometriosis be prevented?',
      answer: 'There’s no known way to prevent it — but early recognition and expert treatment can stop disease progression and complications.',
    },
    {
      question: 'What is EFI’s role in fighting Endometriosis?',
      pointSections: [
        {    
          heading: 'EFI leads India’s mission in:',
          points: [
            'Raising awareness',
            'Training surgeons (EFI-SCOPE)', 
            'Hosting public campaigns (Yellow Ribbon Run)',
            'Advocating for policy change',
            'Supporting patients with accurate information and resources',            
          ],
        },        
      ],   
      answer: 'EFI is a global non-profit organization that raises awareness and funds for Endometriosis research and treatment. EFI supports research, advocacy, and patient support programs.',
    },
    {
      question: 'When should someone see a specialist?',
      pointSections: [
        { 
          points: [
            'If period pain affects daily life',
            'If OTC painkillers stop working',
            'If you have difficulty getting pregnant',
            'If you experience pain during sex, urination, or bowel movements',                      
          ],
        },        
      ],   
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
              {isExpanded &&
                (() => {
                  const answerText = item.answer?.trim() ?? '';
                  const hasAnswer = answerText.length > 0;

                  const normalizedSections: FaqPointSection[] = (() => {
                    if (Array.isArray(item.pointSections)) {
                      return item.pointSections
                        .map(section => ({
                          heading: section.heading?.trim(),
                          points: Array.isArray(section.points)
                            ? section.points
                                .filter(point => typeof point === 'string')
                                .map(point => point.trim())
                                .filter(point => point.length > 0)
                            : [],
                        }))
                        .filter(section => section.points.length > 0);
                    }

                    if (Array.isArray(item.points)) {
                      const filteredPoints = item.points
                        .filter(point => typeof point === 'string')
                        .map(point => point.trim())
                        .filter(point => point.length > 0);

                      if (filteredPoints.length > 0) {
                        const heading =
                          item.pointsHeading?.trim() ||
                          item.pointsTitle?.trim() ||
                          item.heading?.trim();

                        return [
                          {
                            heading,
                            points: filteredPoints,
                          },
                        ];
                      }
                    }

                    return [];
                  })();

                  const hasPointSections = normalizedSections.length > 0;

                  if (!hasAnswer && !hasPointSections) {
                    return null;
                  }

                  return (
                    <View style={styles.faqAnswerContainer}>
                      {hasAnswer ? (
                        <Text style={styles.faqAnswer}>{answerText}</Text>
                      ) : null}
                      {hasPointSections
                        ? normalizedSections.map((section, sectionIndex) => (
                            <View
                              key={`faq-section-${sectionIndex}`}
                              style={styles.faqPointsList}
                            >
                              {section.heading ? (
                                <Text style={styles.faqPointsHeading}>{section.heading}</Text>
                              ) : null}
                              {section.points.map((point, pointIndex) => (
                                <View
                                  key={`faq-point-${sectionIndex}-${pointIndex}`}
                                  style={styles.faqPointItem}
                                >
                                  <View style={styles.bulletDot} />
                                  <Text style={styles.faqPointText}>{point}</Text>
                                </View>
                              ))}
                            </View>
                          ))
                        : null}
                    </View>
                  );
                })()}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default FaqsContent;


