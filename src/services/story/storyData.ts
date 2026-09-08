import {
  StoryAct,
  DiscoveryStep,
  StoryFact,
  UnresolvedQuestion,
  Contradiction,
  InvestigationTimelineEvent,
  InvestigationLead
} from '../../types/story';

export const STORY_ACTS: StoryAct[] = [
  {
    id: 1,
    title: 'ACT I',
    subtitle: 'THE ARCHIVE',
    description: 'A routine audit reveals an irregular post-closure modification on Case 27. The original disappearance report and incident timestamps harbor unexplained discrepancies.',
    revelationTitle: 'CASE 27 WAS NOT AN ISOLATED INCIDENT',
    revelationText: 'Cross-referencing 42 Willow Street and lead detective Daniel Hayes proves the location and people surrounding Anna Bell had an entangled history predating her disappearance by over a decade.'
  },
  {
    id: 2,
    title: 'ACT II',
    subtitle: 'THE ORIGINAL INVESTIGATION',
    description: 'Deconstructing the initial 1998 police field response. Conflicting witness statements, an omitted dispatch radio call, and an unindexed vehicle incident emerge.',
    revelationTitle: 'THE VEHICLE CONNECTS MULTIPLE SITES',
    revelationText: 'The 1987 Ford Taurus (TXR-481) sighted suspiciously near Willow Street at 22:41 was later found abandoned along Canal Road, bridging disparate scenes across Northbridge.'
  },
  {
    id: 3,
    title: 'ACT III',
    subtitle: 'THE PEOPLE AROUND ANNA',
    description: 'Examining registered ownership of the Taurus, family questioning, and corporate ties at Bell Electronics Components.',
    revelationTitle: 'A CORPORATE & PERSONAL WEB',
    revelationText: 'Anna Bell was not merely a missing resident; she was an auditor at Bell Electronics who had flagged illegal shipments linked to Crownline Logistics and associates of Detective Hayes.'
  },
  {
    id: 4,
    title: 'ACT IV',
    subtitle: 'THE MISSING YEARS',
    description: 'Tracing public archives, corporate liquidation filings, and historical news reports between 1998 and the 2003 shuttering of Bell Electronics.',
    revelationTitle: 'EVIDENCE SUPPRESSION IDENTIFIED',
    revelationText: 'An employee interviewed in 1998 regarding stolen ledger records had their deposition entirely omitted from the official Case 27 court file.'
  },
  {
    id: 5,
    title: 'ACT V',
    subtitle: 'THE COVERED RECORD',
    description: 'Digital forensics into the 2004 audit alteration on Report R-1998-112 reveals that internal records management deliberately stripped references to another investigation.',
    revelationTitle: 'THE OFFICIAL RECORD WAS ALTERED',
    revelationText: 'The missing attachment in R-1998-112 was a cross-reference to sealed Internal Affairs Docket CASE-1989-114, expunged to shield departmental personnel.'
  },
  {
    id: 6,
    title: 'ACT VI',
    subtitle: 'THE TRUTH',
    description: 'Unsealing Internal Affairs records, tracing Detective Hayes’ hasty departure, and reconstructing the exact sequence of events on the night of September 14, 1998.',
    revelationTitle: 'CASE 27 RECONSTRUCTED',
    revelationText: 'Anna Bell discovered departmental complicity in freight theft between Bell Electronics and Crownline Logistics. Detective Hayes intercepted her before she could deliver the ledger to federal authorities.'
  }
];

