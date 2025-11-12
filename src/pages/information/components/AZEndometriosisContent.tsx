import React from 'react';
import { View, Text } from 'react-native';
import globalStyles, { spacing } from '../../../styles/globalStyles';
import { informationStyles as styles } from '../styles';

// const atoZEndometriosisData = [
//   {
//     letter: 'A',
//     entries: [
//       {
//         title: 'Adhesions',
//         description:
//           'Bands of scar tissue that can form due to endometriosis or surgeries. They may bind organs together abnormally, leading to pain and organ dysfunction.',
//         points: [
//           'May tether pelvic organs, causing sharp or pulling pain during movement.',
//           'Can obstruct the bowels or bladder when severe.',
//           'Often require careful surgical excision for lasting relief.',
//         ],
//       },
//       {
//         title: 'Ablation',
//         description:
//           'A surgical technique that destroys endometriosis tissue on the surface of organs, often using heat, laser, or electrical energy.',
//         points: [
//           'Targets superficial lesions rather than deeply infiltrating disease.',
//           'May offer short-term relief but carries a higher recurrence risk than excision.',
//           'Commonly performed via laparoscopy in outpatient settings.',
//         ],
//       },
//       {
//         title: 'Adenomyosis',
//         description:
//           'A condition where tissue similar to the uterine lining grows into the muscle wall of the uterus, leading to pain and heavy periods.',
//         points: [
//           'Frequently co-exists with endometriosis in reproductive-age women.',
//           'Causes enlarged, tender uterus and severe menstrual cramps.',
//           'Managed with hormonal therapy, uterine-sparing procedures, or hysterectomy in advanced cases.',
//         ],
//       },
//     ],
//   },
//   {
//     letter: 'B',
//     entries: [
//       {
//         title: 'Bloating ("Endo Belly")',
//         description:
//           'A common symptom where the abdomen becomes visibly swollen due to inflammation, often cyclic and painful.',
//         points: [
//           'Typically worsens around menstruation or ovulation.',
//           'Linked to inflammation, fluid retention, and gut dysbiosis.',
//           'Improved through anti-inflammatory diet, pelvic floor therapy, and coordinated medical care.',
//         ],
//       },
//       {
//         title: 'Brain Fog',
//         description:
//           'Difficulty concentrating, remembering, or thinking clearly, often linked to chronic pain, fatigue, or hormonal changes.',
//         points: [
//           'Can be triggered by chronic inflammation and sleep disruption.',
//           'Impacts work productivity, mood, and daily decision making.',
//           'Addressed through pain management, restorative sleep, and cognitive coping strategies.',
//         ],
//       },
//     ],
//   },
//   {
//     letter: 'C',
//     entries: [
//       {
//         title: 'Chronic Pelvic Pain',
//         description:
//           'Persistent pain in the lower abdomen or pelvis lasting six months or more, commonly associated with endometriosis.',
//         points: [
//           'May be sharp, stabbing, or dull and radiate to the back or legs.',
//           'Often worsens during menstruation, intercourse, or bowel movements.',
//           'Requires multidisciplinary management including excision surgery, physiotherapy, and pain specialists.',
//         ],
//       },
//       {
//         title: 'Cysts',
//         description:
//           'Fluid-filled sacs. In endometriosis, ovarian cysts known as endometriomas may form and are often filled with old blood.',
//         points: [
//           'Also called “chocolate cysts” due to their dark fluid content.',
//           'Can compromise ovarian reserve if large or recurrent.',
//           'Best treated with fertility-sparing surgical excision by an experienced surgeon.',
//         ],
//       },
//     ],
//   },
// ];

