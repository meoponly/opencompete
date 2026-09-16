import { Community, Group, Message, Resource, StudySession } from '../types';

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm_1',
    name: 'JEE Advanced 2027',
    slug: 'jee-advanced-2027',
    description: 'Top-tier cohort grinding Physics, Chemistry & Mathematics for IIT-JEE.',
    iconName: 'Flame',
    createdAt: '2026-01-01T00:00:00Z',
    groupCount: 2,
  },
  {
    id: 'comm_2',
    name: 'Algorithms & Systems Guild',
    slug: 'algorithms-guild',
    description: 'Competitive programming, systems engineering, distributed computing & ICPC.',
    iconName: 'Terminal',
    createdAt: '2026-01-05T00:00:00Z',
    groupCount: 2,
  },
  {
    id: 'comm_3',
    name: 'Pre-Med & USMLE Cohort',
    slug: 'premed-usmle',
    description: 'Anki power users, pathology & pharmacology mastery group.',
    iconName: 'Activity',
    createdAt: '2026-01-12T00:00:00Z',
    groupCount: 1,
  },
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'grp_1',
    communityId: 'comm_1',
    name: 'Quantum Mechanics & Rotational Squad',
    description: 'Irodov, Pathfinder, and Advanced 20-year past papers.',
    createdAt: '2026-01-02T00:00:00Z',
    membersCount: 0,
    activeStudyingCount: 0,
  },
  {
    id: 'grp_2',
    communityId: 'comm_1',
    name: 'Organic Reaction Mechanisms',
    description: 'Solomons, Clayden & multistep synthesis challenges.',
    createdAt: '2026-01-03T00:00:00Z',
    membersCount: 0,
    activeStudyingCount: 0,
  },
  {
    id: 'grp_3',
    communityId: 'comm_2',
    name: 'Distributed Systems & Raft',
    description: 'MIT 6.824 labs, Paxos, Raft, and high-throughput LSM Trees.',
    createdAt: '2026-01-06T00:00:00Z',
    membersCount: 0,
    activeStudyingCount: 0,
  },
  {
    id: 'grp_4',
    communityId: 'comm_2',
    name: 'Hard Dynamic Programming',
    description: 'Digit DP, Tree DP, SOS DP, and Game Theory problems.',
    createdAt: '2026-01-08T00:00:00Z',
    membersCount: 0,
    activeStudyingCount: 0,
  },
  {
    id: 'grp_5',
    communityId: 'comm_3',
    name: 'High-Yield Renal Pathology',
    description: 'Glomerular disorders, tubular necrosis & acid-base disturbances.',
    createdAt: '2026-01-15T00:00:00Z',
    membersCount: 0,
    activeStudyingCount: 0,
  },
];