export const DISCOVERY_STEPS: DiscoveryStep[] = [
  // ================= ACT 1 =================
  {
    id: 'step_01',
    act: 1,
    order: 1,
    title: 'Open Case Docket 27',
    description: 'Review the reopened case file for CASE-1998-027 (Anna Claire Bell).',
    trigger: {
      type: 'view_record',
      targetId: 'CASE-1998-027'
    },
    flagGranted: 'flag_opened_case_27',
    factsAdded: ['fact_anna_disappearance_date', 'fact_anna_age_status'],
    questionsAdded: ['q_why_audit_modification', 'q_why_case_closed_early'],
    timelineEventsAdded: ['evt_anna_shift_end'],
    hintLevel1: 'The desktop contains an assignment memorandum directing you to the central records database.',
    hintLevel2: 'Open the PRIS Database and query CASE-1998-027 from the case registers or search bar.',
    hintLevel3: 'Click on CASE-1998-027 in the PRIS Case Register to begin reviewing the original docket.'
  },
  {
    id: 'step_02',
    act: 1,
    order: 2,
    title: 'Read Original Disappearance Report',
    description: 'Inspect initial report R-1998-112 authored on the morning of September 15, 1998.',
    trigger: {
      type: 'view_record',
      targetId: 'R-1998-112'
    },
    flagGranted: 'flag_read_r_1998_112',
    factsAdded: ['fact_last_seen_willow', 'fact_taurus_plate_txr481'],
    questionsAdded: ['q_where_did_vehicle_go'],
    timelineEventsAdded: ['evt_report_112_filed'],
    hintLevel1: 'Case 27 contains multiple attached investigative reports in its documents ledger.',
    hintLevel2: 'Check Report #R-1998-112, the initial missing person summary filed by responding detectives.',
    hintLevel3: 'Open report R-1998-112 in PRIS Reports to review the scene inspection at 42 Willow Street.'
  },
  {
    id: 'step_03',
    act: 1,
    order: 3,
    title: 'Examine Disappearance Timeline',
    description: 'Identify timestamp divergence between initial dispatch time and investigator arrival.',
    trigger: {
      type: 'view_record',
      targetId: 'INC-1998-0914'
    },
    flagGranted: 'flag_found_time_divergence',
    factsAdded: ['fact_time_divergence_2217_vs_2240'],
    questionsAdded: ['q_why_time_difference'],
    contradictionAdded: 'contra_timeline_willow',
    timelineEventsAdded: ['evt_dispatch_911_call'],
    hintLevel1: 'Incident records contain the raw Computer Aided Dispatch (CAD) log from the night of the event.',
    hintLevel2: 'Look up Incident INC-1998-0914 or check the incidents linked to Case 27.',
    hintLevel3: 'Notice the timestamp difference between the 911 dispatch at 22:17 and the detective notes.'
  },
  {
    id: 'step_04',
    act: 1,
    order: 4,
    title: 'Investigate Supplemental Report',
    description: 'Locate secondary supplemental report R-1998-114 filed three days later.',
    trigger: {
      type: 'view_record',
      targetId: 'R-1998-114'
    },
    flagGranted: 'flag_read_r_1998_114',
    factsAdded: ['fact_hayes_supplemental_narrative'],
    questionsAdded: ['q_who_authorized_supplemental'],
    timelineEventsAdded: ['evt_supplemental_filed'],
    hintLevel1: 'Check whether a supplemental report was added to the case docket after the initial canvass.',
    hintLevel2: 'Open Report R-1998-114 in PRIS to see the detective’s follow-up canvass notes.',
    hintLevel3: 'Notice who authored Report R-1998-114 and how their timeline shifts the last sighting.'
  },
  {
    id: 'step_05',
    act: 1,
    order: 5,
    title: 'Identify Detective Daniel Hayes',
    description: 'Examine Detective Daniel Hayes’ role as the lead investigator on Case 27.',
    trigger: {
      type: 'view_record',
      targetId: 'OFF-3014'
    },
    flagGranted: 'flag_investigated_hayes',
    factsAdded: ['fact_hayes_badge_3014', 'fact_hayes_transferred_2008'],
    questionsAdded: ['q_why_did_hayes_transfer'],
    leadsAdded: ['lead_check_hayes_cases'],
    hintLevel1: 'The author of both reports is listed by name and badge number in the header.',
    hintLevel2: 'Look up Detective Daniel Hayes (Badge #3014) in the Officers registry of PRIS.',
    hintLevel3: 'Open officer profile OFF-3014 to review his service dates and assigned dockets.'
  },
  {
    id: 'step_06',
    act: 1,
    order: 6,
    title: 'Check Hayes’ Case History',
    description: 'Inspect previous case assignments handled by Detective Hayes prior to 1998.',
    trigger: {
      type: 'view_record',
      targetId: 'CASE-1991-081'
    },
    flagGranted: 'flag_checked_hayes_prior_case',
    factsAdded: ['fact_hayes_handled_1991_case'],
    questionsAdded: ['q_connection_between_cases'],
    hintLevel1: 'Officer dossiers in PRIS display all active and closed case assignments.',
    hintLevel2: 'Click on CASE-1991-081 listed under Detective Hayes’ assigned cases.',
    hintLevel3: 'Review CASE-1991-081 to see which geographic jurisdiction Hayes operated in.'
  },
  {
    id: 'step_07',
    act: 1,
    order: 7,
    title: 'Uncover 42 Willow Street History',
    description: 'Search location dossier for 42 Willow Street to check historical incidents.',
    trigger: {
      type: 'view_record',
      targetId: 'LOC-0042'
    },
    flagGranted: 'flag_inspected_42_willow',
    factsAdded: ['fact_willow_burglary_1987'],
    questionsAdded: ['q_who_was_involved_in_1987_burglary'],
    hintLevel1: 'Locations can be looked up directly in PRIS under the Locations section.',
    hintLevel2: 'Search for "42 Willow Street" or open location record LOC-0042.',
    hintLevel3: 'Inspect the documented past incidents at 42 Willow Street—an older case occurred there.'
  },
  {
    id: 'step_08',
    act: 1,
    order: 8,
    title: 'Inspect Older Burglary Case (CASE-1987-014)',
    description: 'Open the 1987 burglary case file associated with the Willow Street property.',
    trigger: {
      type: 'view_record',
      targetId: 'CASE-1987-014'
    },
    flagGranted: 'flag_opened_case_1987_014',
    factsAdded: ['fact_case_1987_crownline_connection'],
    questionsAdded: ['q_mercer_role_in_burglary'],
    leadsAdded: ['lead_investigate_crownline'],
    hintLevel1: 'The location registry links directly to historical case dockets at that address.',
    hintLevel2: 'Open CASE-1987-014 from the location page or the case list.',
    hintLevel3: 'Read the summary of CASE-1987-014 to understand what property was targeted.'
  },
  {
    id: 'step_09',
    act: 1,
    order: 9,
    title: 'Connect Burglary Persons to Anna Bell',
    description: 'Compare persons of interest in the 1987 burglary report to Anna Bell’s associates.',
    trigger: {
      type: 'search_term',
      searchTerm: 'Crownline'
    },
    flagGranted: 'flag_linked_crownline_to_bell',
    factsAdded: ['fact_crownline_transport_overlap'],
    questionsAdded: ['q_why_crownline_in_both'],
    contradictionAdded: 'contra_mercer_employment',
    hintLevel1: 'Perform a universal PRIS search for recurring business entities mentioned across both files.',
    hintLevel2: 'Search for "Crownline" or "Crownline Logistics" in the top search bar.',
    hintLevel3: 'Note how Crownline Logistics connects the 1987 warehouse case to Anna’s workplace.'
  },
  {
    id: 'step_10',
    act: 1,
    order: 10,
    title: 'Synthesize Act 1 Revelation',
    description: 'Establish that Case 27 was not a random disappearance but part of a multi-decade thread.',
    trigger: {
      type: 'flag',
      targetId: 'flag_linked_crownline_to_bell',
      requiredFlags: ['flag_opened_case_27', 'flag_read_r_1998_112', 'flag_inspected_42_willow']
    },
    flagGranted: 'flag_act_1_completed',
    factsAdded: ['fact_act_1_synthesis'],
    questionsAdded: ['q_what_was_in_the_audits'],
    hintLevel1: 'Review your notes in the Investigation Notebook to confirm all initial records are logged.',
    hintLevel2: 'Check the Known Facts tab in your Notebook to see the timeline connections.',
    hintLevel3: 'Act 1 complete: Case 27 is linked to previous events at 42 Willow Street.'
  },

  // ================= ACT 2 =================
  {
    id: 'step_11',
    act: 2,
    order: 11,
    title: 'Review Witness Statement of Neighbor',
    description: 'Read the interview statement from neighbor Martha Gable (P-002891).',
    trigger: {
      type: 'view_record',
      targetId: 'P-002891'
    },
    flagGranted: 'flag_interviewed_gable',
    factsAdded: ['fact_gable_heard_car_door'],
    questionsAdded: ['q_exact_time_gable_heard_noise'],
    timelineEventsAdded: ['evt_gable_audio_witness'],
    hintLevel1: 'Check the witnesses listed on the Case 27 docket.',
    hintLevel2: 'Open person profile P-002891 (Martha Gable), resident of 40 Willow Street.',
    hintLevel3: 'Read Martha Gable’s account regarding vehicles heard outside between 22:30 and 22:50.'
  },
  {
    id: 'step_12',
    act: 2,
    order: 12,
    title: 'Examine Second Witness Statement',
    description: 'Read the interview statement of diner clerk Leo Vance (P-003102).',
    trigger: {
      type: 'view_record',
      targetId: 'P-003102'
    },
    flagGranted: 'flag_interviewed_leo_vance',
    factsAdded: ['fact_leo_vance_saw_anna'],
    questionsAdded: ['q_why_leo_statement_omitted'],
    hintLevel1: 'Another witness was interviewed near the commercial strip on Grand Ave.',
    hintLevel2: 'Look up Leo Vance (P-003102) in the PRIS Person database.',
    hintLevel3: 'Examine Leo Vance’s statement about seeing Anna’s car leave Bell Electronics.'
  },
  {
    id: 'step_13',
    act: 2,
    order: 13,
    title: 'Analyze Witness Disagreement',
    description: 'Identify the 30-minute discrepancy between Martha Gable and Leo Vance.',
    trigger: {
      type: 'search_term',
      searchTerm: '22:15'
    },
    flagGranted: 'flag_analyzed_witness_gap',
    factsAdded: ['fact_witness_timeline_disagreement'],
    contradictionAdded: 'contra_witness_timing',
    hintLevel1: 'Compare the recorded times of Anna’s departure from work versus her arrival home.',
    hintLevel2: 'Search for "22:15" in the database to see the exact time Leo Vance saw Anna.',
    hintLevel3: 'The transit time between Bell Electronics and Willow Street is only 6 minutes, but 30 minutes elapsed.'
  },
  {
    id: 'step_14',
    act: 2,
    order: 14,
    title: 'Inspect Central Police Dispatch Archive',
    description: 'Open incident dispatch log for September 14, 1998 in PRIS or Terminal logs.',
    trigger: {
      type: 'view_file',
      targetId: '/var/log/audit/dispatch_19980914.log'
    },
    flagGranted: 'flag_viewed_dispatch_file',
    factsAdded: ['fact_dispatch_unlogged_transmission'],
    questionsAdded: ['q_why_dispatch_transmission_unassigned'],
    timelineEventsAdded: ['evt_radio_traffic_willow'],
    hintLevel1: 'Check the system terminal or File Manager for raw municipal dispatch archives.',
    hintLevel2: 'In File Manager, navigate to /var/log/audit/ and read dispatch_19980914.log.',
    hintLevel3: 'Or in Terminal, run: cat /var/log/audit/dispatch_19980914.log'
  },
  {
    id: 'step_15',
    act: 2,
    order: 15,
    title: 'Discover Unindexed Patrol Transmission',
    description: 'Identify the radio call regarding a suspicious vehicle parked near Willow Street.',
    trigger: {
      type: 'view_record',
      targetId: 'INC-1998-0915'
    },
    flagGranted: 'flag_found_unindexed_transmission',
    factsAdded: ['fact_suspicious_vehicle_call'],
    questionsAdded: ['q_who_reported_suspicious_car'],
    hintLevel1: 'Incident INC-1998-0915 was logged at 22:41 on September 14.',
    hintLevel2: 'Search for incident INC-1998-0915 in PRIS Universal Search.',
    hintLevel3: 'Review the details of the suspicious vehicle call logged under INC-1998-0915.'
  },
  {
    id: 'step_16',
    act: 2,
    order: 16,
    title: 'Query Suspicious Vehicle Incidents',
    description: 'Filter vehicle incident records logged in the 3rd Precinct on September 14, 1998.',
    trigger: {
      type: 'search_term',
      searchTerm: 'TXR-481'
    },
    flagGranted: 'flag_searched_txr481',
    factsAdded: ['fact_plate_search_executed'],
    questionsAdded: ['q_who_drove_txr481'],
    leadsAdded: ['lead_trace_vehicle_history'],
    hintLevel1: 'Use the license plate mentioned in the reports to run a direct vehicle search.',
    hintLevel2: 'Search for "TXR-481" in the PRIS search bar.',
    hintLevel3: 'Open the vehicle record corresponding to plate TXR-481.'
  },
  {
    id: 'step_17',
    act: 2,
    order: 17,
    title: 'Open Vehicle Record VEH-1987-0481',
    description: 'Inspect registration, color, make, and impound status of the 1987 Ford Taurus.',
    trigger: {
      type: 'view_record',
      targetId: 'VEH-1987-0481'
    },
    flagGranted: 'flag_opened_veh_record',
    factsAdded: ['fact_vehicle_specs_taurus', 'fact_vehicle_found_canal_road'],
    timelineEventsAdded: ['evt_vehicle_found_canal'],
    hintLevel1: 'Select the vehicle dossier for plate TXR-481.',
    hintLevel2: 'Open vehicle record VEH-1987-0481 in PRIS Vehicles.',
    hintLevel3: 'Review the impound lot and recovery notes—the car was found 18 days later at Canal Road.'
  },
  {
    id: 'step_18',
    act: 2,
    order: 18,
    title: 'Examine Canal Road Evidence Recovery',
    description: 'Inspect physical evidence recovered from the glovebox and floor of the Taurus.',
    trigger: {
      type: 'view_record',
      targetId: 'E-004821'
    },
    flagGranted: 'flag_inspected_e_004821',
    factsAdded: ['fact_evidence_cassette_keys'],
    questionsAdded: ['q_what_was_on_audio_cassette'],
    hintLevel1: 'Evidence items collected from the vehicle are listed on the vehicle and case pages.',
    hintLevel2: 'Open Evidence item E-004821 in PRIS Evidence.',
    hintLevel3: 'Review the intake log for the brass key fob and micro-cassette found in the vehicle.'
  },
  {
    id: 'step_19',
    act: 2,
    order: 19,
    title: 'Inspect Forensic Lab Analysis of Cassette',
    description: 'Read the crime lab analysis report attached to Evidence E-004821.',
    trigger: {
      type: 'view_record',
      targetId: 'E-004823'
    },
    flagGranted: 'flag_inspected_lab_analysis',
    factsAdded: ['fact_cassette_contained_dictation'],
    timelineEventsAdded: ['evt_cassette_recorded'],
    hintLevel1: 'Check Evidence item E-004823 for the laboratory transcript analysis.',
    hintLevel2: 'Open E-004823 to see what the state police forensics lab recovered from the tape.',
    hintLevel3: 'The tape records Anna stating: "The shipping bills don\'t balance with Crownline manifests."'
  },
  {
    id: 'step_20',
    act: 2,
    order: 20,
    title: 'Synthesize Act 2 Revelation',
    description: 'Establish that the vehicle connects the disappearance to Canal Road and corporate manifests.',
    trigger: {
      type: 'flag',
      targetId: 'flag_inspected_lab_analysis',
      requiredFlags: ['flag_opened_veh_record', 'flag_searched_txr481']
    },
    flagGranted: 'flag_act_2_completed',
    factsAdded: ['fact_act_2_synthesis'],
    questionsAdded: ['q_who_owned_taurus_officially'],
    hintLevel1: 'Review your findings on the vehicle and evidence in the Investigation Notebook.',
    hintLevel2: 'Confirm the link between the vehicle and Anna’s work concerns.',
    hintLevel3: 'Act 2 complete: The vehicle was not stolen for a joyride—it was used to conceal evidence.'
  },

  // ================= ACT 3 =================
  {
    id: 'step_21',
    act: 3,
    order: 21,
    title: 'Identify Registered Owner of TXR-481',
    description: 'Check the legal registration on vehicle VEH-1987-0481.',
    trigger: {
      type: 'search_term',
      searchTerm: 'Michael Bell'
    },
    flagGranted: 'flag_identified_michael_bell',
    factsAdded: ['fact_taurus_owned_by_michael'],
    questionsAdded: ['q_why_did_anna_drive_brother_car'],
    hintLevel1: 'Who holds legal title to the 1987 Ford Taurus according to the DMV registry?',
    hintLevel2: 'The vehicle dossier lists the registered owner as Michael Bell.',
    hintLevel3: 'Search for "Michael Bell" in PRIS to view his citizen dossier.'
  },
  {
    id: 'step_22',
    act: 3,
    order: 22,
    title: 'Open Michael Bell’s Dossier (P-004822)',
    description: 'Review Anna’s older brother’s profile, employment, and alibi statements.',
    trigger: {
      type: 'view_record',
      targetId: 'P-004822'
    },
    flagGranted: 'flag_opened_michael_bell',
    factsAdded: ['fact_michael_bell_alibi_shift'],
    questionsAdded: ['q_did_michael_lend_car'],
    timelineEventsAdded: ['evt_michael_interrogated'],
    hintLevel1: 'Open Person record P-004822 in PRIS Persons.',
    hintLevel2: 'Read Michael Bell’s employment history and statement regarding lending the vehicle.',
    hintLevel3: 'Michael claimed Anna borrowed the car on Monday because her own coupe had a broken alternator.'
  },
  {
    id: 'step_23',
    act: 3,
    order: 23,
    title: 'Read Michael Bell Interview Transcript',
    description: 'Review Report R-1998-129 containing Michael Bell’s official detective interview.',
    trigger: {
      type: 'view_record',
      targetId: 'R-1998-129'
    },
    flagGranted: 'flag_read_michael_interview',
    factsAdded: ['fact_michael_stated_anna_frightened'],
    questionsAdded: ['q_who_was_anna_frightened_of'],
    contradictionAdded: 'contra_michael_alibi_punchcard',
    hintLevel1: 'Look in Reports for the interview docket with Michael Bell.',
    hintLevel2: 'Open Report R-1998-129, filed by Detective Hayes on September 17, 1998.',
    hintLevel3: 'Notice Michael’s statement that Anna told him she caught warehouse management altering inventory.'
  },
  {
    id: 'step_24',
    act: 3,
    order: 24,
    title: 'Examine Michael Bell’s Contradiction',
    description: 'Cross-reference Michael’s claimed work shift with facility timecard records.',
    trigger: {
      type: 'search_term',
      searchTerm: 'timecard'
    },
    flagGranted: 'flag_checked_timecard',
    factsAdded: ['fact_michael_timecard_verified'],
    questionsAdded: ['q_if_michael_innocent_who_else'],
    hintLevel1: 'Was Michael Bell’s alibi verified by investigators?',
    hintLevel2: 'Search for "timecard" or "punchcard" in PRIS.',
    hintLevel3: 'Michael clocked in at the municipal rail yard at 21:45 and did not leave until 06:00—his alibi holds.'
  },
  {
    id: 'step_25',
    act: 3,
    order: 25,
    title: 'Investigate Anna’s Professional Associates',
    description: 'Search for known employees and managers at Bell Electronics Components.',
    trigger: {
      type: 'view_record',
      targetId: 'ORG-0012'
    },
    flagGranted: 'flag_viewed_bell_electronics_org',
    factsAdded: ['fact_bell_electronics_profile'],
    questionsAdded: ['q_who_managed_bell_electronics'],
    leadsAdded: ['lead_investigate_mercer_reed'],
    hintLevel1: 'PRIS contains an Organizations directory listing registered commercial entities.',
    hintLevel2: 'Open Organization record ORG-0012 (Bell Electronics Components).',
    hintLevel3: 'Review the executive roster and registered address at 104 Waterfront Way.'
  },
  {
    id: 'step_26',
    act: 3,
    order: 26,
    title: 'Identify Daniel Mercer (P-006219)',
    description: 'Inspect warehouse supervisor Daniel Mercer’s criminal and employment history.',
    trigger: {
      type: 'view_record',
      targetId: 'P-006219'
    },
    flagGranted: 'flag_opened_daniel_mercer',
    factsAdded: ['fact_mercer_warehouse_manager', 'fact_mercer_prior_arrests'],
    questionsAdded: ['q_mercer_connection_to_officer_mercer'],
    timelineEventsAdded: ['evt_mercer_confrontation'],
    hintLevel1: 'Look at the Key Personnel listed on the Bell Electronics organization dossier.',
    hintLevel2: 'Open person profile P-006219 (Daniel Mercer), Warehouse Operations Supervisor.',
    hintLevel3: 'Check his prior arrest record: arrested in 1987 in connection with the Crownline warehouse theft.'
  },
  {
    id: 'step_27',
    act: 3,
    order: 27,
    title: 'Examine Mercer’s Family Ties',
    description: 'Discover that Daniel Mercer is the nephew of retired Detective John Mercer.',
    trigger: {
      type: 'search_term',
      searchTerm: 'John Mercer'
    },
    flagGranted: 'flag_found_mercer_family_tie',
    factsAdded: ['fact_mercer_nephew_of_detective'],
    questionsAdded: ['q_did_officer_protect_nephew'],
    leadsAdded: ['lead_investigate_retired_detective'],
    hintLevel1: 'Perform a search for the surname "Mercer" across officers and persons in PRIS.',
    hintLevel2: 'Compare Daniel Mercer’s emergency contacts with Officer John Mercer (OFF-1044).',
    hintLevel3: 'Daniel Mercer was defended and bailed out by Detective John Mercer in 1987.'
  },
  {
    id: 'step_28',
    act: 3,
    order: 28,
    title: 'Inspect Evelyn Reed (P-005118)',
    description: 'Review the profile of Evelyn Reed, assistant comptroller at Bell Electronics.',
    trigger: {
      type: 'view_record',
      targetId: 'P-005118'
    },
    flagGranted: 'flag_opened_evelyn_reed',
    factsAdded: ['fact_evelyn_reed_auditor_peer'],
    questionsAdded: ['q_did_reed_know_about_audits'],
    hintLevel1: 'Check the other office personnel at Bell Electronics.',
    hintLevel2: 'Open person dossier P-005118 (Evelyn Reed), Assistant Comptroller.',
    hintLevel3: 'Evelyn worked in the desk adjacent to Anna Bell and co-signed the preliminary inventory audits.'
  },
  {
    id: 'step_29',
    act: 3,
    order: 29,
    title: 'Cross-Reference Reed & Mercer Working Relationship',
    description: 'Identify the hostile confrontation between Anna Bell and Daniel Mercer on Sept 11, 1998.',
    trigger: {
      type: 'search_term',
      searchTerm: 'September 11'
    },
    flagGranted: 'flag_found_workplace_altercation',
    factsAdded: ['fact_friday_altercation_warehouse'],
    timelineEventsAdded: ['evt_friday_altercation'],
    hintLevel1: 'Look for internal witness statements regarding incidents the Friday before the disappearance.',
    hintLevel2: 'Search PRIS for "September 11" or check Evelyn Reed’s interview timeline.',
    hintLevel3: 'Three days before vanishing, Anna openly accused Mercer of forging bills of lading for Crownline.'
  },
  {
    id: 'step_30',
    act: 3,
    order: 30,
    title: 'Synthesize Act 3 Revelation',
    description: 'Conclude that Anna’s disappearance intersects directly with Bell Electronics and family ties.',
    trigger: {
      type: 'flag',
      targetId: 'flag_found_workplace_altercation',
      requiredFlags: ['flag_opened_daniel_mercer', 'flag_found_mercer_family_tie']
    },
    flagGranted: 'flag_act_3_completed',
    factsAdded: ['fact_act_3_synthesis'],
    questionsAdded: ['q_what_happened_to_bell_electronics_after_1998'],
    hintLevel1: 'Review your suspect cards and notes in the Investigation Notebook.',
    hintLevel2: 'Note the triangle between Anna, Mercer, and Crownline Logistics.',
    hintLevel3: 'Act 3 complete: Mercer had motive, opportunity, and law enforcement protection.'
  },

  // ================= ACT 4 =================
  {
    id: 'step_31',
    act: 4,
    order: 31,
    title: 'Search Bell Electronics on the Web',
    description: 'Open the workstation Browser and investigate Bell Electronics in web search.',
    trigger: {
      type: 'view_webpage',
      targetId: 'http://news.northbridge-herald.local/archive/bell-electronics-bankruptcy'
    },
    flagGranted: 'flag_browsed_bell_bankruptcy',
    factsAdded: ['fact_bell_closed_2003_bankruptcy'],
    questionsAdded: ['q_why_did_bell_go_bankrupt'],
    timelineEventsAdded: ['evt_bell_liquidation_2003'],
    hintLevel1: 'Open the Browser application from your desktop or dock.',
    hintLevel2: 'Search for "Bell Electronics" in Northbridge Search or check the Herald business archives.',
    hintLevel3: 'Navigate to the Herald archive article on the 2003 bankruptcy liquidation of Bell Electronics.'
  },
  {
    id: 'step_32',
    act: 4,
    order: 32,
    title: 'Investigate Corporate Liquidation Filings',
    description: 'Read the archived 2003 Herald article covering the forensic audit of Bell Electronics.',
    trigger: {
      type: 'search_term',
      searchTerm: 'liquidation'
    },
    flagGranted: 'flag_found_liquidation_audit',
    factsAdded: ['fact_liquidation_uncovered_phantom_shipments'],
    questionsAdded: ['q_who_received_phantom_shipments'],
    hintLevel1: 'The article mentions court-ordered forensic audits during bankruptcy proceedings.',
    hintLevel2: 'Read the body of the bankruptcy article regarding missing warehouse inventory.',
    hintLevel3: 'Over $2.4 million in telecommunications circuits disappeared into unverified logistics shipments.'
  },
  {
    id: 'step_33',
    act: 4,
    order: 33,
    title: 'Search Community Forum Archives',
    description: 'Look for historic community discussions regarding the 1998 disappearance.',
    trigger: {
      type: 'view_webpage',
      targetId: 'http://metroforum.local/thread/unsolved-cases-northbridge'
    },
    flagGranted: 'flag_read_community_forum',
    factsAdded: ['fact_forum_discussion_crownline'],
    questionsAdded: ['q_who_posted_as_whistleblower'],
    hintLevel1: 'The fictional internet contains community forums under metroforum.local.',
    hintLevel2: 'Browse to http://metroforum.local or search "Anna Bell" on the forum.',
    hintLevel3: 'Read the thread "Unsolved Disappearances of Northbridge" discussing Crownline Logistics trucks.'
  },
  {
    id: 'step_34',
    act: 4,
    order: 34,
    title: 'Identify Anonymous Forum Poster "ExAuditor"',
    description: 'Examine forum posts by an anonymous insider alleging missing file folders.',
    trigger: {
      type: 'search_term',
      searchTerm: 'ExAuditor'
    },
    flagGranted: 'flag_identified_exauditor',
    factsAdded: ['fact_exauditor_allegations'],
    questionsAdded: ['q_was_exauditor_evelyn_reed'],
    leadsAdded: ['lead_compare_exauditor_reed'],
    hintLevel1: 'Search for the username "ExAuditor" across the forum or browser.',
    hintLevel2: 'ExAuditor wrote: "They took Anna’s blue folders from the file cabinet before police even arrived."',
    hintLevel3: 'The author claims to have worked in accounting on the second floor—matching Evelyn Reed.'
  },
  {
    id: 'step_35',
    act: 4,
    order: 35,
    title: 'Search Public Records for Evelyn Reed',
    description: 'Check whether Evelyn Reed filed any official complaints or depositions.',
    trigger: {
      type: 'view_webpage',
      targetId: 'http://records.northbridge-court.local/cases/probate-1999'
    },
    flagGranted: 'flag_checked_reed_court_filing',
    factsAdded: ['fact_reed_subpoena_1999'],
    questionsAdded: ['q_where_is_reed_subpoena_testimony'],
    hintLevel1: 'Check the municipal court portal at records.northbridge-court.local.',
    hintLevel2: 'Search court archives for "Evelyn Reed" or "Bell Electronics Subpoena".',
    hintLevel3: 'Court records show Reed was subpoenaed in October 1999 to produce accounting records.'
  },
  {
    id: 'step_36',
    act: 4,
    order: 36,
    title: 'Query PRIS for Reed Subpoena Document',
    description: 'Check if Reed’s subpoena deposition exists in the police records database.',
    trigger: {
      type: 'search_term',
      searchTerm: 'SUB-1999-042'
    },
    flagGranted: 'flag_searched_subpoena',
    factsAdded: ['fact_subpoena_missing_from_pris'],
    questionsAdded: ['q_why_subpoena_missing'],
    hintLevel1: 'Look up subpoena index SUB-1999-042 in PRIS search.',
    hintLevel2: 'Search for "SUB-1999-042" in the PRIS search bar.',
    hintLevel3: 'The record returns zero active results in the primary database index.'
  },
  {
    id: 'step_37',
    act: 4,
    order: 37,
    title: 'Inspect Workstation Local Archive Directory',
    description: 'Explore the local workstation file system in /home/investigator/Documents/Archive/.',
    trigger: {
      type: 'view_file',
      targetId: '/home/investigator/Documents/Archive/Unindexed_Depositions.txt'
    },
    flagGranted: 'flag_found_unindexed_deposition_file',
    factsAdded: ['fact_found_reed_unindexed_statement'],
    questionsAdded: ['q_who_saved_deposition_locally'],
    timelineEventsAdded: ['evt_reed_deposition_given'],
    hintLevel1: 'Check your Documents folder using File Manager or Terminal.',
    hintLevel2: 'Navigate to /home/investigator/Documents/Archive/ in File Manager.',
    hintLevel3: 'Open Unindexed_Depositions.txt to read Evelyn Reed’s missing deposition.'
  },
  {
    id: 'step_38',
    act: 4,
    order: 38,
    title: 'Read Evelyn Reed’s Omitted Deposition',
    description: 'Discover Reed’s testimony that Anna gave her duplicate ledgers before disappearing.',
    trigger: {
      type: 'search_term',
      searchTerm: 'duplicate ledgers'
    },
    flagGranted: 'flag_read_duplicate_ledgers_statement',
    factsAdded: ['fact_anna_hid_duplicate_ledgers'],
    questionsAdded: ['q_where_are_duplicate_ledgers'],
    hintLevel1: 'Read the section of the deposition regarding Anna’s personal precautions.',
    hintLevel2: 'Search for "duplicate ledgers" in the document.',
    hintLevel3: 'Reed states Anna entrusted a carbon copy of the Crownline freight receipts to an off-site locker.'
  },
  {
    id: 'step_39',
    act: 3,
    order: 39,
    title: 'Identify Locker Key Fob (E-004821)',
    description: 'Connect the brass key fob recovered in the Taurus to the off-site storage locker.',
    trigger: {
      type: 'view_record',
      targetId: 'E-004821'
    },
    flagGranted: 'flag_connected_key_to_locker',
    factsAdded: ['fact_brass_key_stamped_canal_lockers'],
    questionsAdded: ['q_was_locker_ever_searched'],
    leadsAdded: ['lead_check_canal_storage'],
    hintLevel1: 'Revisit Evidence item E-004821 recovered from the Ford Taurus.',
    hintLevel2: 'Look closely at the brass key description: it is stamped "CS-14".',
    hintLevel3: '"CS-14" corresponds to Canal Storage, located 200 yards from where the car was abandoned.'
  },
  {
    id: 'step_40',
    act: 4,
    order: 40,
    title: 'Synthesize Act 4 Revelation',
    description: 'Confirm that key witness testimony and evidence leads were deliberately omitted.',
    trigger: {
      type: 'flag',
      targetId: 'flag_connected_key_to_locker',
      requiredFlags: ['flag_found_unindexed_deposition_file', 'flag_read_duplicate_ledgers_statement']
    },
    flagGranted: 'flag_act_4_completed',
    factsAdded: ['fact_act_4_synthesis'],
    questionsAdded: ['q_who_removed_deposition_from_system'],
    hintLevel1: 'Review your findings in the Investigation Notebook.',
    hintLevel2: 'Note that the deposition was preserved locally by an earlier honest officer.',
    hintLevel3: 'Act 4 complete: Someone actively suppressed the duplicate ledger leads.'
  },

  // ================= ACT 5 =================
  {
    id: 'step_41',
    act: 5,
    order: 41,
    title: 'Inspect Report R-1998-112 System Metadata',
    description: 'Inspect the system version history and audit stamps on Report R-1998-112.',
    trigger: {
      type: 'search_term',
      searchTerm: 'June 3, 2004'
    },
    flagGranted: 'flag_inspected_audit_metadata',
    factsAdded: ['fact_audit_date_2004_confirmed'],
    questionsAdded: ['q_who_authorized_2004_edit'],
    timelineEventsAdded: ['evt_record_tampered_2004'],
    hintLevel1: 'Check the 2004 audit timestamp mentioned in the opening case briefing memo.',
    hintLevel2: 'Search PRIS for "June 3, 2004" or check the revision history of Report R-1998-112.',
    hintLevel3: 'Notice the revision entry: "ATTACHMENT INDEX UPDATED // ATTACHMENT NOT FOUND".'
  },
  {
    id: 'step_42',
    act: 5,
    order: 42,
    title: 'Read Terminal Audit Log for June 2004',
    description: 'Examine /var/log/audit/audit_trail_2004.log to identify the user session.',
    trigger: {
      type: 'view_file',
      targetId: '/var/log/audit/audit_trail_2004.log'
    },
    flagGranted: 'flag_read_audit_trail_2004',
    factsAdded: ['fact_audit_user_admin_vance'],
    questionsAdded: ['q_who_was_captain_vance_protecting'],
    hintLevel1: 'Check the /var/log/audit/ folder for historical system audit logs.',
    hintLevel2: 'Open /var/log/audit/audit_trail_2004.log using File Manager or cat in Terminal.',
    hintLevel3: 'The log records user "CAPT_AVANCE" accessing R-1998-112 from terminal WS-01 on June 3, 2004.'
  },
  {
    id: 'step_43',
    act: 5,
    order: 43,
    title: 'Identify Captain Arthur Vance (OFF-1012)',
    description: 'Inspect Captain Arthur Vance’s administrative profile and supervisory authority.',
    trigger: {
      type: 'view_record',
      targetId: 'OFF-1012'
    },
    flagGranted: 'flag_viewed_captain_vance',
    factsAdded: ['fact_captain_vance_supervisor_hayes'],
    questionsAdded: ['q_why_vance_scrubbed_record'],
    hintLevel1: 'Look up Captain Arthur Vance in the PRIS Officers registry.',
    hintLevel2: 'Open officer profile OFF-1012 (Captain Arthur Vance).',
    hintLevel3: 'Vance was the commanding officer of the Detective Bureau and Hayes’ direct supervisor.'
  },
  {
    id: 'step_44',
    act: 5,
    order: 44,
    title: 'Inspect Redacted Section in Report R-1998-112',
    description: 'Identify the redacted text block suppressing a related cross-reference docket.',
    trigger: {
      type: 'search_term',
      searchTerm: 'REDACTED: IA_REFERENCE'
    },
    flagGranted: 'flag_found_ia_redaction',
    factsAdded: ['fact_ia_reference_suppressed'],
    questionsAdded: ['q_what_case_was_redacted'],
    hintLevel1: 'Report R-1998-112 contains a prominent redaction notice at the bottom.',
    hintLevel2: 'Search for "[REDACTED: IA_REFERENCE]" in PRIS search or open R-1998-112.',
    hintLevel3: 'The suppressed section removed an internal reference to a 1989 Internal Affairs investigation.'
  },
  {
    id: 'step_45',
    act: 5,
    order: 45,
    title: 'Uncover Sealed Case Number CASE-1989-114',
    description: 'Recover the redacted case docket number from the archival diff log.',
    trigger: {
      type: 'view_file',
      targetId: '/home/investigator/Documents/Archive/Redaction_Diff_1998_112.txt'
    },
    flagGranted: 'flag_found_diff_file',
    factsAdded: ['fact_case_1989_114_uncovered'],
    questionsAdded: ['q_what_was_case_1989_114'],
    leadsAdded: ['lead_unseal_case_1989_114'],
    hintLevel1: 'Check the Archive folder in Documents for diff files or text comparisons.',
    hintLevel2: 'Open /home/investigator/Documents/Archive/Redaction_Diff_1998_112.txt.',
    hintLevel3: 'The original unedited line reads: "Cross-referencing suspect modus operandi with CASE-1989-114."'
  },
  {
    id: 'step_46',
    act: 5,
    order: 46,
    title: 'Search PRIS for CASE-1989-114',
    description: 'Query CASE-1989-114 in PRIS to inspect its classified status.',
    trigger: {
      type: 'view_record',
      targetId: 'CASE-1989-114'
    },
    flagGranted: 'flag_viewed_case_1989_114',
    factsAdded: ['fact_case_1989_114_ia_probe'],
    questionsAdded: ['q_who_was_subject_of_ia_probe'],
    hintLevel1: 'Type "CASE-1989-114" into the PRIS Universal Search bar.',
    hintLevel2: 'Open Case record CASE-1989-114 in PRIS Cases.',
    hintLevel3: 'The docket is classified under "INTERNAL AFFAIRS // DIVISIONAL CORRUPTION".'
  },
  {
    id: 'step_47',
    act: 5,
    order: 47,
    title: 'Read Internal Affairs Summary for CASE-1989-114',
    description: 'Review the allegations of police-assisted freight diversion at the harbor depot.',
    trigger: {
      type: 'view_record',
      targetId: 'R-1989-088'
    },
    flagGranted: 'flag_read_ia_report',
    factsAdded: ['fact_ia_probe_freight_escorts'],
    questionsAdded: ['q_which_officer_provided_escorts'],
    timelineEventsAdded: ['evt_ia_investigation_1989'],
    hintLevel1: 'Open Report R-1989-088 attached to CASE-1989-114.',
    hintLevel2: 'Read the summary of the 1989 Internal Affairs probe.',
    hintLevel3: 'Officers were accused of providing off-duty patrol car escorts to Crownline Logistics trucks.'
  },
  {
    id: 'step_48',
    act: 5,
    order: 48,
    title: 'Identify Officers Named in the 1989 IA Probe',
    description: 'Discover that Officer Daniel Hayes and Officer John Mercer were the named suspects.',
    trigger: {
      type: 'search_term',
      searchTerm: 'escort squad'
    },
    flagGranted: 'flag_identified_ia_officers',
    factsAdded: ['fact_hayes_and_mercer_in_ia_probe'],
    questionsAdded: ['q_how_did_they_escape_charges'],
    hintLevel1: 'Search for "escort squad" or review the suspect officer roster on CASE-1989-114.',
    hintLevel2: 'The internal report names Patrolman Daniel Hayes and Detective John Mercer.',
    hintLevel3: 'Captain Arthur Vance quashed the inquiry in December 1989 citing "insufficient corroboration".'
  },
  {
    id: 'step_49',
    act: 5,
    order: 49,
    title: 'Connect the Motive for Anna’s Interception',
    description: 'Realize that Anna Bell’s inventory audit was about to expose the ongoing scheme.',
    trigger: {
      type: 'search_term',
      searchTerm: 'Vance quashed'
    },
    flagGranted: 'flag_connected_tampering_motive',
    factsAdded: ['fact_anna_threatened_entire_ring'],
    questionsAdded: ['q_what_happened_at_willow_street_that_night'],
    hintLevel1: 'Connect Anna’s audit of Bell Electronics to the 1989 freight protection ring.',
    hintLevel2: 'If Anna exposed Crownline, she exposed Daniel Mercer, Daniel Hayes, and Captain Vance.',
    hintLevel3: 'Anna’s audit threatened not just a warehouse supervisor, but high-ranking police brass.'
  },
  {
    id: 'step_50',
    act: 5,
    order: 50,
    title: 'Synthesize Act 5 Revelation',
    description: 'Confirm that the official case record was deliberately sanitized from within the police department.',
    trigger: {
      type: 'flag',
      targetId: 'flag_connected_tampering_motive',
      requiredFlags: ['flag_read_ia_report', 'flag_identified_ia_officers']
    },
    flagGranted: 'flag_act_5_completed',
    factsAdded: ['fact_act_5_synthesis'],
    questionsAdded: ['q_what_was_the_fatal_confrontation'],
    hintLevel1: 'Open your Investigation Notebook and review the Contradictions tab.',
    hintLevel2: 'Note how the 2004 audit alteration was intended to erase the connection to CASE-1989-114.',
    hintLevel3: 'Act 5 complete: Case 27 was covered up by the very detectives assigned to investigate it.'
  },

  // ================= ACT 6 =================
  {
    id: 'step_51',
    act: 6,
    order: 51,
    title: 'Inspect Hayes’ Sudden 2008 Resignation',
    description: 'Investigate the circumstances of Detective Daniel Hayes’ departure in 2008.',
    trigger: {
      type: 'view_webpage',
      targetId: 'http://news.northbridge-herald.local/archive/hayes-resignation-2008'
    },
    flagGranted: 'flag_read_hayes_resignation',
    factsAdded: ['fact_hayes_resigned_under_inquiry_2008'],
    questionsAdded: ['q_where_did_hayes_go_after_2008'],
    timelineEventsAdded: ['evt_hayes_resignation_2008'],
    hintLevel1: 'Check the Northbridge Herald news archives in the Browser for Daniel Hayes.',
    hintLevel2: 'Navigate to http://news.northbridge-herald.local/archive/hayes-resignation-2008.',
    hintLevel3: 'The article reports Hayes abruptly retired following a state inquiry into evidence locker tampering.'
  },
  {
    id: 'step_52',
    act: 6,
    order: 52,
    title: 'Check Evidence Vault B Access Log',
    description: 'Review physical vault checkouts for Case 27 in /var/log/audit/evidence_vault_access.log.',
    trigger: {
      type: 'view_file',
      targetId: '/var/log/audit/evidence_vault_access.log'
    },
    flagGranted: 'flag_checked_vault_log',
    factsAdded: ['fact_hayes_checked_out_case27_evidence'],
    questionsAdded: ['q_what_did_hayes_remove_from_vault'],
    hintLevel1: 'Look in /var/log/audit/ for evidence vault sign-out records.',
    hintLevel2: 'Open /var/log/audit/evidence_vault_access.log in File Manager or Terminal.',
    hintLevel3: 'Hayes checked out Evidence Box 27-B on November 1, 2008—the day before his departure.'
  },
  {
    id: 'step_53',
    act: 6,
    order: 53,
    title: 'Locate Canal Storage Locker CS-14',
    description: 'Cross-reference the Canal Storage facility records on the municipal business registry.',
    trigger: {
      type: 'search_term',
      searchTerm: 'Canal Storage'
    },
    flagGranted: 'flag_searched_canal_storage',
    factsAdded: ['fact_canal_storage_leased_to_anna'],
    questionsAdded: ['q_are_records_still_in_locker'],
    leadsAdded: ['lead_recover_locker_contents'],
    hintLevel1: 'Search for "Canal Storage" in PRIS or the municipal business database.',
    hintLevel2: 'Review location or business records for Canal Storage at 400 Canal Road.',
    hintLevel3: 'Locker CS-14 was rented under Anna Bell’s name on September 12, 1998—two days before vanishing.'
  },
  {
    id: 'step_54',
    act: 6,
    order: 54,
    title: 'Inspect Recovered Locker Ledger Transcript',
    description: 'Examine the unsealed ledger document preserved in the cold case evidence repository.',
    trigger: {
      type: 'view_record',
      targetId: 'E-004829'
    },
    flagGranted: 'flag_read_recovered_ledger',
    factsAdded: ['fact_ledger_proves_freight_kickbacks'],
    timelineEventsAdded: ['evt_ledger_recovered'],
    hintLevel1: 'Check PRIS Evidence for item E-004829, recently unsealed by Cold Case review.',
    hintLevel2: 'Open Evidence item E-004829 in PRIS Evidence.',
    hintLevel3: 'The ledger lists handwritten check numbers payable to "D. Hayes" and "J. Mercer" from Crownline.'
  },
  {
    id: 'step_55',
    act: 6,
    order: 55,
    title: 'Reconstruct the Night of Sept 14, 1998',
    description: 'Piece together the timeline from Bell Electronics to 42 Willow Street to Canal Road.',
    trigger: {
      type: 'search_term',
      searchTerm: 'timeline reconstruction'
    },
    flagGranted: 'flag_reconstructed_fatal_night',
    factsAdded: ['fact_reconstructed_full_timeline'],
    questionsAdded: ['q_ready_for_final_deduction'],
    hintLevel1: 'Open the Timelines section in your Investigation Notebook.',
    hintLevel2: 'Verify the sequence: 21:30 (Anna leaves) -> 22:15 (Diner sighting) -> 22:35 (Hayes intercepts) -> 23:10 (Car abandoned).',
    hintLevel3: 'Hayes used his squad car to intercept Anna at Willow Street, then drove her Taurus to Canal Road.'
  },
  {
    id: 'step_56',
    act: 6,
    order: 56,
    title: 'Identify the Perpetrator: Detective Daniel Hayes',
    description: 'Corroborate that Hayes was the sole actor with the motive, means, and access to cover his tracks.',
    trigger: {
      type: 'search_term',
      searchTerm: 'perpetrator Daniel Hayes'
    },
    flagGranted: 'flag_identified_hayes_perpetrator',
    factsAdded: ['fact_hayes_identified_as_actor'],
    hintLevel1: 'Who had knowledge of the 911 dispatch, access to the vehicle, and wrote both conflicting reports?',
    hintLevel2: 'Detective Daniel Hayes intercepted Anna before she could hand the records to the US Attorney.',
    hintLevel3: 'Hayes is conclusively identified by vehicle logs, patrol timestamps, and ledger kickback entries.'
  },
  {
    id: 'step_57',
    act: 6,
    order: 57,
    title: 'Verify Accomplices: Mercer & Vance',
    description: 'Establish the secondary culpability of Daniel Mercer (theft) and Captain Arthur Vance (coverup).',
    trigger: {
      type: 'search_term',
      searchTerm: 'Arthur Vance coverup'
    },
    flagGranted: 'flag_identified_accomplices',
    factsAdded: ['fact_vance_and_mercer_accomplices'],
    hintLevel1: 'Review the roles of Captain Arthur Vance and warehouse supervisor Daniel Mercer.',
    hintLevel2: 'Mercer coordinated the diversion; Vance scrubbed the official record in 2004.',
    hintLevel3: 'The three conspirators form a closed triangle of theft, homicide/disappearance, and institutional coverup.'
  },
  {
    id: 'step_58',
    act: 6,
    order: 58,
    title: 'Complete Investigation Notebook Review',
    description: 'Review all 10 tabs of the Investigation Notebook to ensure zero unresolved questions remain.',
    trigger: {
      type: 'flag',
      targetId: 'flag_identified_hayes_perpetrator',
      requiredFlags: ['flag_identified_accomplices', 'flag_read_recovered_ledger']
    },
    flagGranted: 'flag_notebook_fully_assembled',
    factsAdded: ['fact_all_evidence_gathered'],
    leadsAdded: ['lead_file_final_determination'],
    hintLevel1: 'Open your Investigation Notebook and check the Unresolved Questions tab.',
    hintLevel2: 'Ensure all primary leads and contradictions have been pursued.',
    hintLevel3: 'You are now fully prepared to submit the Final Case Determination.'
  },
  {
    id: 'step_59',
    act: 6,
    order: 59,
    title: 'Open Final Case Determination Board',
    description: 'Access the Case 27 Final Deduction Terminal to submit official investigative findings.',
    trigger: {
      type: 'view_record',
      targetId: 'FINAL_DEDUCTION_BOARD'
    },
    flagGranted: 'flag_opened_final_board',
    factsAdded: ['fact_final_board_accessed'],
    hintLevel1: 'Launch the Final Case Determination app from the desktop, dock, or notebook.',
    hintLevel2: 'Select the Case 27 Final Determination module.',
    hintLevel3: 'Enter your findings for WHO, WHAT, WHEN, WHERE, WHY, and HOW.'
  },
  {
    id: 'step_60',
    act: 6,
    order: 60,
    title: 'Submit Solved Case Determination',
    description: 'Submit the verified answers: Daniel Hayes, Homicide / Kidnapping, Sept 14 1998, Canal Road / Willow Street, Freight Theft Exposure, Interception via Patrol Car.',
    trigger: {
      type: 'flag',
      targetId: 'case_27_solved_correctly'
    },
    flagGranted: 'flag_case_27_officially_closed',
    factsAdded: ['fact_case_27_justice_served'],
    hintLevel1: 'Input the verified perpetrator, crime, motive, and key evidence items into the board.',
    hintLevel2: 'Perpetrator: Daniel Hayes. Motive: Exposure of freight theft kickbacks. Evidence: E-004821, E-004829, R-1998-112.',
    hintLevel3: 'Submit determination to complete Case 27 and view the official department closing debrief.'
  }
];

