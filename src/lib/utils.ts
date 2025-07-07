// Utility functions for F1 Dashboard
import { getDriverImageUrl, getCircuitImageUrl, getTeamLogoUrl, getDriverImages, getCircuitImages } from './f1-images';

// Export image functions
export { getDriverImageUrl, getCircuitImageUrl, getTeamLogoUrl, getDriverImages, getCircuitImages };

export function getDriverFlag(nationality: string): string {
  const flags: Record<string, string> = {
    'Dutch': '🇳🇱',
    'Monégasque': '🇲🇨',
    'Monaco': '🇲🇨',
    'British': '🇬🇧',
    'Spanish': '🇪🇸',
    'Mexican': '🇲🇽',
    'German': '🇩🇪',
    'French': '🇫🇷',
    'Canadian': '🇨🇦',
    'Australian': '🇦🇺',
    'Japanese': '🇯🇵',
    'Finnish': '🇫🇮',
    'Danish': '🇩🇰',
    'Thai': '🇹🇭',
    'Chinese': '🇨🇳',
    'American': '🇺🇸',
    'New Zealander': '🇳🇿',
    'Argentine': '🇦🇷',
    'Italian': '🇮🇹',
    'Belgian': '🇧🇪',
    'Austrian': '🇦🇹',
    'Swiss': '🇨🇭',
    'Brazilian': '🇧🇷',
    'Russian': '🇷🇺',
    'Polish': '🇵🇱',
    'South African': '🇿🇦',
    'Norwegian': '🇳🇴',
    'Swedish': '🇸🇪',
    'Portuguese': '🇵🇹',
    'Hungarian': '🇭🇺',
    'Czech': '🇨🇿',
    'Colombian': '🇨🇴',
    'Venezuelan': '🇻🇪',
    'Uruguayan': '🇺🇾',
    'Chilean': '🇨🇱',
    'Indian': '🇮🇳',
    'Malaysian': '🇲🇾',
    'Indonesian': '🇮🇩'
  };
  
  return flags[nationality] || '🏁';
}

export function getTeamColor(constructorId: string): string {
  const colors: Record<string, string> = {
    'red_bull': '#1E41FF',
    'ferrari': '#DC143C',
    'mercedes': '#00D2BE',
    'mclaren': '#FF8700',
    'alpine': '#0090FF',
    'aston_martin': '#006F62',
    'williams': '#005AFF',
    'alphatauri': '#2B4562',
    'alfa': '#900000',
    'haas': '#FFFFFF',
    'kick_sauber': '#52C41A',
    'racing_point': '#F596C8',
    'renault': '#FFF500',
    'toro_rosso': '#469BFF',
    'force_india': '#F596C8',
    'sauber': '#9B0000',
    'manor': '#6E2C00',
    'lotus': '#FFB800',
    'caterham': '#005030',
    'marussia': '#6E2C00'
  };
  
  return colors[constructorId] || '#666';
}

export function formatTime(timeString: string): string {
  if (!timeString || timeString === 'null' || timeString === 'undefined') return 'N/A';
  return timeString;
}

export function formatLapTime(time: string): string {
  if (!time || time === 'null' || time === 'undefined') return 'N/A';
  // Parse lap time like "1:20.456" or "80.456"
  if (time.includes(':')) {
    return time;
  } else {
    const seconds = parseFloat(time);
    if (isNaN(seconds)) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);
    return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
  }
}

export function formatSpeed(speed: any): string {
  if (!speed || speed === 'null' || speed === 'undefined') return 'N/A';
  const speedNum = parseFloat(speed);
  if (isNaN(speedNum)) return 'N/A';
  return `${speedNum.toFixed(1)} km/h`;
}

export function formatRound(round: any): string {
  if (!round || round === 'null' || round === 'undefined') return '?';
  const roundNum = parseInt(round);
  if (isNaN(roundNum)) return '?';
  return roundNum.toString();
}

export function formatPoints(points: any): string {
  if (!points || points === 'null' || points === 'undefined') return '0';
  const pointsNum = parseFloat(points);
  if (isNaN(pointsNum)) return '0';
  return pointsNum.toString();
}

export function formatPosition(position: any): string {
  if (!position || position === 'null' || position === 'undefined') return '?';
  const posNum = parseInt(position);
  if (isNaN(posNum)) return '?';
  return posNum.toString();
}

export function formatWins(wins: any): string {
  if (!wins || wins === 'null' || wins === 'undefined') return '0';
  const winsNum = parseInt(wins);
  if (isNaN(winsNum)) return '0';
  return winsNum.toString();
}

export function formatBirthDate(dateString: string): string {
  if (!dateString) return 'Unbekannt';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
}

export function calculateAge(dateString: string): number {
  if (!dateString) return 0;
  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) return 0; // Handle invalid dates
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getYearsAgo(dateString: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 0; // Handle invalid dates
  const today = new Date();
  return today.getFullYear() - date.getFullYear();
}
