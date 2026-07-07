// Local Storage fallback system to handle tables that might be missing in the remote database.
// This allows the application to remain 100% operational and robust even under out-of-sync schemas.

export interface WhatsAppLead {
  id: string;
  full_name: string;
  email: string;
  status: string;
  source: string;
  created_at: string;
  phone?: string;
  message?: string;
}

export interface BusinessToolLead {
  id: string;
  agency_name: string;
  company_email: string;
  business_email?: string; // mapping convenience
  sector: string;
  business_sector?: string; // mapping convenience
  tool_name: string;
  status: string;
  source: string;
  created_at: string;
}

export interface BusinessProposalLead {
  id: string;
  agency_name: string;
  company_email: string;
  business_email?: string; // mapping convenience
  sector: string;
  business_sector?: string; // mapping convenience
  proposal_name: string;
  status: string;
  source: string;
  created_at: string;
}

const getStorageKey = (table: string) => `gt_fallback_${table}`;

export const getLocalLeads = (table: string): any[] => {
  try {
    const key = getStorageKey(table);
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn(`Error reading local storage for ${table}:`, err);
    return [];
  }
};

export const saveLocalLead = (table: string, lead: any): void => {
  try {
    const key = getStorageKey(table);
    const current = getLocalLeads(table);
    
    // Ensure the lead has standard mapping fields populated
    const enrichedLead = { ...lead };
    if (enrichedLead.email && !enrichedLead.company_email) {
      enrichedLead.company_email = enrichedLead.email;
    }
    if (enrichedLead.company_email && !enrichedLead.email) {
      enrichedLead.email = enrichedLead.company_email;
    }
    if (enrichedLead.company_email && !enrichedLead.business_email) {
      enrichedLead.business_email = enrichedLead.company_email;
    }
    if (enrichedLead.business_email && !enrichedLead.company_email) {
      enrichedLead.company_email = enrichedLead.business_email;
    }
    if (enrichedLead.sector && !enrichedLead.business_sector) {
      enrichedLead.business_sector = enrichedLead.sector;
    }
    if (enrichedLead.business_sector && !enrichedLead.sector) {
      enrichedLead.sector = enrichedLead.business_sector;
    }

    // Check if it already exists to avoid duplication
    const index = current.findIndex(x => x.id === enrichedLead.id);
    if (index >= 0) {
      current[index] = enrichedLead;
    } else {
      current.unshift(enrichedLead);
    }
    
    localStorage.setItem(key, JSON.stringify(current));
  } catch (err) {
    console.warn(`Error writing local storage for ${table}:`, err);
  }
};

export const deleteLocalLead = (table: string, id: string): void => {
  try {
    const key = getStorageKey(table);
    const current = getLocalLeads(table);
    const filtered = current.filter(x => x.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (err) {
    console.warn(`Error deleting from local storage for ${table}:`, err);
  }
};

export const updateLocalLead = (table: string, id: string, updatedFields: any): void => {
  try {
    const key = getStorageKey(table);
    const current = getLocalLeads(table);
    const updated = current.map(x => {
      if (x.id === id) {
        const enriched = { ...x, ...updatedFields };
        if (enriched.email && !enriched.company_email) enriched.company_email = enriched.email;
        if (enriched.company_email && !enriched.email) enriched.email = enriched.company_email;
        if (enriched.company_email && !enriched.business_email) enriched.business_email = enriched.company_email;
        if (enriched.business_email && !enriched.company_email) enriched.company_email = enriched.business_email;
        if (enriched.sector && !enriched.business_sector) enriched.business_sector = enriched.sector;
        if (enriched.business_sector && !enriched.sector) enriched.sector = enriched.business_sector;
        return enriched;
      }
      return x;
    });
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.warn(`Error updating local storage for ${table}:`, err);
  }
};

// Generates a robust fallback unique ID
export const generateFallbackId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'local-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
};
