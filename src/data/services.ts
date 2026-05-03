import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Hand,
  Home,
  Scissors,
  Search,
  Target,
  Waves,
  Zap,
} from "lucide-react";

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type PhysiotherapyService = {
  slug: string;
  aliases?: string[];
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  highlight?: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroTitle: string;
  intro: string;
  bestFor: string[];
  included: string[];
  outcomes: string[];
  process: ServiceProcessStep[];
  sessionInfo: string;
  faqs: ServiceFaq[];
};

export const physiotherapyServices: PhysiotherapyService[] = [
  {
    slug: "musculoskeletal-assessment",
    icon: Search,
    title: "Comprehensive Musculoskeletal Assessment and Diagnosis",
    description:
      "Thorough evaluation to identify the root cause of pain, stiffness, weakness, and movement problems.",
    image: "/images/fx5.jpg",
    metaTitle:
      "Musculoskeletal Assessment in Whittlesey and Peterborough",
    metaDescription:
      "Book a comprehensive musculoskeletal physiotherapy assessment in Whittlesey. Clear diagnosis, movement testing, pain assessment, and a tailored recovery plan.",
    keywords: [
      "musculoskeletal assessment Whittlesey",
      "physiotherapy diagnosis Peterborough",
      "pain assessment physiotherapy",
      "movement assessment",
    ],
    heroTitle: "Find the cause of pain before starting treatment",
    intro:
      "A detailed musculoskeletal assessment gives your care a clear starting point. We look at your symptoms, movement, strength, posture, lifestyle, medical history, and daily demands so your treatment plan is based on the real source of the problem, not guesswork.",
    bestFor: [
      "Back, neck, shoulder, hip, knee, or ankle pain",
      "Reduced mobility or stiffness that is affecting daily life",
      "Recurring pain that has not settled with rest",
      "Sports injuries, work-related strain, or postural overload",
      "Anyone who wants a clear treatment plan before committing to care",
    ],
    included: [
      "Detailed discussion of symptoms, medical history, and goals",
      "Posture, joint, muscle, nerve, and movement screening",
      "Functional tests linked to your work, sport, or daily routine",
      "Clear explanation of likely causes and contributing factors",
      "A practical recovery plan with treatment recommendations",
      "Advice on activity modification, self-management, and next steps",
    ],
    outcomes: [
      "A clearer understanding of what is driving your symptoms",
      "A tailored plan for treatment, exercise, and recovery",
      "Confidence about what to do, what to avoid, and when to progress",
    ],
    process: [
      {
        title: "Listen and understand",
        description:
          "Your physiotherapist takes time to understand your symptoms, goals, work demands, activity level, and any medical factors that may affect recovery.",
      },
      {
        title: "Assess movement and function",
        description:
          "We test mobility, strength, joint behaviour, soft tissue sensitivity, balance, and functional movement patterns relevant to your condition.",
      },
      {
        title: "Explain and plan",
        description:
          "You leave with a clear explanation, a realistic recovery pathway, and practical actions you can start using straight away.",
      },
    ],
    sessionInfo:
      "Initial assessments usually last 60 to 90 minutes depending on complexity and clinical need.",
    faqs: [
      {
        question: "Do I need a referral for an assessment?",
        answer:
          "No. You can book directly. If your symptoms suggest you need medical review, imaging, or specialist input, your physiotherapist will explain the next step clearly.",
      },
      {
        question: "Will I receive treatment during the first appointment?",
        answer:
          "Where appropriate, treatment and advice can begin during the first session. The assessment still comes first so treatment is targeted and safe.",
      },
      {
        question: "Can an assessment help if I have had pain for months?",
        answer:
          "Yes. Persistent pain often has several contributing factors. A structured assessment helps identify what can be changed and how to progress steadily.",
      },
    ],
  },
  {
    slug: "manual-therapy",
    icon: Hand,
    title: "Manual Therapy",
    description:
      "Hands-on physiotherapy techniques to improve joint mobility, reduce pain, and support better movement.",
    image: "/images/fx13.jpg",
    metaTitle: "Manual Therapy Physiotherapy in Whittlesey",
    metaDescription:
      "Manual therapy in Whittlesey for joint stiffness, muscle tightness, back pain, neck pain, and movement restrictions. Hands-on physiotherapy care.",
    keywords: [
      "manual therapy Whittlesey",
      "hands-on physiotherapy",
      "joint mobilisation",
      "soft tissue therapy",
    ],
    heroTitle: "Hands-on treatment for pain, stiffness, and restricted movement",
    intro:
      "Manual therapy uses skilled hands-on techniques to help joints, muscles, and soft tissues move more comfortably. At Easeway Medicare, manual therapy is combined with assessment, exercise, and education so improvements are carried into everyday life.",
    bestFor: [
      "Back pain, neck pain, and spinal stiffness",
      "Shoulder, hip, knee, ankle, or wrist restrictions",
      "Muscle tightness, trigger points, and soft tissue sensitivity",
      "Movement limitation after injury or a period of inactivity",
      "People who need treatment alongside a structured exercise plan",
    ],
    included: [
      "Joint mobilisation and gentle manipulation where appropriate",
      "Soft tissue massage, myofascial release, and trigger point work",
      "Muscle energy techniques and assisted stretching",
      "Movement re-education to reduce repeated strain",
      "Home exercises to maintain the benefit of treatment",
      "Advice on posture, activity load, and symptom management",
    ],
    outcomes: [
      "Improved movement comfort and joint mobility",
      "Reduced muscle tension and protective guarding",
      "A clearer route from short-term relief to lasting function",
    ],
    process: [
      {
        title: "Assess before treating",
        description:
          "Manual therapy is selected only after your physiotherapist has assessed the relevant joints, muscles, and movement patterns.",
      },
      {
        title: "Apply targeted techniques",
        description:
          "Treatment is adapted to your comfort level, symptoms, and recovery stage rather than using a one-size-fits-all approach.",
      },
      {
        title: "Re-test and reinforce",
        description:
          "Movement is reassessed after treatment and reinforced with exercises or advice so progress is easier to maintain.",
      },
    ],
    sessionInfo:
      "Manual therapy is commonly provided within 45 to 60 minute physiotherapy treatment sessions.",
    faqs: [
      {
        question: "Is manual therapy painful?",
        answer:
          "Treatment should be tolerable and controlled. Some areas may feel tender, but your physiotherapist will adjust pressure and technique throughout the session.",
      },
      {
        question: "Will manual therapy fix the problem on its own?",
        answer:
          "It can reduce pain and improve movement, but lasting results usually come from combining hands-on care with strengthening, mobility work, and activity changes.",
      },
      {
        question: "Is manual therapy suitable for everyone?",
        answer:
          "Not always. Your physiotherapist checks your history and symptoms first and will choose another approach if manual therapy is not appropriate.",
      },
    ],
  },
  {
    slug: "electrotherapy",
    icon: Zap,
    title: "Electrotherapy",
    description:
      "Evidence-informed electrotherapy options to support pain relief, muscle activation, and tissue recovery.",
    image: "/images/fx10.jpg",
    metaTitle: "Electrotherapy Physiotherapy in Whittlesey",
    metaDescription:
      "Electrotherapy physiotherapy in Whittlesey for pain relief, muscle stimulation, tissue healing, and rehabilitation support alongside hands-on care.",
    keywords: [
      "electrotherapy Whittlesey",
      "TENS therapy",
      "ultrasound therapy physiotherapy",
      "muscle stimulation",
    ],
    heroTitle: "Technology-supported treatment for pain and recovery",
    intro:
      "Electrotherapy can be used as part of a wider physiotherapy plan to reduce pain, encourage muscle activation, and support tissue recovery. It is most effective when chosen for the right condition and combined with movement, strengthening, and practical advice.",
    bestFor: [
      "Pain that limits exercise or daily function",
      "Muscle weakness after injury, surgery, or reduced activity",
      "Soft tissue injuries where supportive treatment is appropriate",
      "Swelling, irritation, or sensitivity during early recovery",
      "Patients who need help tolerating movement-based rehabilitation",
    ],
    included: [
      "TENS or interferential therapy for pain modulation",
      "Ultrasound therapy where clinically appropriate",
      "Electrical muscle stimulation for activation and control",
      "Careful dosage based on your symptoms and treatment goals",
      "Integration with manual therapy and rehabilitation exercises",
      "Clear guidance on what electrotherapy can and cannot do",
    ],
    outcomes: [
      "Improved comfort during early rehabilitation",
      "Better tolerance of movement and exercise progression",
      "Support for muscle activation and functional recovery",
    ],
    process: [
      {
        title: "Choose the right modality",
        description:
          "Your physiotherapist matches the electrotherapy option to your symptoms, diagnosis, stage of healing, and safety considerations.",
      },
      {
        title: "Treat with clear dosage",
        description:
          "Intensity, placement, and treatment time are adjusted carefully so the session supports your wider plan.",
      },
      {
        title: "Progress into movement",
        description:
          "Electrotherapy is followed by exercises or movement work where possible, helping your body use the pain relief or activation gained in session.",
      },
    ],
    sessionInfo:
      "Electrotherapy is usually delivered as part of a 45 to 60 minute physiotherapy appointment.",
    faqs: [
      {
        question: "Is electrotherapy safe?",
        answer:
          "It is safe for many people when properly screened, but it is not suitable for every condition or medical history. Your physiotherapist will check this before treatment.",
      },
      {
        question: "Does electrotherapy replace exercise?",
        answer:
          "No. It supports recovery, but exercise and movement retraining are usually needed to restore strength, confidence, and function.",
      },
      {
        question: "Will I feel the treatment?",
        answer:
          "Most electrotherapy feels like a gentle tingling, pulsing, or muscle contraction. Settings are adjusted to your comfort and clinical goal.",
      },
    ],
  },
  {
    slug: "post-surgical-rehabilitation",
    icon: Building2,
    title: "Post-surgical Rehabilitation",
    description:
      "Structured rehabilitation to rebuild movement, strength, confidence, and daily function after surgery.",
    image: "/images/fx16.jpg",
    metaTitle: "Post-surgical Rehabilitation in Whittlesey",
    metaDescription:
      "Post-surgical physiotherapy rehabilitation in Whittlesey for strength, mobility, scar tissue, balance, and safe return to daily activity after surgery.",
    keywords: [
      "post surgical rehabilitation Whittlesey",
      "post op physiotherapy",
      "rehabilitation after surgery",
      "Peterborough physiotherapy",
    ],
    heroTitle: "A structured path back to strength after surgery",
    intro:
      "Recovery after surgery needs the right balance of protection, movement, strengthening, and confidence building. Post-surgical rehabilitation gives you a phased plan that respects your operation, your surgeon's guidance, and your personal goals.",
    bestFor: [
      "Joint replacement, ligament repair, tendon repair, or fracture surgery",
      "Reduced strength, balance, or mobility after an operation",
      "Scar tightness, stiffness, swelling, or guarded movement",
      "Patients who want support returning to work, sport, or daily activity",
      "Anyone who needs a safe plan between hospital discharge and full recovery",
    ],
    included: [
      "Post-operative movement and strength assessment",
      "Progressive mobility, flexibility, and strengthening exercises",
      "Scar tissue and soft tissue management where appropriate",
      "Balance, walking, and functional retraining",
      "Return-to-work, return-to-sport, or daily activity planning",
      "Communication around surgical precautions and recovery milestones",
    ],
    outcomes: [
      "More confidence moving after surgery",
      "Improved strength, mobility, and day-to-day function",
      "A phased plan that helps reduce setbacks from doing too much too soon",
    ],
    process: [
      {
        title: "Review the operation and precautions",
        description:
          "Your physiotherapist considers your procedure, surgeon guidance, pain levels, swelling, wound status, and current ability.",
      },
      {
        title: "Build the foundation",
        description:
          "Early sessions focus on safe movement, swelling control, mobility, and restoring basic function without overloading healing tissue.",
      },
      {
        title: "Progress strength and confidence",
        description:
          "Your plan advances through strengthening, balance, conditioning, and task-specific work as your body is ready.",
      },
    ],
    sessionInfo:
      "Rehabilitation plans commonly run for 6 to 12 weeks, with timing adapted to the surgery and your progress.",
    faqs: [
      {
        question: "When should I start physiotherapy after surgery?",
        answer:
          "This depends on the surgery and your surgeon's instructions. Many people benefit from early guidance, but the plan must respect surgical precautions.",
      },
      {
        question: "Can you help with scar tightness?",
        answer:
          "Yes, once the wound is ready and it is clinically appropriate, scar tissue mobility and surrounding movement can be addressed as part of rehabilitation.",
      },
      {
        question: "Do I need to bring hospital paperwork?",
        answer:
          "Bring any operation notes, discharge advice, imaging reports, or surgeon instructions you have. They help shape a safer, more precise plan.",
      },
    ],
  },
  {
    slug: "kinesotaping",
    aliases: ["kinetic-pain", "kinesiology-taping", "kinesio-taping"],
    icon: Scissors,
    title: "Kinesotaping",
    description:
      "Therapeutic taping to support muscles and joints, improve awareness, and reduce strain during movement.",
    image: "/images/fx7.jpg",
    metaTitle: "Kinesotaping Physiotherapy in Whittlesey",
    metaDescription:
      "Kinesotaping in Whittlesey for muscle support, joint stability, swelling management, posture, sports support, and physiotherapy pain management.",
    keywords: [
      "kinesotaping Whittlesey",
      "kinesiology taping",
      "sports taping physiotherapy",
      "pain support taping",
    ],
    heroTitle: "Flexible support that moves with your body",
    intro:
      "Kinesotaping uses elastic therapeutic tape to support movement without rigidly restricting it. It can help improve body awareness, reduce load on irritated tissues, and support muscles or joints between physiotherapy sessions.",
    bestFor: [
      "Muscle strain, joint irritation, or recurring sports niggles",
      "Postural support during work, training, or daily activity",
      "Swelling management when lymphatic taping is appropriate",
      "People who need light support without heavy bracing",
      "Athletes or active clients who want support during movement",
    ],
    included: [
      "Assessment of the movement pattern or area needing support",
      "Muscle support and activation taping",
      "Joint stability taping without full restriction",
      "Lymphatic taping for swelling support where appropriate",
      "Postural and movement awareness taping",
      "Advice on tape care, wear time, and safe removal",
    ],
    outcomes: [
      "Better support during daily activity or sport",
      "Improved awareness of posture and movement habits",
      "A useful bridge between clinic treatment and home rehabilitation",
    ],
    process: [
      {
        title: "Assess the goal",
        description:
          "Your physiotherapist identifies whether the tape is needed for support, awareness, swelling, posture, or activity tolerance.",
      },
      {
        title: "Apply the tape precisely",
        description:
          "Tape direction, stretch, and placement are selected for your body and your movement demands.",
      },
      {
        title: "Test movement",
        description:
          "You move after application so the tape can be adjusted and you understand how it should feel during activity.",
      },
    ],
    sessionInfo:
      "Tape application usually takes 15 to 20 minutes and is often included within a physiotherapy session.",
    faqs: [
      {
        question: "How long does kinesotape stay on?",
        answer:
          "It commonly lasts 3 to 5 days depending on skin type, activity level, and how well the area was prepared.",
      },
      {
        question: "Can I exercise with the tape on?",
        answer:
          "Often yes, if it has been applied for that purpose. Your physiotherapist will explain any limits based on your condition.",
      },
      {
        question: "Is kinesotaping the same as bracing?",
        answer:
          "No. Kinesotape is flexible and mainly supports movement and awareness. A brace provides more rigid external support.",
      },
    ],
  },
  {
    slug: "sports-massage",
    icon: Waves,
    title: "Sports Massage",
    description:
      "Targeted soft tissue therapy for athletes, gym users, and active people who want better recovery and movement.",
    image: "/images/fx17.jpg",
    metaTitle: "Sports Massage in Whittlesey and Peterborough",
    metaDescription:
      "Sports massage in Whittlesey for muscle tightness, recovery, training support, mobility, injury prevention, and active lifestyles.",
    keywords: [
      "sports massage Whittlesey",
      "sports massage Peterborough",
      "deep tissue massage",
      "muscle recovery massage",
    ],
    heroTitle: "Focused sports massage for training, recovery, and performance",
    intro:
      "Sports massage is designed for active bodies. Whether you train regularly, compete, work in a physically demanding role, or simply carry persistent muscle tightness, treatment is tailored to the tissues and movement patterns that matter most to you.",
    bestFor: [
      "Muscle tightness after training, sport, or physical work",
      "Pre-event preparation or post-event recovery",
      "Active people managing recurring stiffness or overload",
      "Reduced flexibility affecting movement quality",
      "Clients combining massage with injury prevention or rehabilitation",
    ],
    included: [
      "Targeted soft tissue massage based on your activity demands",
      "Deep tissue techniques where appropriate",
      "Myofascial release and trigger point therapy",
      "Assisted stretching and mobility work",
      "Pre-event or post-event treatment focus",
      "Practical recovery advice for training and daily activity",
    ],
    outcomes: [
      "Reduced muscle tightness and improved comfort",
      "Better recovery between training or activity sessions",
      "Improved mobility to support performance and everyday movement",
    ],
    process: [
      {
        title: "Clarify the goal",
        description:
          "Your session starts by identifying whether the priority is recovery, preparation, maintenance, or a specific area of tension.",
      },
      {
        title: "Treat the key areas",
        description:
          "Pressure, pace, and technique are adapted to your sport, activity level, sensitivity, and treatment objective.",
      },
      {
        title: "Support the next step",
        description:
          "You receive simple guidance on mobility, recovery, hydration, and load management after the session.",
      },
    ],
    sessionInfo:
      "Sports massage sessions can be 45, 60, or 90 minutes depending on the treatment area and goals.",
    faqs: [
      {
        question: "Do I need to be an athlete to book sports massage?",
        answer:
          "No. Sports massage is useful for many active people, including gym users, runners, manual workers, and people with persistent muscle tightness.",
      },
      {
        question: "Can sports massage help with injury prevention?",
        answer:
          "It can support recovery, mobility, and tissue comfort, which may reduce overload risk when combined with sensible training and strengthening.",
      },
      {
        question: "Should I book before or after an event?",
        answer:
          "Both can be useful. Pre-event work is usually lighter and more activating, while post-event work focuses on recovery and comfort.",
      },
    ],
  },
  {
    slug: "virtual-physiotherapy",
    icon: Target,
    title: "Virtual Physiotherapy",
    description:
      "Secure online physiotherapy consultations, guided movement assessment, and personalised home exercise support.",
    image: "/images/fx22.jpg",
    metaTitle: "Virtual Physiotherapy Consultations UK",
    metaDescription:
      "Virtual physiotherapy appointments for assessment, exercise guidance, pain advice, rehabilitation support, and follow-up care from home.",
    keywords: [
      "virtual physiotherapy UK",
      "online physiotherapy consultation",
      "remote physiotherapy",
      "home exercise programme",
    ],
    heroTitle: "Physiotherapy guidance wherever you are",
    intro:
      "Virtual physiotherapy gives you access to professional assessment, advice, exercise coaching, and progress reviews without travelling to clinic. It is ideal when you need clear guidance, a home programme, or follow-up support from a convenient setting.",
    bestFor: [
      "Pain or injury advice when travel is difficult",
      "Home exercise prescription and technique correction",
      "Progress reviews between in-person appointments",
      "Busy schedules, remote locations, or mobility limitations",
      "Education and self-management for ongoing conditions",
    ],
    included: [
      "Secure video consultation with guided movement assessment",
      "Real-time exercise demonstration and correction",
      "Personalised home exercise planning",
      "Advice on pain management, pacing, and activity modification",
      "Progress review and programme adjustment",
      "Clear next steps if hands-on treatment or medical review is needed",
    ],
    outcomes: [
      "Convenient access to expert physiotherapy advice",
      "A structured exercise plan you can follow at home",
      "Ongoing support without unnecessary travel",
    ],
    process: [
      {
        title: "Prepare your space",
        description:
          "Before the appointment, you will be advised on space, clothing, and any simple equipment that may help the assessment.",
      },
      {
        title: "Assess by video",
        description:
          "Your physiotherapist guides you through relevant movements, symptom checks, and functional tasks to understand the problem.",
      },
      {
        title: "Coach your programme",
        description:
          "You are taught exercises, self-management strategies, and progressions that fit your home environment.",
      },
    ],
    sessionInfo:
      "Virtual sessions usually last 30 to 60 minutes depending on your needs.",
    faqs: [
      {
        question: "Can physiotherapy work online?",
        answer:
          "Many conditions can be assessed and supported effectively online, especially when the priority is advice, exercise, education, and progress review.",
      },
      {
        question: "What if I need hands-on treatment?",
        answer:
          "Your physiotherapist will explain whether an in-person appointment would be more appropriate and help you choose the best next step.",
      },
      {
        question: "Do I need equipment at home?",
        answer:
          "Usually not. Many programmes use bodyweight, household items, or simple resistance bands if you already have them.",
      },
    ],
  },
  {
    slug: "home-physiotherapy",
    icon: Home,
    title: "Home Physiotherapy",
    description:
      "Professional physiotherapy care delivered in your home for comfort, convenience, and mobility support.",
    highlight: true,
    image: "/images/fx20.jpg",
    metaTitle: "Home Physiotherapy in Whittlesey",
    metaDescription:
      "Home physiotherapy visits in Whittlesey for mobility problems, post-surgical rehabilitation, pain management, falls confidence, and in-home recovery.",
    keywords: [
      "home physiotherapy Whittlesey",
      "physiotherapy home visit",
      "mobile physiotherapist Peterborough",
      "in home rehabilitation",
    ],
    heroTitle: "Physiotherapy care brought to your home",
    intro:
      "Home physiotherapy is designed for people who prefer treatment in their own environment or find travel difficult. Your physiotherapist brings professional assessment, treatment, rehabilitation, and practical advice directly to your home.",
    bestFor: [
      "Mobility limitations, transport difficulties, or reduced confidence leaving home",
      "Post-surgical recovery where home-based function matters",
      "Older adults who need strength, balance, or falls confidence support",
      "Pain or injury that makes clinic travel uncomfortable",
      "Families who want guidance in the environment where daily tasks happen",
    ],
    included: [
      "Full assessment in your own home environment",
      "Treatment and exercise planning with portable equipment where needed",
      "Walking, stairs, transfers, and daily task practice",
      "Home safety observations and practical movement advice",
      "Family or carer education where appropriate",
      "Clear progression plan between visits",
    ],
    outcomes: [
      "Improved confidence moving around your own home",
      "More practical rehabilitation linked to real daily tasks",
      "Reduced stress from travel while maintaining professional care",
    ],
    process: [
      {
        title: "Assess your environment",
        description:
          "The appointment considers your symptoms, mobility, home layout, daily tasks, and any equipment or support already in place.",
      },
      {
        title: "Treat and practise function",
        description:
          "Treatment is paired with practical movement work such as walking, stairs, transfers, or task-specific strengthening.",
      },
      {
        title: "Plan confident progress",
        description:
          "You receive realistic exercises and advice that can be repeated safely between visits.",
      },
    ],
    sessionInfo:
      "Home visits usually last 60 to 90 minutes, including setup, assessment, treatment, and exercise planning.",
    faqs: [
      {
        question: "What areas do home visits cover?",
        answer:
          "Home physiotherapy is focused on Whittlesey and nearby areas. Please contact the clinic to confirm availability for your address.",
      },
      {
        question: "Do I need special equipment at home?",
        answer:
          "No. Your physiotherapist can bring relevant portable equipment and will also adapt exercises to your home setup.",
      },
      {
        question: "Can family members be present?",
        answer:
          "Yes, if you are comfortable with that. Family or carer involvement can be helpful for confidence, safety, and exercise support.",
      },
    ],
  },
  {
    slug: "acupuncture",
    icon: Target,
    title: "Acupuncture",
    description:
      "Acupuncture and dry needling approaches integrated with physiotherapy to support pain relief and recovery.",
    image: "/images/fx21.jpg",
    metaTitle: "Acupuncture Physiotherapy in Whittlesey",
    metaDescription:
      "Acupuncture in Whittlesey integrated with physiotherapy for pain relief, muscle tension, trigger points, recovery support, and holistic care.",
    keywords: [
      "acupuncture Whittlesey",
      "physiotherapy acupuncture",
      "dry needling Whittlesey",
      "pain relief acupuncture",
    ],
    heroTitle: "Acupuncture integrated with modern physiotherapy",
    intro:
      "Acupuncture can support pain relief, muscle relaxation, and recovery when used as part of a wider physiotherapy plan. Treatment is selected carefully after assessment and may be combined with manual therapy, exercise, education, and other rehabilitation strategies.",
    bestFor: [
      "Muscle tension, trigger points, and persistent tightness",
      "Pain that limits movement or daily activity",
      "Headache, neck, back, or limb symptoms where acupuncture is appropriate",
      "Clients who want a combined physiotherapy and acupuncture approach",
      "People seeking support alongside exercise-based rehabilitation",
    ],
    included: [
      "Assessment to decide whether acupuncture is suitable",
      "Fine needle acupuncture for pain modulation and recovery support",
      "Dry needling for selected muscle trigger points where appropriate",
      "Optional integration with electroacupuncture when clinically useful",
      "Treatment alongside physiotherapy exercise and advice",
      "Clear explanation of benefits, risks, and aftercare",
    ],
    outcomes: [
      "Reduced pain sensitivity for some conditions",
      "Improved comfort during movement and rehabilitation",
      "A broader treatment plan that supports both symptoms and function",
    ],
    process: [
      {
        title: "Screen and assess",
        description:
          "Your physiotherapist checks your symptoms, medical history, preferences, and any reasons acupuncture may not be suitable.",
      },
      {
        title: "Treat carefully",
        description:
          "Fine needles are placed with a gentle technique and monitored throughout so the session remains comfortable and controlled.",
      },
      {
        title: "Integrate with rehabilitation",
        description:
          "Acupuncture is linked to your wider plan through movement, exercise, and self-management advice.",
      },
    ],
    sessionInfo:
      "Acupuncture sessions usually last 45 to 60 minutes including consultation and aftercare advice.",
    faqs: [
      {
        question: "Is acupuncture suitable for everyone?",
        answer:
          "No. Your physiotherapist will screen your medical history, medication, skin health, and preferences before recommending acupuncture.",
      },
      {
        question: "Does acupuncture hurt?",
        answer:
          "Most people feel a small prick, tingling, heaviness, or dull ache. The technique is adjusted to keep treatment comfortable.",
      },
      {
        question: "How many sessions will I need?",
        answer:
          "This varies by condition, response, and wider rehabilitation goals. Your physiotherapist will review progress and adjust the plan as needed.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return physiotherapyServices.find(
    (service) => service.slug === slug || service.aliases?.includes(slug)
  );
}

export function getAllServiceSlugs() {
  return physiotherapyServices.flatMap((service) => [
    service.slug,
    ...(service.aliases ?? []),
  ]);
}

export function getRelatedServices(slug: string, limit = 3) {
  const current = getServiceBySlug(slug);
  return physiotherapyServices
    .filter((service) => service.slug !== current?.slug)
    .slice(0, limit);
}
