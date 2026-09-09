import { AnyRecord, RecordType, AdvancedSearchFilters, CaseRecord } from '../../types/police';
import { policeDatabase } from './databaseEngine';

export interface SearchHit {
  record: AnyRecord;
  matchedField: string;
  snippet?: string;
  score: number;
}

export class SearchEngine {
  /** Fast universal search across every searchable record field. */
  public search(rawQuery: string, typeFilter: RecordType | 'all' = 'all', limit = 100): SearchHit[] {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return [];

    const allRecords = policeDatabase.getAllRecords(typeFilter === 'all' ? undefined : typeFilter);
    const tokens = query.split(/\s+/).filter(Boolean);
    const results: SearchHit[] = [];

    for (const rec of allRecords) {
      let score = 0;
      let matchedField = 'Record';
      let snippet = '';
      const fullString = JSON.stringify(rec).toLowerCase();

      if (rec.id.toLowerCase() === query) { score += 100; matchedField = 'Record ID'; }
      else if (rec.id.toLowerCase().includes(query)) { score += 50; matchedField = 'Record ID'; }
      if (rec.title.toLowerCase().includes(query)) { score += 40; matchedField = 'Title'; snippet = rec.title; }

      switch (rec.type) {
        case 'person': {
          const p = rec as any;
          if (`${p.firstName} ${p.lastName}`.toLowerCase().includes(query)) { score += 60; matchedField = 'Name'; }
          if (p.aliases?.some((a: string) => a.toLowerCase().includes(query))) { score += 35; matchedField = 'Alias'; }
          if (p.addresses?.some((a: string) => a.toLowerCase().includes(query))) { score += 30; matchedField = 'Address'; }
          if (p.phones?.some((ph: string) => ph.includes(query))) { score += 35; matchedField = 'Phone'; }
          if (p.emails?.some((em: string) => em.toLowerCase().includes(query))) { score += 35; matchedField = 'Email'; }
          if (p.driverLicenseId?.toLowerCase().includes(query)) { score += 45; matchedField = "Driver's License"; }
          break;
        }
        case 'case': {
          const c = rec as CaseRecord;
          if (c.caseNumber.toLowerCase().includes(query)) { score += 65; matchedField = 'Case Number'; }
          if (c.classification.toLowerCase().replace('_', ' ').includes(query)) { score += 35; matchedField = 'Crime Classification'; }
          if (c.location.toLowerCase().includes(query)) { score += 30; matchedField = 'Case Location'; }
          if (c.summary?.toLowerCase().includes(query)) { score += 25; matchedField = 'Summary'; }
          break;
        }
        case 'vehicle': {
          const v = rec as any;
          if (v.licensePlate?.toLowerCase().includes(query)) { score += 70; matchedField = 'License Plate'; }
          if (v.vin?.toLowerCase().includes(query)) { score += 60; matchedField = 'VIN'; }
          if (`${v.make} ${v.model}`.toLowerCase().includes(query)) { score += 40; matchedField = 'Make / Model'; }
          break;
        }
        case 'evidence': {
          const e = rec as any;
          if (e.evidenceId?.toLowerCase().includes(query)) { score += 70; matchedField = 'Evidence ID'; }
          if (e.description?.toLowerCase().includes(query)) { score += 30; matchedField = 'Description'; }
          break;
        }
        case 'report': {
          const r = rec as any;
          if (r.reportNumber?.toLowerCase().includes(query)) { score += 65; matchedField = 'Report Number'; }
          if (r.authorName?.toLowerCase().includes(query)) { score += 35; matchedField = 'Authoring Officer'; }
          if (r.narrative?.toLowerCase().includes(query)) { score += 25; matchedField = 'Narrative'; }
          break;
        }
        case 'officer': {
          const o = rec as any;
          if (o.name?.toLowerCase().includes(query)) { score += 55; matchedField = 'Officer Name'; }
          if (o.badgeNumber?.includes(query)) { score += 60; matchedField = 'Badge Number'; }
          break;
        }
        case 'location': {
          const l = rec as any;
          if (l.address?.toLowerCase().includes(query)) { score += 50; matchedField = 'Address'; }
          if (l.district?.toLowerCase().includes(query)) { score += 30; matchedField = 'District'; }
          break;
        }
        case 'organization': {
          const org = rec as any;
          if (org.orgName?.toLowerCase().includes(query)) { score += 55; matchedField = 'Organization Name'; }
          break;
        }
        case 'warrant': {
          const w = rec as any;
          if (w.warrantNumber?.toLowerCase().includes(query)) { score += 60; matchedField = 'Warrant Number'; }
          if (w.personName?.toLowerCase().includes(query)) { score += 45; matchedField = 'Person Named'; }
          break;
        }
      }

      if (rec.tags?.some((t) => t.toLowerCase().includes(query))) score += 20;

      // The investigator should be able to search narrative/notes/custom fields too.
      // This is especially important for clues such as "Crownline" that may live in
      // a related record rather than a record title.
      if (fullString.includes(query)) score += 18;
      if (tokens.length > 1 && tokens.every((tok) => fullString.includes(tok))) score += 25;

      if (score > 0) results.push({ record: rec, matchedField, snippet: snippet || rec.title, score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  public advancedSearch(filters: AdvancedSearchFilters): AnyRecord[] {
    const records = policeDatabase.getAllRecords(filters.recordType && filters.recordType !== 'all' ? filters.recordType : undefined);
    return records.filter((rec) => {
      if (filters.query?.trim()) {
        const q = filters.query.toLowerCase().trim();
        if (!JSON.stringify(rec).toLowerCase().includes(q)) return false;
      }
      if (filters.crimeCategory && filters.crimeCategory !== 'all') {
        if (rec.type !== 'case' || (rec as CaseRecord).classification !== filters.crimeCategory) return false;
      }
      if (filters.status && filters.status !== 'all' && rec.status.toUpperCase() !== filters.status.toUpperCase()) return false;
      if (filters.priority && filters.priority !== 'all' && rec.type === 'case' && (rec as CaseRecord).priority !== filters.priority) return false;
      if (filters.dateFrom && rec.createdAt.split(' ')[0] < filters.dateFrom) return false;
      if (filters.dateTo && rec.createdAt.split(' ')[0] > filters.dateTo) return false;
      if (filters.location?.trim()) {
        const loc = filters.location.toLowerCase().trim();
        if (rec.type === 'location') {
          const l = rec as any;
          if (!l.address.toLowerCase().includes(loc) && !l.district.toLowerCase().includes(loc)) return false;
        } else if (rec.type === 'case') {
          if (!(rec as CaseRecord).location.toLowerCase().includes(loc)) return false;
        } else if (rec.type === 'person') {
          if (!(rec as any).addresses.some((a: string) => a.toLowerCase().includes(loc))) return false;
        }
      }
      return true;
    });
  }
}

export const searchEngine = new SearchEngine();
