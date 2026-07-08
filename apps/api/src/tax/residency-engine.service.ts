import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface RuleCondition {
  field: string;
  operator: string;
  value: string | number | boolean | string[];
}

interface TaxRule {
  ruleId: string;
  description: string;
  priority: number;
  conditions: RuleCondition[];
  result: Record<string, unknown>;
}

interface TaxRuleSet {
  year: number;
  constants: Record<string, number | string>;
  rules: TaxRule[];
}

export interface ResidencyInput {
  visaType: string;
  arrivalDate: Date;
  taxYear: number;
  daysInUSByYear: Record<number, number>; // { 2025: 180, 2024: 365, 2023: 365 }
  calendarYearsInUS: number;
}

export interface ResidencyResult {
  status: 'NONRESIDENT_ALIEN' | 'RESIDENT_ALIEN' | 'DUAL_STATUS';
  statusLabel: string;
  ruleApplied: string;
  ruleDescription: string;
  reasoning: {
    summary: string;
    plainEnglish: string;
    steps: Array<{
      stepNumber: number;
      title: string;
      description: string;
      result: 'PASS' | 'FAIL' | 'INFO';
      value?: string;
    }>;
  };
  daysCount: {
    currentYear: number;
    priorYear: number;
    twoYearsAgo: number;
    priorYearWeighted: number;
    twoYearsAgoWeighted: number;
    totalWeighted: number;
    threshold: number;
    meetsThreshold: boolean;
    exemptYears: number;
  };
  forms: string[];
  ficaExempt: boolean;
  stateFilingRequired: boolean;
}

@Injectable()
export class ResidencyEngineService {
  private readonly logger = new Logger(ResidencyEngineService.name);
  private ruleSetCache: Map<number, TaxRuleSet> = new Map();

  // ─── Load Rule Set ────────────────────────────────────────────────────────

  private loadRuleSet(year: number): TaxRuleSet {
    if (this.ruleSetCache.has(year)) {
      return this.ruleSetCache.get(year)!;
    }

    // Try multiple paths (monorepo and local)
    const possiblePaths = [
      path.join(__dirname, '../../../../..', 'packages', 'rules', `${year}.json`),
      path.join(__dirname, '../../../..', 'packages', 'rules', `${year}.json`),
      path.join(process.cwd(), 'packages', 'rules', `${year}.json`),
    ];

    for (const rulePath of possiblePaths) {
      if (fs.existsSync(rulePath)) {
        const raw = fs.readFileSync(rulePath, 'utf-8');
        const ruleSet = JSON.parse(raw) as TaxRuleSet;
        this.ruleSetCache.set(year, ruleSet);
        this.logger.log(`Loaded rule set for year ${year} from ${rulePath}`);
        return ruleSet;
      }
    }

    // Fallback to embedded defaults for 2025
    this.logger.warn(`Rule file not found for year ${year}, using embedded defaults`);
    return this.getDefaultRuleSet(year);
  }

  // ─── Main Engine ─────────────────────────────────────────────────────────

  calculateResidency(input: ResidencyInput): ResidencyResult {
    const ruleSet = this.loadRuleSet(input.taxYear);
    const constants = ruleSet.constants;
    const threshold = (constants.SUBSTANTIAL_PRESENCE_THRESHOLD as number) || 183;
    const exemptYearsMax = (constants.F1_EXEMPT_YEARS as number) || 5;

    // ─── Step 1: Calculate Substantial Presence Test ─────────────────────
    const currentYear = input.taxYear;
    const daysCurrentYear = input.daysInUSByYear[currentYear] || 0;
    const daysPriorYear = input.daysInUSByYear[currentYear - 1] || 0;
    const daysTwoYearsAgo = input.daysInUSByYear[currentYear - 2] || 0;

    const priorYearWeighted = Math.floor(daysPriorYear / 3);
    const twoYearsAgoWeighted = Math.floor(daysTwoYearsAgo / 6);
    const totalWeighted = daysCurrentYear + priorYearWeighted + twoYearsAgoWeighted;
    const meetsThreshold = totalWeighted >= threshold;

    const daysCount = {
      currentYear: daysCurrentYear,
      priorYear: daysPriorYear,
      twoYearsAgo: daysTwoYearsAgo,
      priorYearWeighted,
      twoYearsAgoWeighted,
      totalWeighted,
      threshold,
      meetsThreshold,
      exemptYears: input.calendarYearsInUS,
    };

    // ─── Step 2: Build evaluation context ────────────────────────────────
    const context: Record<string, unknown> = {
      visaType: input.visaType,
      calendarYearsInUS: input.calendarYearsInUS,
      substantialPresenceMet: meetsThreshold,
      daysInUSCurrentYear: daysCurrentYear,
      stateOfResidence: 'IL', // UIC-specific: always Illinois
    };

    // ─── Step 3: Evaluate rules in priority order ─────────────────────────
    const sortedRules = [...ruleSet.rules].sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      if (this.evaluateRule(rule, context)) {
        return this.buildResult(rule, daysCount, input);
      }
    }

