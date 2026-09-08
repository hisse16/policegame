import { AnyRecord, RecordType, AdvancedSearchFilters, CaseRecord } from '../../types/police';
import { policeDatabase } from './databaseEngine';

export interface SearchHit {
  record: AnyRecord;
  matchedField: string;
  snippet?: string;
  score: number;
}

export class SearchEngine {
  /**
   * Fast Universal Search across all fields and all record types
   */
  public search(rawQuery: string, typeFilter: RecordType | 'all' = 'all', limit = 100): SearchHit[] {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return [];

    const allRecords = policeDatabase.getAllRecords(typeFilter === 'all' ? undefined : typeFilter);
    const tokens = query.split(/\s+/).filter(Boolean);
    const results: SearchHit[] = [];

    for (const rec of allRecords) {
      let score = 0;
      let matchedField = 'title';
      let snippet = '';

      // Direct ID match (highest weight)
      if (rec.id.toLowerCase() === query) {
        score += 100;
        matchedField = 'Record ID';
      } else if (rec.id.toLowerCase().includes(query)) {
        score += 50;
        matchedField = 'Record ID';
      }

      // Title match
      if (rec.title.toLowerCase().includes(query)) {
        score += 40;
        matchedField = 'Title';
        snippet = rec.title;
      }

      // Type-specific field checks
      switch (rec.type) {
        case 'person': {
          const p = rec as any;
          if (`${p.firstName} ${p.lastName}`.toLowerCase().includes(query)) {
            score += 60;
            matchedField = 'Name';
          }
          if (p.aliases && p.aliases.some((a: string) => a.toLowerCase().includes(query))) {
            score += 35;
            matchedField = 'Alias';
          }
          if (p.addresses && p.addresses.some((addr: string) => addr.toLowerCase().includes(query))) {
            score += 30;
            matchedField = 'Address';
            snippet = p.addresses.find((addr: string) => addr.toLowerCase().includes(query));
          }
          if (p.phones && p.phones.some((ph: string) => ph.includes(query))) {
            score += 35;
            matchedField = 'Phone';
          }
          if (p.emails && p.emails.some((em: string) => em.toLowerCase().includes(query))) {
            score += 35;
            matchedField = 'Email';
          }
          if (p.driverLicenseId && p.driverLicenseId.toLowerCase().includes(query)) {
            score += 45;
            matchedField = "Driver's License";
          }
          break;
        }

        case 'case': {
          const c = rec as CaseRecord;
          if (c.caseNumber.toLowerCase().includes(query)) {
            score += 65;
            matchedField = 'Case Number';
          }
          if (c.classification.toLowerCase().replace('_', ' ').includes(query)) {
            score += 35;
            matchedField = 'Crime Classification';
          }
          if (c.location.toLowerCase().includes(query)) {
            score += 30;
            matchedField = 'Case Location';
          }
          if (c.summary && c.summary.toLowerCase().includes(query)) {
            score += 25;
            matchedField = 'Summary';
            const idx = c.summary.toLowerCase().indexOf(query);
            snippet = '...' + c.summary.substring(Math.max(0, idx - 40), Math.min(c.summary.length, idx + 80)) + '...';
          }
          break;
        }

        case 'vehicle': {
          const v = rec as any;
          if (v.licensePlate.toLowerCase().includes(query)) {
            score += 70;
            matchedField = 'License Plate';
          }
          if (v.vin.toLowerCase().includes(query)) {
            score += 60;
            matchedField = 'VIN';
          }
          if (`${v.make} ${v.model}`.toLowerCase().includes(query)) {
            score += 40;
            matchedField = 'Make / Model';
          }
          break;
        }

        case 'evidence': {
          const e = rec as any;
          if (e.evidenceId.toLowerCase().includes(query)) {
            score += 70;
            matchedField = 'Evidence ID';
          }
          if (e.description.toLowerCase().includes(query)) {
            score += 30;
            matchedField = 'Description';
          }
          break;
        }

        case 'report': {
          const r = rec as any;
          if (r.reportNumber.toLowerCase().includes(query)) {
            score += 65;
            matchedField = 'Report Number';
          }
          if (r.authorName.toLowerCase().includes(query)) {
            score += 35;
            matchedField = 'Authoring Officer';
          }
          if (r.narrative && r.narrative.toLowerCase().includes(query)) {
            score += 25;
            matchedField = 'Narrative';
            const idx = r.narrative.toLowerCase().indexOf(query);
            snippet = '...' + r.narrative.substring(Math.max(0, idx - 40), Math.min(r.narrative.length, idx + 80)) + '...';
          }
          break;
        }

        case 'officer': {
          const o = rec as any;
          if (o.name.toLowerCase().includes(query)) {
            score += 55;
            matchedField = 'Officer Name';
          }
          if (o.badgeNumber.includes(query)) {
            score += 60;
            matchedField = 'Badge Number';
          }
          break;
        }

        case 'location': {
          const l = rec as any;
          if (l.address.toLowerCase().includes(query)) {
            score += 50;
            matchedField = 'Address';
          }
          if (l.district.toLowerCase().includes(query)) {
            score += 30;
            matchedField = 'District';
          }
          break;
        }

        case 'organization': {
          const org = rec as any;
          if (org.orgName.toLowerCase().includes(query)) {
            score += 55;
            matchedField = 'Organization Name';
          }
          break;
        }

        case 'warrant': {
          const w = rec as any;
          if (w.warrantNumber.toLowerCase().includes(query)) {
            score += 60;
            matchedField = 'Warrant Number';
          }
          if (w.personName.toLowerCase().includes(query)) {
            score += 45;
            matchedField = 'Person Named';
          }
          break;
        }
      }

      // Check tags
      if (rec.tags && rec.tags.some((t) => t.toLowerCase().includes(query))) {
        score += 20;
      }

      // Multi-token match check
      if (tokens.length > 1) {
        const fullString = JSON.stringify(rec).toLowerCase();
        const allTokensMatch = tokens.every((tok) => fullString.includes(tok));
        if (allTokensMatch) {
          score += 25;
        }
      }

      if (score > 0) {
        results.push({
          record: rec,
          matchedField,
          snippet: snippet || rec.title,
          score
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  /**
   * Advanced multi-field structured search
   */
  public advancedSearch(filters: AdvancedSearchFilters): AnyRecord[] {
    let records = policeDatabase.getAllRecords(
      filters.recordType && filters.recordType !== 'all' ? filters.recordType : undefined
    );

    return records.filter((rec) => {
      // 1. Text Query
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const fullStr = JSON.stringify(rec).toLowerCase();
        if (!fullStr.includes(q)) return false;
      }

      // 2. Crime Category (For Cases)
      if (filters.crimeCategory && filters.crimeCategory !== 'all') {
        if (rec.type === 'case') {
          const c = rec as CaseRecord;
          if (c.classification !== filters.crimeCategory) return false;
        } else {
          return false;
        }
      }

      // 3. Status
      if (filters.status && filters.status !== 'all') {
        if (rec.status.toUpperCase() !== filters.status.toUpperCase()) return false;
      }

      // 4. Priority
      if (filters.priority && filters.priority !== 'all') {
        if (rec.type === 'case') {
          const c = rec as CaseRecord;
          if (c.priority !== filters.priority) return false;
        }
      }

      // 5. Date Range
      if (filters.dateFrom) {
        const recDate = rec.createdAt.split(' ')[0] || '';
        if (recDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const recDate = rec.createdAt.split(' ')[0] || '';
        if (recDate > filters.dateTo) return false;
      }

      // 6. Location
      if (filters.location && filters.location.trim()) {
        const loc = filters.location.toLowerCase().trim();
        if (rec.type === 'location') {
          const l = rec as any;
          if (!l.address.toLowerCase().includes(loc) && !l.district.toLowerCase().includes(loc)) return false;
        } else if (rec.type === 'case') {
          const c = rec as CaseRecord;
          if (!c.location.toLowerCase().includes(loc)) return false;
        } else if (rec.type === 'person') {
          const p = rec as any;
          if (!p.addresses.some((a: string) => a.toLowerCase().includes(loc))) return false;
        }
      }

      return true;
    });
  }
}

export const searchEngine = new SearchEngine();
