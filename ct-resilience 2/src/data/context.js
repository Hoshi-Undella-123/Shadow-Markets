/**
 * Real Connecticut demographic and capacity context data
 * Sources: IRIS, American Immigration Council, Migration Policy Institute,
 *          CT DataHaven, IRIS Immigration Facts page, CT state data
 */

export const CT_CONTEXT = {
  totalPopulation:       3_626_000,   // 2024 estimate
  foreignBornTotal:      584_000,     // ~15.9% of population (USAFacts 2024)
  foreignBornPct:        15.9,
  undocumentedEstimate:  120_000,     // AIC 2016 estimate; likely 130-140K+ in 2024
  undocumentedOfWorkforce: 0.05,      // 5% of CT workforce
  daca_recipients:       3_560,       // active as of 2020

  // County-level immigrant concentrations (IRIS + AIC data)
  counties: {
    Fairfield:    { foreignBornPct:22, foreignBornCount:185_000, totalPop:944_000,
                   undocEstimate:45_000, cities:["Bridgeport","Stamford","Norwalk","Danbury"] },
    Hartford:     { foreignBornPct:15, foreignBornCount:130_000, totalPop:891_000,
                   undocEstimate:35_000, cities:["Hartford","New Britain","Waterbury"] },
    "New Haven":  { foreignBornPct:12, foreignBornCount:102_000, totalPop:857_000,
                   undocEstimate:28_000, cities:["New Haven","Bridgeport border","Waterbury","Meriden"] },
    Middlesex:    { foreignBornPct:9,  foreignBornCount:16_000,  totalPop:163_000,
                   undocEstimate:5_000,  cities:["Middletown","Meriden"] },
    "New London": { foreignBornPct:8,  foreignBornCount:20_000,  totalPop:270_000,
                   undocEstimate:6_000,  cities:["New London","Norwich"] },
    Tolland:      { foreignBornPct:7,  foreignBornCount:10_000,  totalPop:150_000,
                   undocEstimate:3_000,  cities:["Storrs","Vernon"] },
    Windham:      { foreignBornPct:11, foreignBornCount:13_000,  totalPop:116_000,
                   undocEstimate:4_000,  cities:["Willimantic","Putnam"] },
    Litchfield:   { foreignBornPct:6,  foreignBornCount:11_000,  totalPop:183_000,
                   undocEstimate:3_000,  cities:["Torrington","Waterbury border"] },
  },

  // CT legal capacity reality check
  legalCapacity: {
    totalImmigrationAttorneys:  ~180,   // estimated CT bar immigration-certified
    nonprofitAttorneys:         ~40,    // at nonprofit orgs
    surgeIfFunded:              ~80,    // could be activated with emergency funding
    avgCasesPerAttorney:        80,     // cases/year at normal pace
    emergencyCasesPerAttorney:  25,     // cases in 90-day crisis window
    kyrTrainedVolunteers:       ~200,   // trained but not attorneys
  },

  // Emergency shelter capacity
  shelterCapacity: {
    totalEmergencyBeds:     2_400,  // statewide (CCEH data)
    currentOccupancyPct:    88,     // near capacity
    availableSurge:         290,    // roughly 12% slack
    familyShelterBeds:      420,    // beds specifically for families
  },

  // Food system capacity
  foodCapacity: {
    foodshare_lbs_year:     28_000_000,
    ctFoodBank_lbs_year:    22_000_000,
    combinedPartnerSites:   1_100,
    mealsPossiblePerDay:    150_000,  // rough estimate at full surge
  },

  // Economic impact (for scenario framing)
  economic: {
    taxesPaidByImmigrants_federal: 4_800_000_000,  // $4.8B federal
    taxesPaidByImmigrants_state:   2_600_000_000,  // $2.6B state+local
    taxesByUndocumented_federal:     335_400_000,
    taxesByUndocumented_state:       197_400_000,
    spendingPower:               16_100_000_000,  // $16.1B
    usCitizensLivingWithUndoc:       60_000,
    usCitizenChildrenWithUndocParent: 41_000,
  },

  // ICE scenario specifics (2025 context)
  iceContext: {
    trustActPassedYear:     2013,
    trustActLimits:         "State/local law enforcement cannot inquire about immigration status or honor most ICE detainers",
    hamiltonHamdenArrests:  "ICE arrested 8 people at Hamden car wash including husband, wife, and customer (2025)",
    ctResponse:             "Special session considering civil rights lawsuit bill modeled on CA law (30+ years old)",
    agTongStance:           "AG William Tong publicly challenging unlawful ICE actions",
    sanctuaryCities:        ["Hartford","New Haven","Bridgeport","Stamford","Middletown"],
    churchSanctuaryNetwork: "~40 congregations statewide have signed sanctuary pledges",
  },
};

