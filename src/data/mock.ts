const mockDocuments = [
  {
    id: '1',
    title: 'Payment Processing API Documentation',
    path: '/docs/api/payments',
    overallScore: 78,
    stabilityScore: 65,
    codeAlignmentScore: 45,
    infoDemandScore: 85,
    ownershipScore: 90,
    lastUpdated: '2024-08-15',
    owner: 'Payments Team',
    category: 'api-docs',
    reasons: [
      'High code changes related to this doc\'s topic',
      '14 confusion-driven Slack questions in past 30 days',
      'Doc category = "high volatility" (API Documentation)'
    ],
    recommendations: [
      'Update API endpoint examples',
      'Review recent code changes in payments service',
      'Address common questions in FAQ section'
    ],
    slackQuestions: 14,
    codeChanges: 23
  },
  {
    id: '2',
    title: 'Kubernetes Deployment Runbook',
    path: '/docs/infrastructure/k8s-deploy',
    overallScore: 42,
    stabilityScore: 80,
    codeAlignmentScore: 70,
    infoDemandScore: 30,
    ownershipScore: 85,
    lastUpdated: '2024-10-02',
    owner: 'DevOps Team',
    category: 'runbook',
    reasons: [
      'Recent infrastructure changes not reflected',
      'Some outdated kubectl commands'
    ],
    recommendations: [
      'Update kubectl version examples',
      'Add new namespace configuration'
    ],
    slackQuestions: 3,
    codeChanges: 8
  },
  {
    id: '3',
    title: 'Company Style Guide',
    path: '/docs/design/style-guide',
    overallScore: 15,
    stabilityScore: 95,
    codeAlignmentScore: 100,
    infoDemandScore: 90,
    ownershipScore: 95,
    lastUpdated: '2024-11-01',
    owner: 'Design Team',
    category: 'guide',
    reasons: [],
    recommendations: [
      'Continue maintaining excellent documentation practices'
    ],
    slackQuestions: 1,
    codeChanges: 0
  },
  {
    id: '4',
    title: 'Database Architecture Overview',
    path: '/docs/architecture/database',
    overallScore: 89,
    stabilityScore: 30,
    codeAlignmentScore: 20,
    infoDemandScore: 95,
    ownershipScore: 40,
    lastUpdated: '2024-03-12',
    owner: 'Backend Team',
    category: 'architecture',
    reasons: [
      'Major database migration not documented',
      '28 confusion-driven Slack questions in past 30 days',
      'No clear owner assigned',
      'Critical architectural changes missing'
    ],
    recommendations: [
      'Document recent database migration',
      'Assign clear documentation owner',
      'Update schema diagrams',
      'Create migration troubleshooting guide'
    ],
    slackQuestions: 28,
    codeChanges: 45
  }
const mockTeamHealth = [
  {
    teamName: 'Payments Team',
    totalDocs: 12,
    averageScore: 45,
    highRiskDocs: 3,
    mediumRiskDocs: 4,
    lowRiskDocs: 3,
    excellentDocs: 2
  },
  {
    teamName: 'DevOps Team', 
    totalDocs: 18,
    averageScore: 32,
    highRiskDocs: 1,
    mediumRiskDocs: 5,
    lowRiskDocs: 8,
    excellentDocs: 4
  },
  {
    teamName: 'Backend Team',
    totalDocs: 24,
    averageScore: 58,
    highRiskDocs: 6,
    mediumRiskDocs: 8,
    lowRiskDocs: 7,
    excellentDocs: 3
  },
  {
    teamName: 'Design Team',
    totalDocs: 8,
    averageScore: 25,
    highRiskDocs: 0,
    mediumRiskDocs: 2,
    lowRiskDocs: 2,
    excellentDocs: 4
  }
const mockScoreBreakdown = {
  stability: {
    score: 65,
    weight: 0.4,
    description: 'Measures whether the doc should have changed based on system volatility',
    factors: [
      'Doc category: API Documentation (high volatility)',
      'Minor semantic changes detected',
      'System has high deployment frequency'
    ]
  },
  codeAlignment: {
    score: 45,
    weight: 0.3,
    description: 'Semantic alignment between documentation and recent code changes',
    factors: [
      'High similarity with recent payment service changes',
      '23 related code commits in past 30 days',
      'API endpoint modifications not reflected'
    ]
  },
  infoDemand: {
    score: 85,
    weight: 0.2,
    description: 'Real-world user confusion and information requests',
    factors: [
      '14 confusion-driven questions in Slack',
      'Repeated questions about payment flows',
      'High search frequency for this document'
    ]
  },
  ownership: {
    score: 90,
    weight: 0.1,
    description: 'Active ownership and maintenance responsibility',
    factors: [
      'Clear owner: Payments Team',
      'Active team with recent contributions',
      'Good response time to documentation issues'
    ]
  }
const mockWaitingList = [
  {
    id: '1',
    title: 'Update Payment Gateway Integration Guide',
    requestedBy: 'Sarah Chen',
    assignee: 'Mike Rodriguez',
    priority: 'urgent',
    requestDate: '2024-11-24',
    estimatedHours: 4,
    category: 'update',
    stalenessScore: 89,
    description: 'Critical updates needed for new Stripe API v2024-11-20. Multiple developers blocked on outdated webhook examples.'
  },
  {
    id: '2',
    title: 'Create Database Migration Runbook',
    requestedBy: 'Tech Lead Team',
    priority: 'high',
    requestDate: '2024-11-22',
    estimatedHours: 8,
    category: 'new',
    description: 'Need comprehensive guide for PostgreSQL 15 to 16 migration process. Include rollback procedures and testing checklist.'
  },
  {
    id: '3',
    title: 'Review API Authentication Documentation',
    requestedBy: 'Security Team',
    assignee: 'Alex Thompson',
    priority: 'high',
    requestDate: '2024-11-20',
    estimatedHours: 3,
    category: 'review',
    stalenessScore: 72,
    description: 'Security audit identified outdated OAuth2 flow documentation. Need to verify all examples and security recommendations.'
  },
  {
    id: '4',
    title: 'Migrate Confluence Docs to New Platform',
    requestedBy: 'DevOps Team',
    priority: 'medium',
    requestDate: '2024-11-18',
    estimatedHours: 16,
    category: 'migration',
    description: 'Move 50+ legacy Confluence pages to new documentation platform. Preserve linking structure and update outdated content.'
  },
  {
    id: '5',
    title: 'Update Monitoring Alerts Playbook',
    requestedBy: 'On-call Rotation',
    priority: 'medium',
    requestDate: '2024-11-15',
    estimatedHours: 6,
    category: 'update',
    stalenessScore: 58,
    description: 'Add new Datadog integration steps and update PagerDuty escalation policies. Include recent incident response improvements.'
  },
  {
    id: '6',
    title: 'Create Frontend Component Library Guide',
    requestedBy: 'Design System Team',
    priority: 'low',
    requestDate: '2024-11-10',
    estimatedHours: 12,
    category: 'new',
    description: 'Comprehensive documentation for React component library v2.0. Include usage examples, props documentation, and design tokens.'
  },
  {
    id: '7',
    title: 'Review Docker Deployment Guide',
    requestedBy: 'Junior Developer',
    priority: 'low',
    requestDate: '2024-11-08',
    estimatedHours: 2,
    category: 'review',
    stalenessScore: 35,
    description: 'Verify Docker Compose examples work with latest version. Update environment variable references and networking setup.'
  },
  {
    id: '8',
    title: 'Emergency: Fix Broken API Examples',
    requestedBy: 'Customer Support',
    priority: 'urgent',
    requestDate: '2024-11-25',
    estimatedHours: 2,
    category: 'update',
    stalenessScore: 95,
    description: 'Multiple customer complaints about non-working API examples in integration guide. Affecting trial conversions.'
  }
]