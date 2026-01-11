# DocPulse Enterprise - Quick Start Guide

## What is DocPulse?

DocPulse is a comprehensive **documentation health management system** for enterprise teams. It measures how "stale" (outdated/inaccurate) your internal documentation is, then provides actionable insights to keep docs fresh and trustworthy.

---

## Key Capabilities

### 📊 Dashboard
- Real-time documentation health scores (0-100, lower = healthier)
- Team breakdowns
- Risk identification
- Trend monitoring

### 📁 Document Management
- Upload documents (PDF, MD, TXT, DOCX)
- Automatic scoring and signal detection
- Owner assignment and accountability
- Version history tracking

### 🔍 Advanced Search
- Full-text search
- Filter by team, type, criticality, status
- Faceted navigation
- Instant results

### 📈 Analytics & Reports
- Team health metrics
- Score distribution analysis
- Actionable recommendations
- CSV/JSON export

### 🔐 Enterprise Security
- File upload validation
- Malware scanning
- Role-based access control (Admin, Editor, Viewer)
- Audit logging of all actions
- Encryption-ready architecture

### 🔄 Integrations (Future Ready)
- Confluence connectors (ready)
- Notion integration (ready)
- GitHub wiki (ready)
- Slack integration (ready)
- Custom API support

---

## Getting Started

### Step 1: Access Dashboard
Open the app and click the **Dashboard** tab. You'll see:
- Total documents
- Average staleness score
- High-risk documents count
- Team health overview
- Recommended actions

### Step 2: Upload Documents
1. Click **Upload** button (top right)
2. **Stage 1 - Select Files**: Drag & drop or select files (supports PDF, MD, TXT, DOCX)
3. **Stage 2 - Confirm Metadata**:
   - Title (auto-filled from filename, editable)
   - Team (required - select from dropdown)
   - System (required - select from dropdown)
   - Doc Type: Runbook/API/Design/Onboarding/RFC/Playbook
   - Criticality: 1-5 (1=low, 5=critical)
   - Owner (optional but recommended)
   - Last Reviewed Date (optional)
4. **Stage 3 - Review & Confirm**: Click "Add to Dashboard"

### Step 3: Monitor & Act
- Dashboard updates **immediately** with new docs
- View individual documents by clicking rows
- See generated signals (missing owner, stale review, unreviewed, etc.)
- Read recommendations for improvement

---

## Understanding Staleness Scores

### Overall Score (0-100)
- **0-19**: Excellent ✅ (recently reviewed, low risk)
- **20-39**: Low Risk 🟢 (generally healthy)
- **40-59**: Medium Risk 🟡 (needs attention)
- **60-79**: High Risk 🟠 (prioritize for review)
- **80-100**: Critical ⛔ (immediate action needed)

### Score Breakdown
The score is calculated from 4 factors:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| **Stability** | 40% | How recently was the doc last reviewed? |
| **Code Alignment** | 30% | How many releases since last review? |
| **Info Demand** | 20% | How many views does it get? |
| **Ownership** | 10% | Does it have a clear owner? |

### Signals Generated
**MISSING_OWNER** - No one assigned for updates
**STALE_LAST_REVIEW** - Not reviewed in 180+ days  
**UNREVIEWED_DOC** - Never had a formal review
**HIGH_CHANGE_PRESSURE** - Many releases without updates
**LOW_CONFIDENCE_METADATA** - Missing key information

---

## Key Features Explained

### 1. File Upload & Validation ✅
- Maximum file size: 50 MB
- Supported formats: PDF, Markdown, Text, Word
- Automatic malware scanning
- Filename sanitization

**Upload Flow:**
```
Select Files → Confirm Metadata → Review → Add to Dashboard → Immediate Update
```

### 2. Role-Based Access Control
- **Admin**: Full access (manage users, settings, all docs)
- **Editor**: Can edit/create docs, share with others
- **Viewer**: Read-only access to docs

### 3. Backup & Export ✅
- Click **Export** button to download workspace as JSON
- Contains all documents and metadata
- Use **Import** to restore from backup
- Perfect for migrations or disaster recovery

### 4. Search & Filter
```
Text Search + Filters = Instant Results

Example queries:
- "API documentation" filtered by Backend team
- All high-criticality docs last reviewed >90 days ago
- Docs without owners by System type
```

