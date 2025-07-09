import { describe, it, expect } from 'vitest';
import { 
  getDriverImageUrl, 
  getDriverAvatarUrl, 
  getWikipediaImage,
  getDriverImages
} from '../src/lib/f1-images';

describe('F1 Images Service', () => {
  describe('getDriverImageUrl', () => {
    it('should return F1 API URL for known drivers', () => {
      const url = getDriverImageUrl('verstappen', 'Max', 'Verstappen');
      expect(url).toContain('media.formula1.com');
      expect(url).toContain('maxver01');
      expect(url).toContain('redbull');
    });

    it('should return F1 API URL for legacy drivers', () => {
      const url = getDriverImageUrl('vettel', 'Sebastian', 'Vettel');
      expect(url).toContain('media.formula1.com');
      expect(url).toContain('sebvet01');
      expect(url).toContain('fallback');
    });

    it('should generate driver code for unknown drivers', () => {
      const url = getDriverImageUrl('unknown', 'John', 'Doe');
      expect(url).toContain('media.formula1.com');
      expect(url).toContain('johdoe01');
    });

    it('should return ultimate fallback for drivers without names', () => {
      const url = getDriverImageUrl('unknown');
      expect(url).toContain('media.formula1.com');
      expect(url).toContain('fallback');
    });
  });

  describe('getWikipediaImage', () => {
    it('should return Wikipedia URL for known drivers', () => {
      const url = getWikipediaImage('verstappen');
      expect(url).toContain('upload.wikimedia.org');
      expect(url).toContain('Max_Verstappen');
    });

    it('should return Wikipedia URL using family name', () => {
      const url = getWikipediaImage('unknown', 'Hamilton');
      expect(url).toContain('upload.wikimedia.org');
      expect(url).toContain('Lewis_Hamilton');
    });

    it('should return null for unknown drivers', () => {
      const url = getWikipediaImage('unknown', 'Unknown');
      expect(url).toBeNull();
    });
  });

  describe('getDriverAvatarUrl', () => {
    it('should generate avatar with initials', () => {
      const url = getDriverAvatarUrl('test', 'Max', 'Verstappen', 'Netherlands');
      expect(url).toContain('data:image/svg+xml');
      // Decode the URL to check content
      const decodedSvg = decodeURIComponent(url.split(',')[1]);
      expect(decodedSvg).toContain('MV'); // initials
      expect(decodedSvg).toContain('Netherlands');
    });

    it('should handle missing names gracefully', () => {
      const url = getDriverAvatarUrl('test');
      expect(url).toContain('data:image/svg+xml');
      const decodedSvg = decodeURIComponent(url.split(',')[1]);
      expect(decodedSvg).toContain('?'); // fallback character
    });

    it('should use nationality colors', () => {
      const url = getDriverAvatarUrl('test', 'Lewis', 'Hamilton', 'British');
      expect(url).toContain('data:image/svg+xml');
      const decodedSvg = decodeURIComponent(url.split(',')[1]);
      expect(decodedSvg).toContain('LH');
      expect(decodedSvg).toContain('#E63946'); // British color
    });

    it('should use default color for unknown nationality', () => {
      const url = getDriverAvatarUrl('test', 'John', 'Doe', 'Unknown');
      expect(url).toContain('data:image/svg+xml');
      const decodedSvg = decodeURIComponent(url.split(',')[1]);
      expect(decodedSvg).toContain('JD');
      expect(decodedSvg).toContain('#6C757D'); // default color
    });
  });

  describe('getDriverImages', () => {
    it('should return all image URLs for a driver', () => {
      const images = getDriverImages('verstappen', 'Netherlands', 'red_bull', 'Max', 'Verstappen');
      
      expect(images.driver).toContain('media.formula1.com');
      expect(images.driverAvatar).toContain('data:image/svg+xml');
      expect(images.team).toContain('data:image/svg+xml');
      expect(images.helmet).toContain('data:image/svg+xml');
    });

    it('should handle drivers without constructor', () => {
      const images = getDriverImages('test', 'German', undefined, 'Sebastian', 'Vettel');
      
      expect(images.driver).toBeDefined();
      expect(images.driverAvatar).toBeDefined();
      expect(images.team).toBeUndefined();
      expect(images.helmet).toBeDefined();
    });
  });

  describe('Avatar generation edge cases', () => {
    it('should handle single character names', () => {
      const url = getDriverAvatarUrl('test', 'A', 'B', 'German');
      const decodedSvg = decodeURIComponent(url.split(',')[1]);
      expect(decodedSvg).toContain('AB');
    });

    it('should handle long names', () => {
      const url = getDriverAvatarUrl('test', 'Alexander', 'Vandenberghe', 'Belgian');
      const decodedSvg = decodeURIComponent(url.split(',')[1]);
      expect(decodedSvg).toContain('AV');
    });

    it('should handle special characters in names', () => {
      const url = getDriverAvatarUrl('test', 'José', 'María', 'Spanish');
      const decodedSvg = decodeURIComponent(url.split(',')[1]);
      expect(decodedSvg).toContain('JM');
    });
  });
});