export const STORY_FACTS: StoryFact[] = [
  {
    id: 'fact_anna_disappearance_date',
    act: 1,
    category: 'CASE',
    text: 'Anna Claire Bell (age 26) disappeared on the evening of Monday, September 14, 1998, after leaving her workplace at Bell Electronics Components.',
    source: 'CASE-1998-027 Docket',
    relatedRecordIds: ['CASE-1998-027', 'P-004821']
  },
  {
    id: 'fact_anna_age_status',
    act: 1,
    category: 'PERSON',
    text: 'Anna Bell was an auditor and hardware technician with no prior criminal record, residing at 42 Willow Street in Northbridge.',
    source: 'Person Profile P-004821',
    relatedRecordIds: ['P-004821', 'LOC-0042']
  },
  {
    id: 'fact_last_seen_willow',
    act: 1,
    category: 'LOCATION',
    text: 'Report R-1998-112 identifies 42 Willow Street as the primary residence and last documented destination of the victim.',
    source: 'Report #R-1998-112',
    relatedRecordIds: ['R-1998-112', 'LOC-0042']
  },
  {
    id: 'fact_taurus_plate_txr481',
    act: 1,
    category: 'VEHICLE',
    text: 'Anna was driving a midnight blue 1987 Ford Taurus bearing New Jersey license plate TXR-481 on the night she vanished.',
    source: 'Report #R-1998-112',
    relatedRecordIds: ['R-1998-112', 'VEH-1987-0481']
  },
  {
    id: 'fact_time_divergence_2217_vs_2240',
    act: 1,
    category: 'TIMELINE',
    text: 'The initial CAD dispatch records a neighbor call at 22:17, while Detective Hayes’ report asserts he did not arrive or observe activity until 22:40.',
    source: 'CAD Log INC-1998-0914 vs R-1998-112',
    relatedRecordIds: ['INC-1998-0914', 'R-1998-112']
  },
  {
    id: 'fact_hayes_supplemental_narrative',
    act: 1,
    category: 'CASE',
    text: 'Supplemental Report R-1998-114 shifts the estimated timeline and claims the residence was secure with no signs of struggle.',
    source: 'Report #R-1998-114',
    relatedRecordIds: ['R-1998-114']
  },
  {
    id: 'fact_hayes_badge_3014',
    act: 1,
    category: 'PERSON',
    text: 'Detective Daniel Hayes (Badge #3014) was assigned as lead investigator on Case 27 less than 12 hours after the initial 911 call.',
    source: 'Officer Record OFF-3014',
    relatedRecordIds: ['OFF-3014', 'CASE-1998-027']
  },
  {
    id: 'fact_hayes_transferred_2008',
    act: 1,
    category: 'PERSON',
    text: 'Detective Hayes requested transfer and subsequently retired in 2008 following internal inquiries into evidence sign-outs.',
    source: 'Officer Record OFF-3014',
    relatedRecordIds: ['OFF-3014']
  },
  {
    id: 'fact_hayes_handled_1991_case',
    act: 1,
    category: 'CASE',
    text: 'Hayes had previously worked CASE-1991-081 involving industrial inventory loss in the same waterfront commercial corridor.',
    source: 'CASE-1991-081 Docket',
    relatedRecordIds: ['CASE-1991-081', 'OFF-3014']
  },
  {
    id: 'fact_willow_burglary_1987',
    act: 1,
    category: 'LOCATION',
    text: 'In 1987, an unsolved burglary occurred at 42 Willow Street (CASE-1987-014), investigated by Detective John Mercer.',
    source: 'Location Record LOC-0042',
    relatedRecordIds: ['LOC-0042', 'CASE-1987-014']
  },
  {
    id: 'fact_case_1987_crownline_connection',
    act: 1,
    category: 'CASE',
    text: 'The 1987 burglary targeted shipping ledgers belonging to Crownline Logistics, who had leased storage space on Willow Street.',
    source: 'CASE-1987-014 Docket',
    relatedRecordIds: ['CASE-1987-014', 'ORG-0044']
  },
  {
    id: 'fact_crownline_transport_overlap',
    act: 1,
    category: 'CASE',
    text: 'Crownline Logistics was the primary freight hauler contracted by Bell Electronics Components up until Bell’s closure.',
    source: 'Organization ORG-0012 & ORG-0044',
    relatedRecordIds: ['ORG-0012', 'ORG-0044']
  },
  {
    id: 'fact_act_1_synthesis',
    act: 1,
    category: 'CASE',
    text: 'REVELATION: Case 27 is intimately tied to a pre-existing nexus between Crownline Logistics, 42 Willow Street, and officers in the Detective Bureau.',
    source: 'Investigator Synthesis',
    relatedRecordIds: ['CASE-1998-027', 'LOC-0042', 'OFF-3014']
  },

  // ACT 2 FACTS
  {
    id: 'fact_gable_heard_car_door',
    act: 2,
    category: 'PERSON',
    text: 'Martha Gable heard a heavy vehicle door slam and tires accelerate abruptly outside 42 Willow Street around 22:45.',
    source: 'Witness Statement P-002891',
    relatedRecordIds: ['P-002891', 'LOC-0042']
  },
  {
    id: 'fact_leo_vance_saw_anna',
    act: 2,
    category: 'PERSON',
    text: 'Diner clerk Leo Vance observed Anna leaving Bell Electronics parking lot in the blue Taurus alone at approximately 22:15.',
    source: 'Witness Statement P-003102',
    relatedRecordIds: ['P-003102', 'ORG-0012']
  },
  {
    id: 'fact_witness_timeline_disagreement',
    act: 2,
    category: 'TIMELINE',
    text: 'A 30-minute unaccounted time window exists between Anna leaving work (22:15) and activity outside her residence (22:45).',
    source: 'Timeline Comparison',
    relatedRecordIds: ['P-003102', 'P-002891']
  },
  {
    id: 'fact_dispatch_unlogged_transmission',
    act: 2,
    category: 'TIMELINE',
    text: 'At 22:38, an unidentified patrol unit broadcast: "Code 4 on Willow, subject vehicle is pulling over." No incident number was assigned.',
    source: 'Dispatch Log dispatch_19980914.log',
    relatedRecordIds: ['INC-1998-0914']
  },
  {
    id: 'fact_suspicious_vehicle_call',
    act: 2,
    category: 'INCIDENT',
    text: 'Incident INC-1998-0915 was logged at 22:41 regarding a sedan matching the Taurus parked partially across the sidewalk.',
    source: 'Incident INC-1998-0915',
    relatedRecordIds: ['INC-1998-0915', 'VEH-1987-0481']
  },
  {
    id: 'fact_plate_search_executed',
    act: 2,
    category: 'VEHICLE',
    text: 'Plate TXR-481 was run through the state police teletype three times between 22:42 and 23:05 on the night of the incident.',
    source: 'DMV Query Logs',
    relatedRecordIds: ['VEH-1987-0481']
  },
  {
    id: 'fact_vehicle_specs_taurus',
    act: 2,
    category: 'VEHICLE',
    text: '1987 Ford Taurus GL, VIN: 1FALP52U8HA109842, registered address 42 Willow Street.',
    source: 'VEH-1987-0481 Record',
    relatedRecordIds: ['VEH-1987-0481']
  },
  {
    id: 'fact_vehicle_found_canal_road',
    act: 2,
    category: 'VEHICLE',
    text: 'The vehicle was recovered 18 days later abandoned on the Canal Road culvert with keys missing and glovebox emptied.',
    source: 'VEH-1987-0481 Impound Sheet',
    relatedRecordIds: ['VEH-1987-0481', 'LOC-0400']
  },
  {
    id: 'fact_evidence_cassette_keys',
    act: 2,
    category: 'EVIDENCE',
    text: 'Evidence item E-004821 comprises a brass locker key stamped "CS-14" and an unlabeled micro-cassette recovered beneath the passenger seat.',
    source: 'Evidence Log E-004821',
    relatedRecordIds: ['E-004821', 'CASE-1998-027']
  },
  {
    id: 'fact_cassette_contained_dictation',
    act: 2,
    category: 'EVIDENCE',
    text: 'Crime lab examination of E-004823 recovered audio dictation of Anna stating Crownline invoices were falsified to mask stolen microcircuits.',
    source: 'Forensic Lab Brief E-004823',
    relatedRecordIds: ['E-004823']
  },
  {
    id: 'fact_act_2_synthesis',
    act: 2,
    category: 'CASE',
    text: 'REVELATION: Anna was pulled over near Willow Street at 22:38, her vehicle was relocated to Canal Road, and physical evidence confirms she held proof of corporate theft.',
    source: 'Investigator Synthesis',
    relatedRecordIds: ['VEH-1987-0481', 'E-004821', 'E-004823']
  },

  // ACT 3 FACTS
  {
    id: 'fact_taurus_owned_by_michael',
    act: 3,
    category: 'PERSON',
    text: 'The Ford Taurus was legally owned by Michael Bell, Anna’s older brother, who lent it to her while her car underwent repair.',
    source: 'VEH-1987-0481 & P-004822',
    relatedRecordIds: ['VEH-1987-0481', 'P-004822']
  },
  {
    id: 'fact_michael_bell_alibi_shift',
    act: 3,
    category: 'PERSON',
    text: 'Michael Bell worked an overnight rail yard maintenance shift from 21:45 to 06:00, confirmed by supervisor timesheets.',
    source: 'Person Profile P-004822',
    relatedRecordIds: ['P-004822']
  },
  {
    id: 'fact_michael_stated_anna_frightened',
    act: 3,
    category: 'PERSON',
    text: 'Michael testified during questioning that Anna called him Sunday evening, sounding terrified of warehouse management.',
    source: 'Interview Report R-1998-129',
    relatedRecordIds: ['R-1998-129', 'P-004822']
  },
  {
    id: 'fact_michael_timecard_verified',
    act: 3,
    category: 'TIMELINE',
    text: 'Railway timecard punch logs conclusively rule out Michael Bell as a suspect in the abduction or car relocation.',
    source: 'Rail Yard Records',
    relatedRecordIds: ['P-004822']
  },
  {
    id: 'fact_bell_electronics_profile',
    act: 3,
    category: 'CASE',
    text: 'Bell Electronics Components was an OEM semiconductor assembly subcontractor operating out of 104 Waterfront Way.',
    source: 'Organization ORG-0012',
    relatedRecordIds: ['ORG-0012']
  },
  {
    id: 'fact_mercer_warehouse_manager',
    act: 3,
    category: 'PERSON',
    text: 'Daniel Mercer was the warehouse supervisor at Bell Electronics who had absolute authority over shipping manifests.',
    source: 'Person Profile P-006219',
    relatedRecordIds: ['P-006219', 'ORG-0012']
  },
  {
    id: 'fact_mercer_prior_arrests',
    act: 3,
    category: 'PERSON',
    text: 'Daniel Mercer had a 1987 arrest record for receiving stolen electronics merchandise, charges dropped under dubious circumstances.',
    source: 'Criminal History P-006219',
    relatedRecordIds: ['P-006219', 'CASE-1987-014']
  },
  {
    id: 'fact_mercer_nephew_of_detective',
    act: 3,
    category: 'PERSON',
    text: 'Daniel Mercer is the blood nephew of Detective John Mercer (OFF-1044), who investigated the 1987 Crownline burglary.',
    source: 'Personnel Cross-Reference',
    relatedRecordIds: ['P-006219', 'OFF-1044']
  },
  {
    id: 'fact_evelyn_reed_auditor_peer',
    act: 3,
    category: 'PERSON',
    text: 'Evelyn Reed was Anna’s co-worker in accounting and corroborated that discrepancies had been detected in export accounts.',
    source: 'Person Profile P-005118',
    relatedRecordIds: ['P-005118', 'ORG-0012']
  },
  {
    id: 'fact_friday_altercation_warehouse',
    act: 3,
    category: 'PERSON',
    text: 'On Friday, Sept 11, Anna confronted Mercer on the warehouse loading dock, threatening to hand audit books to federal investigators.',
    source: 'Evelyn Reed Interview',
    relatedRecordIds: ['P-005118', 'P-006219']
  },
  {
    id: 'fact_act_3_synthesis',
    act: 3,
    category: 'CASE',
    text: 'REVELATION: Daniel Mercer had direct motive to silence Anna. He possessed deep family ties to senior police detectives.',
    source: 'Investigator Synthesis',
    relatedRecordIds: ['P-006219', 'OFF-1044', 'CASE-1998-027']
  },

  // ACT 4 FACTS
  {
    id: 'fact_bell_closed_2003_bankruptcy',
    act: 4,
    category: 'ARCHIVE',
    text: 'Bell Electronics declared bankruptcy in late 2003 amidst widening state forensic auditing and federal tariff inquiries.',
    source: 'Northbridge Herald (2003-11-14)',
    relatedRecordIds: ['ORG-0012']
  },
  {
    id: 'fact_liquidation_uncovered_phantom_shipments',
    act: 4,
    category: 'ARCHIVE',
    text: 'Bankruptcy trustees identified over $2.4 million in unaccounted inventory shipped to shell entities care of Crownline Logistics.',
    source: 'Northbridge Court Filings',
    relatedRecordIds: ['ORG-0012', 'ORG-0044']
  },
  {
    id: 'fact_forum_discussion_crownline',
    act: 4,
    category: 'ARCHIVE',
    text: 'Archived community forum posts from 2004 discuss night shipments escorted by marked patrol vehicles leaving the harbor.',
    source: 'MetroForum Thread #941',
    relatedRecordIds: ['ORG-0044']
  },
  {
    id: 'fact_exauditor_allegations',
    act: 4,
    category: 'ARCHIVE',
    text: 'Whistleblower "ExAuditor" stated that management removed blue financial folders from Anna’s desk before police arrived on Sept 15.',
    source: 'MetroForum Post #14',
    relatedRecordIds: ['P-005118']
  },
  {
    id: 'fact_reed_subpoena_1999',
    act: 4,
    category: 'ARCHIVE',
    text: 'Evelyn Reed was issued Subpoena SUB-1999-042 by the county grand jury in October 1999, but her testimony was withheld from Case 27.',
    source: 'Court Portal SUB-1999-042',
    relatedRecordIds: ['P-005118']
  },
  {
    id: 'fact_subpoena_missing_from_pris',
    act: 4,
    category: 'ARCHIVE',
    text: 'Subpoena SUB-1999-042 was purged from the central PRIS registry during the 2004 archive database migration.',
    source: 'PRIS Audit Database',
    relatedRecordIds: ['P-005118']
  },
  {
    id: 'fact_found_reed_unindexed_statement',
    act: 4,
    category: 'ARCHIVE',
    text: 'An unindexed copy of Reed’s deposition was preserved in /home/investigator/Documents/Archive/Unindexed_Depositions.txt.',
    source: 'Workstation VFS Archive',
    relatedRecordIds: ['P-005118']
  },
  {
    id: 'fact_anna_hid_duplicate_ledgers',
    act: 4,
    category: 'ARCHIVE',
    text: 'Reed revealed that Anna anticipated foul play and concealed duplicate carbon ledgers inside an off-site locker near Canal Road.',
    source: 'Unindexed_Depositions.txt',
    relatedRecordIds: ['P-005118', 'E-004821']
  },
  {
    id: 'fact_brass_key_stamped_canal_lockers',
    act: 4,
    category: 'EVIDENCE',
    text: 'Evidence item E-004821 key fob "CS-14" corresponds to Locker 14 at Canal Storage (400 Canal Road), never opened during the 1998 probe.',
    source: 'Evidence Analysis E-004821',
    relatedRecordIds: ['E-004821', 'LOC-0400']
  },
  {
    id: 'fact_act_4_synthesis',
    act: 4,
    category: 'CASE',
    text: 'REVELATION: Lead detectives deliberately failed to execute a warrant on Locker CS-14, ensuring Anna’s proof remained locked away.',
    source: 'Investigator Synthesis',
    relatedRecordIds: ['E-004821', 'OFF-3014']
  },

  // ACT 5 FACTS
  {
    id: 'fact_audit_date_2004_confirmed',
    act: 5,
    category: 'ARCHIVE',
    text: 'Report R-1998-112 was altered on June 3, 2004, exactly four days before the county records archive was digitized.',
    source: 'Report R-1998-112 Audit Header',
    relatedRecordIds: ['R-1998-112']
  },
  {
    id: 'fact_audit_user_admin_vance',
    act: 5,
    category: 'ARCHIVE',
    text: 'System log audit_trail_2004.log reveals terminal WS-01 logged under credentials of Captain Arthur Vance executed the deletion.',
    source: 'Log /var/log/audit/audit_trail_2004.log',
    relatedRecordIds: ['OFF-1012']
  },
  {
    id: 'fact_captain_vance_supervisor_hayes',
    act: 5,
    category: 'PERSON',
    text: 'Captain Arthur Vance (OFF-1012) served as Detective Bureau Commander from 1990 to 2006, overseeing all homicide assignments.',
    source: 'Officer Dossier OFF-1012',
    relatedRecordIds: ['OFF-1012']
  },
  {
    id: 'fact_ia_reference_suppressed',
    act: 5,
    category: 'ARCHIVE',
    text: 'The suppressed section in Report R-1998-112 specifically expunged cross-references to Internal Affairs Case CASE-1989-114.',
    source: 'Redaction Analysis R-1998-112',
    relatedRecordIds: ['R-1998-112', 'CASE-1989-114']
  },
  {
    id: 'fact_case_1989_114_uncovered',
    act: 5,
    category: 'CASE',
    text: 'CASE-1989-114 was a classified Internal Affairs inquiry into police officers receiving cash kickbacks from Crownline Logistics.',
    source: 'CASE-1989-114 Docket',
    relatedRecordIds: ['CASE-1989-114']
  },
  {
    id: 'fact_ia_probe_freight_escorts',
    act: 5,
    category: 'CASE',
    text: 'Report R-1989-088 documents that patrol cars escorted Crownline freight out of restricted dock areas without customs manifests.',
    source: 'Report R-1989-088',
    relatedRecordIds: ['R-1989-088']
  },
  {
    id: 'fact_hayes_and_mercer_in_ia_probe',
    act: 5,
    category: 'PERSON',
    text: 'Officers Daniel Hayes and John Mercer were the two primary subjects of the 1989 IA probe, protected from indictment by Vance.',
    source: 'Report R-1989-088',
    relatedRecordIds: ['OFF-3014', 'OFF-1044', 'OFF-1012']
  },
  {
    id: 'fact_anna_threatened_entire_ring',
    act: 5,
    category: 'CASE',
    text: 'Anna Bell’s accounting audits directly linked the 1998 semiconductor theft to the exact same Crownline kickback network.',
    source: 'Cross-Case Analysis',
    relatedRecordIds: ['CASE-1998-027', 'CASE-1989-114']
  },
  {
    id: 'fact_act_5_synthesis',
    act: 5,
    category: 'CASE',
    text: 'REVELATION: The tampering on Case 27 was performed by Captain Arthur Vance in 2004 to shield himself, Hayes, and Mercer from exposure.',
    source: 'Investigator Synthesis',
    relatedRecordIds: ['OFF-1012', 'OFF-3014', 'CASE-1998-027']
  },

  // ACT 6 FACTS
  {
    id: 'fact_hayes_resigned_under_inquiry_2008',
    act: 6,
    category: 'PERSON',
    text: 'Detective Hayes abruptly resigned on November 2, 2008, when state prosecutors reopened an audit of the central evidence lockers.',
    source: 'Northbridge Herald (2008-11-04)',
    relatedRecordIds: ['OFF-3014']
  },
  {
    id: 'fact_hayes_checked_out_case27_evidence',
    act: 6,
    category: 'EVIDENCE',
    text: 'Vault log evidence_vault_access.log confirms Hayes accessed and removed Case 27 materials on his final day with the department.',
    source: 'Evidence Vault Access Log',
    relatedRecordIds: ['OFF-3014', 'E-004821']
  },
  {
    id: 'fact_canal_storage_leased_to_anna',
    act: 6,
    category: 'LOCATION',
    text: 'Canal Storage locker CS-14 remained sealed under municipal warrant until Cold Case review authorized an emergency lock-cut in 2026.',
    source: 'Location LOC-0400',
    relatedRecordIds: ['LOC-0400', 'E-004829']
  },
  {
    id: 'fact_ledger_proves_freight_kickbacks',
    act: 6,
    category: 'EVIDENCE',
    text: 'Item E-004829 recovered from CS-14 contains original duplicate manifests with Daniel Hayes’ personal signature acknowledging receipt.',
    source: 'Evidence E-004829',
    relatedRecordIds: ['E-004829', 'OFF-3014']
  },
  {
    id: 'fact_reconstructed_full_timeline',
    act: 6,
    category: 'TIMELINE',
    text: 'At 22:38 on Sept 14, 1998, Hayes pulled Anna over at Willow Street, forced her into his patrol unit, staged her car at Canal Road, and concealed the incident.',
    source: 'Forensic Reconstruction',
    relatedRecordIds: ['OFF-3014', 'P-004821', 'VEH-1987-0481']
  },
  {
    id: 'fact_hayes_identified_as_actor',
    act: 6,
    category: 'PERSON',
    text: 'Conclusive evidence establishes Daniel Hayes as the perpetrator who abducted Anna Bell to prevent federal exposure of the freight ring.',
    source: 'Final Determination Brief',
    relatedRecordIds: ['OFF-3014', 'P-004821']
  },
  {
    id: 'fact_vance_and_mercer_accomplices',
    act: 6,
    category: 'PERSON',
    text: 'Captain Arthur Vance and Daniel Mercer are verified co-conspirators in obstruction of justice and commercial theft.',
    source: 'Final Determination Brief',
    relatedRecordIds: ['OFF-1012', 'P-006219']
  },
  {
    id: 'fact_all_evidence_gathered',
    act: 6,
    category: 'CASE',
    text: 'All required investigative documentation, timestamps, physical evidence, and motives have been corroborated.',
    source: 'Notebook Assembly',
    relatedRecordIds: ['CASE-1998-027']
  },
  {
    id: 'fact_final_board_accessed',
    act: 6,
    category: 'CASE',
    text: 'The Case 27 Final Deduction Terminal is active and awaiting official investigator submission.',
    source: 'Deduction Terminal',
    relatedRecordIds: ['CASE-1998-027']
  },
  {
    id: 'fact_case_27_justice_served',
    act: 6,
    category: 'CASE',
    text: 'CASE CLOSED: The 28-year mystery of Anna Claire Bell is formally resolved with warrants referred to the State Attorney General.',
    source: 'Official Department Decree',
    relatedRecordIds: ['CASE-1998-027']
  }
];