    // ─── Fallback ─────────────────────────────────────────────────────────
    return this.buildFallbackResult(daysCount, input);
  }

  // ─── Rule Evaluation ─────────────────────────────────────────────────────

  private evaluateRule(rule: TaxRule, context: Record<string, unknown>): boolean {
    return rule.conditions.every((condition) =>
      this.evaluateCondition(condition, context),
    );
  }

  private evaluateCondition(
    condition: RuleCondition,
    context: Record<string, unknown>,
  ): boolean {
    const fieldValue = context[condition.field];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case '<':
        return (fieldValue as number) < (condition.value as number);
      case '<=':
        return (fieldValue as number) <= (condition.value as number);
      case '>':
        return (fieldValue as number) > (condition.value as number);
      case '>=':
        return (fieldValue as number) >= (condition.value as number);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue as string);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue as string);
      default:
        return false;
    }
  }

  // ─── Build Result ─────────────────────────────────────────────────────────

  private buildResult(
    rule: TaxRule,
    daysCount: ResidencyResult['daysCount'],
    input: ResidencyInput,
  ): ResidencyResult {
    const residencyStatus = rule.result.residencyStatus as ResidencyResult['status'];
    const isNonresident = residencyStatus === 'NONRESIDENT_ALIEN';

    const steps = [
      {
        stepNumber: 1,
        title: 'Visa Type Check',
        description: `Your visa type is ${input.visaType}`,
        result: 'INFO' as const,
        value: input.visaType,
      },
      {
        stepNumber: 2,
        title: 'Years in F-1 Status',
        description: `You have been in F-1 status for ${input.calendarYearsInUS} calendar year(s)`,
        result: input.calendarYearsInUS <= 5 ? ('PASS' as const) : ('INFO' as const),
        value: `${input.calendarYearsInUS} year(s)`,
      },
      {
        stepNumber: 3,
        title: 'Substantial Presence Test',
        description: `${daysCount.currentYear} days (this year) + ${daysCount.priorYearWeighted} days (1/3 of ${daysCount.priorYear}) + ${daysCount.twoYearsAgoWeighted} days (1/6 of ${daysCount.twoYearsAgo}) = ${daysCount.totalWeighted} weighted days`,
        result: daysCount.meetsThreshold ? ('FAIL' as const) : ('PASS' as const),
        value: `${daysCount.totalWeighted} / ${daysCount.threshold} required`,
      },
      {
        stepNumber: 4,
        title: 'Final Determination',
        description: rule.description,
        result: 'INFO' as const,
        value: isNonresident ? 'Nonresident Alien' : 'Resident Alien',
      },
    ];

    return {
      status: residencyStatus,
      statusLabel: isNonresident ? 'Nonresident Alien' : 'Resident Alien',
      ruleApplied: rule.ruleId,
      ruleDescription: rule.description,
      reasoning: {
        summary: `Based on rule ${rule.ruleId}: ${rule.description}`,
        plainEnglish: (rule.result.explanation as string) || '',
        steps,
      },
      daysCount,
      forms: (rule.result.formRequired as string[]) || ['8843'],
      ficaExempt: (rule.result.ficaExempt as boolean) || false,
      stateFilingRequired: true, // Illinois always required for UIC
    };
  }

  private buildFallbackResult(
    daysCount: ResidencyResult['daysCount'],
    input: ResidencyInput,
  ): ResidencyResult {
    return {
      status: 'NONRESIDENT_ALIEN',
      statusLabel: 'Nonresident Alien',
      ruleApplied: 'FALLBACK',
      ruleDescription: 'Default F-1 nonresident determination',
      reasoning: {
        summary: 'No specific rule matched — defaulting to Nonresident Alien status',
        plainEnglish:
          'As an F-1 student, you are generally considered a Nonresident Alien unless specific conditions apply.',
        steps: [],
      },
      daysCount,
      forms: ['8843', '1040-NR'],
      ficaExempt: input.calendarYearsInUS <= 5,
      stateFilingRequired: true,
    };
  }

  // ─── Default Rule Set ─────────────────────────────────────────────────────

  private getDefaultRuleSet(year: number): TaxRuleSet {
    return {
      year,
      constants: {
        SUBSTANTIAL_PRESENCE_THRESHOLD: 183,
        F1_EXEMPT_YEARS: 5,
      },
      rules: [
        {
          ruleId: 'R001',
          description: 'F-1 student within first 5 calendar years',
          priority: 1,
          conditions: [
            { field: 'visaType', operator: 'equals', value: 'F1' },
            { field: 'calendarYearsInUS', operator: '<=', value: 5 },
          ],
          result: {
            residencyStatus: 'NONRESIDENT_ALIEN',
            explanation:
              'As an F-1 student within your first 5 calendar years in the U.S., you are automatically a Nonresident Alien.',
            formRequired: ['8843', '1040-NR'],
            ficaExempt: true,
          },
        },
      ],
    };
  }
}
