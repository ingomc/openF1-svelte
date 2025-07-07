import { describe, it, expect } from 'vitest';
import { 
  getDriverFlag, 
  getTeamColor, 
  formatLapTime, 
  formatSpeed, 
  formatRound, 
  formatPoints, 
  formatPosition, 
  formatWins,
  formatBirthDate,
  calculateAge,
  getYearsAgo
} from '../src/lib/utils';

describe('Driver Flag Utils', () => {
  it('should return correct flag for known nationalities', () => {
    expect(getDriverFlag('Italian')).toBe('🇮🇹');
    expect(getDriverFlag('German')).toBe('🇩🇪');
    expect(getDriverFlag('Dutch')).toBe('🇳🇱');
    expect(getDriverFlag('British')).toBe('🇬🇧');
    expect(getDriverFlag('Monégasque')).toBe('🇲🇨');
    expect(getDriverFlag('Monaco')).toBe('🇲🇨'); // Alternative
  });

  it('should return default flag for unknown nationalities', () => {
    expect(getDriverFlag('Martian')).toBe('🏁');
    expect(getDriverFlag('')).toBe('🏁');
    expect(getDriverFlag('Unknown')).toBe('🏁');
  });

  it('should handle edge cases', () => {
    expect(getDriverFlag('ITALIAN')).toBe('🏁'); // Case sensitive
    expect(getDriverFlag('italian')).toBe('🏁'); // Case sensitive
  });
});

describe('Team Color Utils', () => {
  it('should return correct colors for known teams', () => {
    expect(getTeamColor('ferrari')).toBe('#DC143C');
    expect(getTeamColor('red_bull')).toBe('#1E41FF');
    expect(getTeamColor('mercedes')).toBe('#00D2BE');
    expect(getTeamColor('mclaren')).toBe('#FF8700');
  });

  it('should return default color for unknown teams', () => {
    expect(getTeamColor('unknown_team')).toBe('#666');
    expect(getTeamColor('')).toBe('#666');
  });
});

describe('Format Functions', () => {
  describe('formatLapTime', () => {
    it('should handle proper lap times', () => {
      expect(formatLapTime('1:20.456')).toBe('1:20.456');
      expect(formatLapTime('80.456')).toBe('1:20.456');
    });

    it('should handle invalid inputs', () => {
      expect(formatLapTime('')).toBe('N/A');
      expect(formatLapTime('null')).toBe('N/A');
      expect(formatLapTime('undefined')).toBe('N/A');
      expect(formatLapTime('invalid')).toBe('N/A');
    });
  });

  describe('formatSpeed', () => {
    it('should format valid speeds', () => {
      expect(formatSpeed('250.5')).toBe('250.5 km/h');
      expect(formatSpeed(300)).toBe('300.0 km/h');
      expect(formatSpeed('180.123')).toBe('180.1 km/h');
    });

    it('should handle invalid speeds', () => {
      expect(formatSpeed('')).toBe('N/A');
      expect(formatSpeed('null')).toBe('N/A');
      expect(formatSpeed('undefined')).toBe('N/A');
      expect(formatSpeed('abc')).toBe('N/A');
    });
  });

  describe('formatRound', () => {
    it('should format valid rounds', () => {
      expect(formatRound('5')).toBe('5');
      expect(formatRound(10)).toBe('10');
      expect(formatRound('1')).toBe('1');
    });

    it('should handle invalid rounds', () => {
      expect(formatRound('')).toBe('?');
      expect(formatRound('null')).toBe('?');
      expect(formatRound('undefined')).toBe('?');
      expect(formatRound('abc')).toBe('?');
    });
  });

  describe('formatPoints', () => {
    it('should format valid points', () => {
      expect(formatPoints('25')).toBe('25');
      expect(formatPoints(18.5)).toBe('18.5');
      expect(formatPoints('0')).toBe('0');
    });

    it('should handle invalid points', () => {
      expect(formatPoints('')).toBe('0');
      expect(formatPoints('null')).toBe('0');
      expect(formatPoints('undefined')).toBe('0');
      expect(formatPoints('abc')).toBe('0');
    });
  });

  describe('formatPosition', () => {
    it('should format valid positions', () => {
      expect(formatPosition('1')).toBe('1');
      expect(formatPosition(5)).toBe('5');
      expect(formatPosition('20')).toBe('20');
    });

    it('should handle invalid positions', () => {
      expect(formatPosition('')).toBe('?');
      expect(formatPosition('null')).toBe('?');
      expect(formatPosition('undefined')).toBe('?');
      expect(formatPosition('abc')).toBe('?');
    });
  });

  describe('formatWins', () => {
    it('should format valid wins', () => {
      expect(formatWins('3')).toBe('3');
      expect(formatWins(0)).toBe('0');
      expect(formatWins('15')).toBe('15');
    });

    it('should handle invalid wins', () => {
      expect(formatWins('')).toBe('0');
      expect(formatWins('null')).toBe('0');
      expect(formatWins('undefined')).toBe('0');
      expect(formatWins('abc')).toBe('0');
    });
  });
});

describe('Date Functions', () => {
  describe('formatBirthDate', () => {
    it('should format valid dates', () => {
      expect(formatBirthDate('1997-05-07')).toBe('7.5.1997');
      expect(formatBirthDate('1985-01-01')).toBe('1.1.1985');
    });

    it('should handle invalid dates', () => {
      expect(formatBirthDate('')).toBe('Unbekannt');
      expect(formatBirthDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('calculateAge', () => {
    it('should calculate correct age', () => {
      const birthDate = '1997-05-07'; // Kimi Antonelli
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThan(25);
      expect(age).toBeLessThan(30);
    });

    it('should handle invalid dates', () => {
      expect(calculateAge('')).toBe(0);
      expect(calculateAge('invalid')).toBe(0);
    });
  });

  describe('getYearsAgo', () => {
    it('should calculate years ago correctly', () => {
      const pastDate = '2020-01-01';
      const yearsAgo = getYearsAgo(pastDate);
      expect(yearsAgo).toBe(5); // 2025 - 2020
    });

    it('should handle invalid dates', () => {
      expect(getYearsAgo('')).toBe(0);
    });
  });
});