export const UNRESOLVED_QUESTIONS: UnresolvedQuestion[] = [
  {
    id: 'q_why_audit_modification',
    act: 1,
    text: 'Why was an inactive case file (R-1998-112) modified in June 2004, nearly six years after it was archived?',
    context: 'Routine database audit detected an index modification with a missing attachment.'
  },
  {
    id: 'q_why_case_closed_early',
    act: 1,
    text: 'Why was Case 27 suspended in January 1999 without executing standard forensic search warrants on associates?',
    context: 'The investigation was closed in less than four months despite no body or definitive conclusion.'
  },
  {
    id: 'q_where_did_vehicle_go',
    act: 1,
    text: 'Where was the Ford Taurus (TXR-481) between its disappearance on Sept 14 and recovery at Canal Road 18 days later?',
    context: 'Initial reports state the vehicle was missing from Willow Street on the morning of Sept 15.'
  },
  {
    id: 'q_why_time_difference',
    act: 1,
    text: 'Why does the initial CAD dispatch record 22:17, while Hayes’ report claims 22:40 arrival?',
    context: 'A 23-minute discrepancy exists in the primary official response timeline.'
  },
  {
    id: 'q_who_authorized_supplemental',
    act: 1,
    text: 'Who authorized Supplemental Report R-1998-114, which eliminated references to suspicious sounds reported by neighbors?',
    context: 'The supplemental report minimizes the possibility of an abduction outside 42 Willow Street.'
  },
  {
    id: 'q_why_did_hayes_transfer',
    act: 1,
    text: 'Why did Detective Daniel Hayes request a sudden transfer out of Major Crimes after handling Case 27?',
    context: 'Hayes had been a rising investigator commended for forensic diligence in 1997.'
  },
  {
    id: 'q_mercer_connection_to_officer_mercer',
    act: 3,
    text: 'Is warehouse manager Daniel Mercer related to Detective John Mercer, the original 1987 burglary investigator?',
    context: 'Both individuals share a surname and appear in dockets involving Crownline Logistics.'
  },
  {
    id: 'q_who_was_captain_vance_protecting',
    act: 5,
    text: 'Why would Captain Arthur Vance personally access the records terminal in 2004 to redact Case 27?',
    context: 'Division commanders rarely perform clerical record modifications unless hiding departmental exposure.'
  },
  {
    id: 'q_what_was_in_locker_cs14',
    act: 4,
    text: 'What was stored inside Canal Storage Locker CS-14 that prompted Anna to carry its key fob until the end?',
    context: 'The brass key recovered in the Taurus was never cataloged as an active search lead.'
  }
];