const atoZEndometriosisData = [
  {
    letter: "A",
    items: [
      {
        title: "Adhesions",
        description:
          "Bands of scar tissue that can form due to endometriosis or surgeries. They may bind organs together abnormally, leading to pain and organ dysfunction."
      },
      {
        title: "Ablation",
        description:
          "A surgical technique that destroys endometriosis tissue on the surface of organs, often using heat, laser, or electrical energy."
      },
      {
        title: "Adenomyosis",
        description:
          "A condition where tissue similar to the uterine lining grows into the muscle wall of the uterus, leading to pain and heavy periods"
      }
    ]
  },
  {
    letter: "B",
    items: [
      {
        title: "Bloating (Endo Belly)",
        description:
          "A common symptom where the abdomen becomes visibly swollen due to inflammation, often cyclic and painful."
      },
      {
        title: "Brain Fog",
        description:
          "Difficulty concentrating, remembering, or thinking clearly, often linked to chronic pain, fatigue, or hormonal changes."
      }
    ]
  },
  {
    letter: "C",
    items: [
      {
        title: "Chronic Pelvic Pain",
        description:
          "One of the hallmark symptoms. Pain that persists for 6 months or more, often worsening during menstruation, ovulation, or sexual activity."
      }
    ]
  },
  {
    letter: "D",
    items: [
      {
        title: "Diagnosis Delay",
        description:
          "Endometriosis takes an average of 7–10 years to be diagnosed due to dismissal of symptoms and lack of awareness, even among medical professionals."
      },
      {
        title: "Deep Infiltrating Endometriosis",
        description:
          "A severe form of endometriosis where lesions grow more than 5 mm deep into pelvic tissues or organs."
      },
      {
        title: "Dyspareunia",
        description:
          "Persistent or recurrent pain during or after sexual intercourse."
      }
    ]
  },
  {
    letter: "E",
    items: [
      {
        title: "Excision Surgery",
        description:
          "The gold standard for treating Endometriosis. It involves precisely removing the lesions from affected areas rather than just burning (ablation) them."
      },
      {
        title: "Extragenital / Extrapelvic Endometriosis",
        description:
          "Endometriosis lesions that develop outside the reproductive organs, such as on the bladder, bowel, diaphragm, or in the thoracic cavity."
      }
    ]
  },
  {
    letter: "F",
    items: [
      {
        title: "Fertility Challenges",
        description:
          "Endometriosis is a leading cause of infertility. It may interfere with egg release, tube function, or uterine receptivity. Early excision can improve outcomes."
      },
      {
        title: "Fibroids",
        description:
          "Noncancerous growths in the uterus that can cause heavy bleeding, pelvic pressure, or pain"
      }
    ]
  },
  {
    letter: "G",
    items: [
      {
        title: "GnRH Agonists",
        description:
          "Medications that lower estrogen levels by switching off ovarian hormone production, used to temporarily control endometriosis symptoms."
      },
      {
        title: "GI Symptoms",
        description:
          "Many patients experience gastrointestinal issues like constipation, diarrhea, IBS-like symptoms, nausea, especially during their cycle."
      }
    ]
  },
  {
    letter: "H",
    items: [
      {
        title: "Hysterectomy",
        description:
          "A surgery to remove the uterus, sometimes performed to manage severe gynecological conditions."
      },
      {
        title: "Hormonal Treatments",
        description:
          "Drugs like oral contraceptives, GnRH agonists, and progestins are used to suppress periods but do not treat or remove the disease."
      }
    ]
  },
  {
    letter: "I",
    items: [
      {
        title: "Invisible Illness",
        description:
          "Despite causing severe pain and fatigue, Endometriosis often lacks visible signs or imaging proof — leading to misunderstanding and stigma."
      }
    ]
  },
  {
    letter: "J",
    items: [
      {
        title: "Juvenile Endometriosis",
        description:
          "Endometriosis can begin in adolescence or even childhood. Severe period pain in teens should not be dismissed as “normal.”"
      }
    ]
  },
  {
    letter: "K",
    items: [
      {
        title: "Kisspeptin",
        description:
          "Kisspeptin is a peptide involved in reproductive hormone regulation. Studies suggest Kisspeptin dysregulation may contribute to hormonal imbalance and infertility in Endometriosis patients. It’s an emerging biomarker under study for early detection and reproductive dysfunction."
      },
      {
        title: "Krukenberg's Area / Krukenberg Tumor Association",
        description:
          "A type of ovarian tumor that can mimic or coexist with Endometriosis, making accurate histopathological assessment crucial."
      },
      {
        title: "Kallikrein-Kinin System",
        description:
          "This system regulates inflammation and nociception in Endometriotic lesions.Recent studies show altered Kallikrein–Kinin activity in Endometriosis, contributing to chronic inflammation and pain sensitization."
      }
    ]
  },
  {
    letter: "L",
    items: [
      {
        title: "Laparoscopy",
        description:
          "A minimally invasive surgical procedure used to diagnose and treat Endometriosis. Only excision laparoscopy is considered effective for long-term relief."
      },
      {
        title: "Lesions",
        description:
          "Abnormal patches of endometriosis tissue that grow outside the uterus, often causing pain or inflammation."
      }
    ]
  },
  {
    letter: "M",
    items: [
      {
        title: "Multidisciplinary Care",
        description:
          "Best results come from a team approach — gynecologists, surgeons, pain specialists, physiotherapists, dietitians, and mental health experts. Endometriosis is a systemic, estrogen-dependent disease in which ectopic endometrial-like tissue can infiltrate pelvic organs, the bowel, bladder, diaphragm, and even extra-pelvic sites. Because of its multi-organ involvement and complex symptom profile, optimal management often requires a multidisciplinary team."
      }
    ]
  },
  {
    letter: "N",
    items: [
      {
        title: "Nerve Involvement",
        description:
          "Endometriotic lesions can infiltrate or irritate nerves, leading to pain that’s sharp, radiating, or persistent — even if lesions are small or hidden."
      }
    ]
  },
  {
    letter: "O",
    items: [
      {
        title: "Ovarian Endometrioma",
        description:
          "Also called “chocolate cysts,” A fluid-filled ovarian cyst formed by endometriosis tissue, containing old, dark blood that gives it a chocolate-like appearance."
      },
      {
        title: "Oophorectomy",
        description:
          "A surgery to remove one or both ovaries, often done to reduce hormone production or treat disease on the ovaries."
      }
    ]
  },
  {
    letter: "P",
    items: [
      {
        title: "Painful Periods (Dysmenorrhea)",
        description:
          "While some period discomfort is common, pain that interferes with daily activities is not normal and must be investigated."
      },
      {
        title: "Pelvic Floor Dysfunction",
        description:
          "Difficulty relaxing or coordinating the pelvic floor muscles, often causing pain, pressure, or urinary and bowel problems."
      },
      {
        title: "Progestins",
        description:
          "Synthetic hormones similar to progesterone that help thin the uterine lining and reduce endometriosis growth and pain."
      }
    ]
  },
  {
    letter: "Q",
    items: [
      {
        title: "Quadrant Pain",
        description:
          "Endometriosis-related pain can be localized to different abdominal quadrants, depending on lesion sites — right or left lower quadrant pain often mimics appendicitis or ovarian pathology."
      },
      {
        title: "Quadratus Lumborum Involvement",
        description:
          "The quadratus lumborum (QL) is a deep, paired muscle in the lower back that connects the pelvis to the last rib and lumbar vertebrae. Rarely, deep infiltrating Endometriosis may involve the Quadratus Lumborum muscle, causing flank or back pain often mistaken for musculoskeletal issues."
      }
    ]
  },
  {
    letter: "R",
    items: [
      {
        title: "Rectovaginal Endometriosis",
        description:
          "A severe form where lesions grow between the rectum and vagina, often causing pain during bowel movements or intercourse."
      }
    ]
  },
  {
    letter: "S",
    items: [
      {
        title: "Superficial Endometriosis",
        description:
          "Endometriosis lesions that are located on the surface of pelvic organs or tissues, without deep invasion"
      },
      {
        title: "Scar Endometriosis",
        description:
          "Endometriosis tissue that implants and grows within surgical scars, commonly after procedures like a C-section."
      },
      {
        title: "Stages of Endometriosis",
        description:
          "There are four stages (I–IV) based on location, size, and depth of lesions. But stage doesn’t always correlate with pain or severity of symptoms."
      }
    ]
  },
  {
    letter: "T",
    items: [
      {
        title: "Thoracic Endometriosis",
        description:
          "Rare but serious — Endometriosis can reach the diaphragm, lungs, or chest cavity, causing shoulder pain or cyclic breathing issues."
      }
    ]
  },
  {
    letter: "U",
    items: [
      {
        title: "Ultrasound & Imaging",
        description:
          "Transvaginal ultrasound and MRI can help detect certain lesions but may miss deep or microscopic ones. A normal scan does not rule out Endometriosis."
      }
    ]
  },
  {
    letter: "V",
    items: [
      {
        title: "Vasculogenesis",
        description:
          "Vasculogenesis is the formation of new blood vessels from endothelial precursor cells. In Endometriosis, abnormal vasculogenesis supports lesion survival and growth by supplying oxygen and nutrients."
      }
    ]
  },
  {
    letter: "W",
    items: [
      {
        title: "Wnt Signaling Pathway",
        description:
          "The Wnt signaling pathway regulates cell growth, differentiation, and tissue regeneration.In Endometriosis, this pathway is abnormally activated, leading to:",
        points: [
                      'Excessive cell proliferation',
                      'Fibrosis',
                      'Angiogenesis (formation of new blood vessels)',
                      'Resistance to apoptosis (cell death)',
                    ],
        }
    ]
  },
  {
    letter: "X",
    items: [
      {
        title: "Xenograft Models",
        description:
          'A xenograft model is a type of experimental setup where human tissue or cells are implanted into another species (commonly mice) to study disease behavior. In Endometriosis research, xenograft models are used to:',
          points: [
                      'Observe lesion implantation, angiogenesis, and hormonal response',
                      'Test new drug therapies and surgical outcomes',
                      'Understand mechanisms of pain and inflammation',
                    ],
      },
      {
        title: "Xenoestrogens",
        description:
          "Xenoestrogens are environmental chemicals that mimic estrogen. They’re found in plastics (like BPA), pesticides, cosmetics, and industrial waste. Since Endometriosis is an estrogen-dependent disorder, exposure to xenoestrogens may worsen Endometriosis progression."
      }
    ]
  },
  {
    letter: "Y",
    items: [
      {
        title: "YAP1 Pathway",
        description:
          " The YAP1 (Yes-associated protein 1) pathway is part of the Hippo signaling system, which controls organ size and cell proliferation. In Endometriosis, YAP1 is found to be overexpressed, leading to:",
          points: [
            'Increased cell survival',
            'Fibrosis',
            'Hormone resistance (particularly to progesterone)',
          ],
        },
      {
        title: "Yolk Sac-Derived Stem Cells",
        description:
          " Endometriosis may partly originate from extrauterine stem cells derived from the yolk sac, one of the body’s earliest stem cell sources during development. These progenitor cells can migrate and later transform into endometrial-like cells at ectopic sites. This theory helps explain why Endometriosis can appear even in women without a uterus (like post-hysterectomy or rare male cases)."
      }
    ]
  },
  {
    letter: "Z",
    items: [
      {
        title: "Zero-Cure Yet",
        description:
          "There’s no cure yet — but effective management through excision surgery, holistic care, and lifestyle changes can help patients live full lives."
      },
      {
        title: "Zymography",
        description:
          " Zymography is a laboratory technique used to measure enzyme activity,  particularly Matrix Metalloproteinases (MMPs). In Endometriosis, MMPs break down extracellular matrix tissue, allowing lesions to invade new sites."
      }
    ]
  }
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

      <View style={styles.azList}>
        {atoZEndometriosisData.map(section => (
          <View key={section.letter} style={styles.azCard}>
            <View style={styles.letterBadge}>
              <Text style={styles.letterText}>{section.letter}</Text>
            </View>
            <View style={styles.azEntries}>
              {section.items.map(item => (
                <View key={item.title} style={styles.entryBlock}>
                  <Text style={styles.entryTitle}>{item.title}</Text>
                  <Text style={styles.entryDescription}>
                    {item.description}
                  </Text>
                    {item.points && (
                    <View style={styles.entryPoints}>
                      {item.points.map(point => (
                        <View
                          key={point}
                          style={globalStyles.bulletRowLight}
                        >
                          <View style={styles.bulletDot} />
                          <Text style={styles.bulletText}>{point}</Text>
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