/**
 * Calibrated demand estimates with real CT data
 * All numbers grounded in CT_CONTEXT above
 */
export const CALIBRATED_DEMANDS = {
  ice_raid: {
    // If ICE conducted sustained operations across all 3 major counties
    affectedDirectly:      6_000,   // detained + family members
    legalCasesNeeded:      3_000,   // ~50% need direct legal help
    shelterDisplaced:        800,   // families with detained breadwinner
    foodInsecureHouseholds: 6_000,  // daily food need × 14 days
    mentalHealthSessions:   1_500,  // trauma counseling in 90 days
    emergencyFundNeeded: 8_000_000, // bail + legal + food + rent
    peopleToAlert:        120_000,  // undocumented + mixed-status households
    responseWindow:        "72 hours critical, 30 days sustained",
  },
};

/**
 * LIVE 2025 CT ICE ENFORCEMENT DATA
 * Sources: CT Mirror, CT Public Radio, CTData.org - Deportation Data Project FOIA
 * THIS IS HAPPENING NOW - not hypothetical
 */
export const ICE_2025_DATA = {
  totalArrestsJanJun2025:    405,   // Jan 20 – July 2025 (CT Mirror Aug 2025)
  totalArrestsJanJun2024:    173,   // same period 2024
  increasePercent:           134,   // 134% increase
  deportationIncrease:       237.7, // % increase in deportations
  outOfStateTransfers:       348,   // transferred to out-of-state detention
  totalTransferEvents:       1262,  // transfers (one person can have multiple)

  // By city (Jan 20 – mid-June 2025, CT Public Radio data)
  byCity: {
    Hartford:    127, // 54 city + 73 "HAR GENERAL AREA"
    Stamford:     19,
    Waterbury:    14,
    Danbury:      13,
    Bridgeport:   12,
  },

  // Criminal status of those arrested
  criminalStatus: {
    noChargesBeyondImmigration: 0.25, // 25% - immigration offense only
    pendingCharges:             0.42, // 42% - pending criminal charges
    priorConvictions:           0.25, // 25% - had convictions
  },

  // Demographics
  demographics: {
    male:           0.81, // 81% men
    topCountries:   ["Ecuador (23.7%)", "Guatemala (13.3%)", "Mexico", "Brazil", "Honduras"],
    ecuadorSurge:   284,  // % increase in Ecuadoran arrests
    guatemalaSurge: 440,  // % increase in Guatemalan arrests
  },

  // Notable 2025 incidents
  incidents: [
    { date:"2025-05", location:"Hamden", description:"8 people arrested at car wash, including husband, wife, and customer" },
    { date:"2025-06", location:"Southington", description:"4 car wash workers arrested" },
    { date:"2025-06", location:"New Haven", description:"Mother of two detained while taking children to school. 13-yr-old daughter witnessed arrest." },
    { date:"2025-06", location:"Meriden", description:"Graduating high school senior arrested" },
    { date:"2025-08", location:"Danbury", description:"65 arrested over 4-day 'Operation Broken Trust'. 100+ protesters at Danbury courthouse." },
    { date:"2025-08", location:"Stamford/Norwalk", description:"2 crime victims arrested at courthouse follow-up. Brothers tased in street in Norwalk." },
    { date:"2025-11", location:"New Haven", description:"Multiple courthouse arrests by ICE in masks/face coverings" },
    { date:"2026-01", location:"Hartford", description:"Federal vehicle knocked down protester at ICE vigil. HPD investigating." },
    { date:"2026-03", location:"Statewide", description:"CT legislature hearings on ICE accountability bill. Schools report enrollment drops due to fear." },
  ],

  // Policy context
  policyContext: {
    trustAct2025Updates:  "TRUST Act expanded 2025 - allows civil lawsuits against municipalities violating it",
    courthouses:          "ICE making courthouse arrests despite advocacy to ban them. Bill pending.",
    schoolEnrollment:     "New Haven schools reporting enrollment drops due to fear of ICE arrests at school drop-offs",
    nationalGuard:        "CT law prohibits National Guard participation in immigration enforcement",
    collateralArrests:    "ICE conducting collateral arrests — targeting one, detaining others nearby",
    guantanamo:           "290 immigrants nationwide sent to Guantanamo — at least 1 from CT (Nicaraguan man from Hartford, no criminal charges)",
    hartfordDeportDef:    "Hartford Deportation Defense active — vigils + direct action response network",
  },
};