export const CONTRADICTIONS: Contradiction[] = [
  {
    id: 'contra_timeline_willow',
    title: 'Discrepancy in Responding Officer Timestamps',
    sourceA: {
      recordId: 'INC-1998-0914',
      label: 'CAD Dispatch Log #914',
      statement: 'Unit 3-Bravo dispatched to 42 Willow Street at 22:17 following auditory neighbor report.',
      timestamp: '1998-09-14 22:17:00'
    },
    sourceB: {
      recordId: 'R-1998-112',
      label: 'Detective Hayes Scene Report',
      statement: 'Detective Hayes arrived at 42 Willow Street at approximately 22:40 hours; street was quiet.',
      timestamp: '1998-09-14 22:40:00'
    },
    explanation: 'A 23-minute gap exists between the dispatch call and Hayes’ recorded presence on Willow Street. Hayes concealed that he was already on scene at 22:38.',
    category: 'TIMELINE'
  },
  {
    id: 'contra_witness_timing',
    title: 'Workplace Departure vs. Residential Sighting Timing',
    sourceA: {
      recordId: 'P-003102',
      label: 'Leo Vance (Diner Clerk) Statement',
      statement: 'Saw Anna Bell driving out of Bell Electronics lot onto Grand Avenue at exactly 22:15.',
      timestamp: '1998-09-14 22:15:00'
    },
    sourceB: {
      recordId: 'P-002891',
      label: 'Martha Gable (Neighbor) Statement',
      statement: 'Heard the vehicle arrive outside 42 Willow Street at 22:45, followed by shouting and a slammed door.',
      timestamp: '1998-09-14 22:45:00'
    },
    explanation: 'The driving distance between Bell Electronics and 42 Willow Street is 1.8 miles (under 6 minutes). Anna was intercepted or delayed for nearly half an hour.',
    category: 'ALIBI'
  },
  {
    id: 'contra_mercer_employment',
    title: 'Mercer Clean Criminal Record Claim vs. 1987 Arrest Docket',
    sourceA: {
      recordId: 'R-1998-114',
      label: 'Hayes Canvass Summary',
      statement: 'Warehouse staff examined; Daniel Mercer confirmed to possess clean record and exemplary tenure.',
      timestamp: '1998-09-18 11:00:00'
    },
    sourceB: {
      recordId: 'CASE-1987-014',
      label: '1987 Crownline Burglary Docket',
      statement: 'Suspect Daniel Mercer booked on felony larceny charges regarding diverted electronics freight.',
      timestamp: '1987-03-12 14:20:00'
    },
    explanation: 'Detective Hayes deliberately lied in his official report, claiming Mercer had a clean record when Hayes’ own division had arrested him a decade prior.',
    category: 'PROCEDURE'
  },
  {
    id: 'contra_michael_alibi_punchcard',
    title: 'Initial Suspect Focus vs. Verified Railway Timecards',
    sourceA: {
      recordId: 'R-1998-129',
      label: 'Hayes Interrogation of Michael Bell',
      statement: 'Michael Bell cannot satisfactorily account for his movements between 22:00 and midnight.',
      timestamp: '1998-09-17 16:30:00'
    },
    sourceB: {
      recordId: 'P-004822',
      label: 'Municipal Rail Yard Punch Records',
      statement: 'Badge #492 (M. Bell) clocked in at 21:45 at Bay 4 switch tower and remained until 06:00.',
      timestamp: '1998-09-14 21:45:00'
    },
    explanation: 'Hayes attempted to frame or cast suspicion onto Anna’s brother Michael despite incontrovertible timecard proof that Michael was at work.',
    category: 'ALIBI'
  }
];