### 5. Analytics Dashboard
- See metrics across all teams
- Identify at-risk documentation
- Get AI-driven recommendations
- Export reports for stakeholders

---

## Common Workflows

### Workflow 1: Onboard Team Docs
1. Collect all team documentation
2. Click Upload → batch add files
3. Confirm metadata for each doc
4. Dashboard automatically scores everything
5. View "Recently Added" badge (24h)
6. Share dashboard with team

### Workflow 2: Compliance Audit
1. Go to Dashboard
2. Export workspace (JSON)
3. Run search for docs without owners
4. Generate report (Analytics)
5. Share findings with team leads
6. Track remediation in audit log

### Workflow 3: Review Cycle
1. Search for High-Risk docs
2. Assign to team members
3. Update "Last Reviewed" date
4. Re-upload revised docs
5. New scores reflect improvements
6. Track metrics over time

### Workflow 4: Disaster Recovery
1. Export workspace regularly
2. Keep backups in secure location
3. If data lost, click Import
4. Select backed up JSON file
5. Workspace restored completely

---

## Tips & Best Practices

### ✅ DO:
- Assign clear owners to all docs
- Record "Last Reviewed" dates
- Update criticality based on usage
- Export workspace weekly for backups
- Review High-Risk docs first
- Use consistent team names
- Tag docs with proper system names

### ❌ DON'T:
- Leave docs without owners
- Ignore Critical-risk documents
- Upload unscanned files (use malware protection)
- Share login credentials (use admin panel instead)
- Ignore audit logs for compliance

---

## Storage & Data

### Local Storage
- All data stored in browser locally
- No server uploads (MVP mode)
- 5 MB capacity (typically holds 1,000+ docs)
- Export for persistence

### Future Cloud Storage
Coming soon - seamless cloud backup with:
- Automatic sync
- Real-time collaboration
- Multi-device access
- Advanced integrations

---

## Support & Integration

### Built-in Analytics
```
Dashboard → View Metrics → Filter by Team/Type → Export Report
```

### Future Integrations
- **Confluence**: Auto-sync docs, track updates
- **Notion**: Import docs, monitor staleness
- **GitHub**: Link PRs to doc reviews
- **Slack**: Alerts for stale docs

### Custom Integrations
API is ready for custom integrations. Contact support for:
- Webhook setup
- Custom connectors
- Scheduled syncs

---

## Security & Compliance

### What's Protected:
✅ File upload validation
✅ Malware scanning
✅ Filename sanitization
✅ Access control (roles)
✅ Audit logging
✅ Data export tracking

### Compliance Ready:
- SOC 2 audit trail design
- ISO 27001 access controls
- GDPR data retention policies
- Encryption-ready architecture

---

## Troubleshooting

### Upload Failed
- Check file size (<50 MB)
- Verify format is supported (PDF, MD, TXT, DOCX)
- Ensure all required fields completed
- Check browser console for errors

### High Staleness Score
- Add owner (required for good score)
- Set "Last Reviewed" date
- Increase view count by sharing doc
- Update if code has changed significantly

### Storage Full
- Export current workspace (backup)
- Clear local cache
- Or upgrade to cloud (coming soon)

### Lost Data
- Check browser storage (DevTools → Application → localStorage)
- Look for `docpulse_enterprise_*` keys
- Use backup file if available

---

## Roadmap (2026)

**Q1:** Cloud storage, real-time sync  
**Q2:** Confluence/Notion integrations  
**Q3:** Advanced scheduling, ML signals  
**Q4:** Slack bot, custom workflows  

---

## Contact & Support

- **Questions**: Check dashboard help panels
- **Bug Reports**: Create issue with browser console log
- **Feature Requests**: Submit via settings
- **Enterprise Support**: Available with subscription

---

## Key Metrics to Monitor

```
Track these over time:

1. Average Staleness Score
   Goal: Keep below 50 (excellent < 20)

2. % Docs with Owners
   Goal: 100% (track unassigned)

3. % Recently Reviewed (past 180 days)
   Goal: 80%+ (critical docs)

4. High-Risk Count
   Goal: Trending down month-over-month

5. Team Health Scores
   Goal: Identify outliers, support struggling teams
```

---

**DocPulse Enterprise Edition**  
Built for companies that take documentation seriously.

Version: 1.0  
Updated: January 10, 2026
