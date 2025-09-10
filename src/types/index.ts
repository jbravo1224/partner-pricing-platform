export interface Branding {
  logoUrl?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export interface EmailConfig {
  to: string[];
  ccDefaultSubmitter?: boolean;
  allowAdditionalCc?: boolean;
}

export interface FormField {
  type: 'text' | 'email' | 'number' | 'select' | 'boolean' | 'multiselect';
  name: string;
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export interface FormConfig {
  sections: FormSection[];
}

export interface PricingRule {
  id: string;
  type: 'setSubtotalFromBase' | 'setSubtotalFromMatrix' | 'add' | 'multiply';
  condition?: any; // JSONLogic condition
  value?: number | string;
  expression?: any; // JSONLogic expression
}

export interface PricingConfig {
  currency: string;
  baseTable?: Record<string, number>;
  baseMatrix?: Record<string, Record<string, number>>;
  rules: PricingRule[];
}

export interface Features {
  [key: string]: any;
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  branding: Branding;
  emailCfg: EmailConfig;
  formCfg: FormConfig;
  pricingCfg: PricingConfig;
  features: Features;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerVersion {
  id: string;
  partnerId: string;
  version: number;
  isDraft: boolean;
  isPublished: boolean;
  branding: Branding;
  emailCfg: EmailConfig;
  formCfg: FormConfig;
  pricingCfg: PricingConfig;
  features: Features;
  createdAt: Date;
  publishedAt?: Date;
}

export interface Quote {
  id: string;
  partnerId: string;
  partnerSlug: string;
  inputs: Record<string, any>;
  additionalCc?: string;
  subtotal: number;
  total: number;
  currency: string;
  lineItems: LineItem[];
  status: 'pending' | 'sent' | 'viewed';
  createdAt: Date;
  updatedAt: Date;
}

export interface LineItem {
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
}

export interface PricingResult {
  subtotal: number;
  total: number;
  currency: string;
  lineItems: LineItem[];
}

export interface EmailProvider {
  sendEmail: (to: string[], subject: string, html: string, cc?: string[]) => Promise<void>;
}