export const TIMELINE_EVENTS: InvestigationTimelineEvent[] = [
  {
    id: 'evt_anna_shift_end',
    date: '1998-09-14',
    time: '21:30',
    timestampFormatted: 'Sept 14, 1998 - 21:30',
    location: 'Bell Electronics Components, 104 Waterfront Way',
    personsInvolved: ['Anna Claire Bell', 'Evelyn Reed'],
    description: 'Anna concludes her evening inventory audit, copies data onto micro-cassette and carbon sheets.',
    source: 'Timecard & Evelyn Reed Deposition',
    sourceRecordId: 'ORG-0012',
    confidence: 'WITNESS_STATEMENT'
  },
  {
    id: 'evt_leo_vance_departure',
    date: '1998-09-14',
    time: '22:15',
    timestampFormatted: 'Sept 14, 1998 - 22:15',
    location: 'Grand Avenue Diner intersection',
    personsInvolved: ['Anna Claire Bell', 'Leo Vance'],
    description: 'Anna is observed driving her blue 1987 Ford Taurus onto Grand Avenue heading towards Willow Street.',
    source: 'Witness Statement Leo Vance',
    sourceRecordId: 'P-003102',
    confidence: 'WITNESS_STATEMENT'
  },
  {
    id: 'evt_radio_traffic_willow',
    date: '1998-09-14',
    time: '22:38',
    timestampFormatted: 'Sept 14, 1998 - 22:38',
    location: 'Intersection of Willow & 4th Avenue',
    personsInvolved: ['Detective Daniel Hayes', 'Anna Claire Bell'],
    description: 'Unidentified patrol radio transmission: "Code 4 on Willow, subject vehicle pulling over." Patrol car activates emergency flashers.',
    source: 'Dispatch Log dispatch_19980914.log',
    sourceRecordId: 'INC-1998-0914',
    confidence: 'DISPATCH_VERIFIED',
    hasConflict: true,
    conflictDetails: 'Hayes’ written report claims he did not arrive until 22:40 and saw nobody.'
  },
  {
    id: 'evt_gable_audio_witness',
    date: '1998-09-14',
    time: '22:45',
    timestampFormatted: 'Sept 14, 1998 - 22:45',
    location: '42 Willow Street Driveway',
    personsInvolved: ['Anna Claire Bell', 'Daniel Hayes'],
    description: 'Martha Gable overhears loud voices: "You have no right to take those files." Heavy car door slams; vehicle speeds away.',
    source: 'Witness Statement Martha Gable',
    sourceRecordId: 'P-002891',
    confidence: 'WITNESS_STATEMENT'
  },
  {
    id: 'evt_vehicle_found_canal',
    date: '1998-10-02',
    time: '08:20',
    timestampFormatted: 'Oct 02, 1998 - 08:20',
    location: 'Canal Road Culvert, turnoff near Canal Storage',
    personsInvolved: ['Patrol Officer Kowalski', 'Daniel Hayes'],
    description: '1987 Ford Taurus (TXR-481) recovered abandoned in muddy embankment. Keys missing, glovebox emptied.',
    source: 'Vehicle Recovery Sheet VEH-1987-0481',
    sourceRecordId: 'VEH-1987-0481',
    confidence: 'OFFICIAL_LOG'
  },
  {
    id: 'evt_record_tampered_2004',
    date: '2004-06-03',
    time: '14:22',
    timestampFormatted: 'June 03, 2004 - 14:22',
    location: 'Northbridge Police Headquarters, Workstation WS-01',
    personsInvolved: ['Captain Arthur Vance'],
    description: 'Captain Vance logs into records database, scrubs Attachment Index on Report R-1998-112, expunging IA case cross-references.',
    source: 'Audit Log audit_trail_2004.log',
    sourceRecordId: 'OFF-1012',
    confidence: 'OFFICIAL_LOG'
  },
  {
    id: 'evt_hayes_resignation_2008',
    date: '2008-11-02',
    time: '09:00',
    timestampFormatted: 'Nov 02, 2008 - 09:00',
    location: 'Northbridge Police Headquarters',
    personsInvolved: ['Detective Daniel Hayes'],
    description: 'Hayes abruptly resigns from the police force following an unannounced audit of evidence lockers by the State Attorney General.',
    source: 'Northbridge Herald (Nov 4, 2008)',
    sourceRecordId: 'OFF-3014',
    confidence: 'OFFICIAL_LOG'
  }
];

export const INVESTIGATION_LEADS: InvestigationLead[] = [
  {
    id: 'lead_initial_case_review',
    title: 'Review Original Case Docket CASE-1998-027',
    description: 'Open the reopened case file in PRIS and review the circumstances of Anna Bell’s disappearance.',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    suggestedAction: 'Open CASE-1998-027 in PRIS Records.',
    relatedRecordId: 'CASE-1998-027'
  },
  {
    id: 'lead_cross_ref_willow',
    title: 'Investigate Past History of 42 Willow Street',
    description: 'Check the location registry for 42 Willow Street to see what other dockets occurred there.',
    status: 'ACTIVE',
    priority: 'HIGH',
    suggestedAction: 'Search LOC-0042 in PRIS Locations.',
    relatedRecordId: 'LOC-0042'
  },
  {
    id: 'lead_trace_vehicle_history',
    title: 'Trace Movements of 1987 Ford Taurus (TXR-481)',
    description: 'Locate vehicle logs, registered owner details, and the Canal Road recovery sheet.',
    status: 'ACTIVE',
    priority: 'HIGH',
    suggestedAction: 'Open VEH-1987-0481 in PRIS Vehicles.',
    relatedRecordId: 'VEH-1987-0481'
  },
  {
    id: 'lead_inspect_bell_electronics',
    title: 'Inspect Bell Electronics Corporate Dossier',
    description: 'Investigate Bell Electronics (ORG-0012) and identify managers with access to shipping manifests.',
    status: 'ACTIVE',
    priority: 'NORMAL',
    suggestedAction: 'Look up ORG-0012 in PRIS Organizations.',
    relatedRecordId: 'ORG-0012'
  },
  {
    id: 'lead_unseal_case_1989_114',
    title: 'Examine Internal Affairs Docket CASE-1989-114',
    description: 'Read the classified internal affairs report regarding police escorts for Crownline Logistics.',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    suggestedAction: 'Open CASE-1989-114 and Report R-1989-088.',
    relatedRecordId: 'CASE-1989-114'
  },
  {
    id: 'lead_check_canal_storage',
    title: 'Investigate Canal Storage Locker CS-14',
    description: 'Cross-reference Evidence item E-004821 brass key with the storage facility at 400 Canal Road.',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    suggestedAction: 'Review Evidence E-004821 and unseal E-004829.',
    relatedRecordId: 'E-004821'
  }
];

export const FINAL_DEDUCTION_SOLUTION = {
  whoSuspectId: 'OFF-3014', // Detective Daniel Hayes
  whatCrimeType: 'HOMICIDE_ABDUCTION', // Abduction / Second Degree Murder / Tampering
  whenDate: '1998-09-14',
  whereLocationId: 'LOC-0042', // 42 Willow Street / Canal Road
  whyMotive: 'SILENCE_AUDIT_EXPOSURE', // Exposure of Crownline freight theft kickbacks
  howMethod: 'POLICE_PULLOVER_INTERCEPTION', // Used patrol vehicle to stop victim and stage crime scene
  keyEvidenceIds: ['E-004821', 'E-004823', 'E-004829', 'R-1998-112', 'CASE-1989-114']
};
