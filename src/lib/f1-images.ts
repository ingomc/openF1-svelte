// F1 Images Service - Provides URLs for driver photos, circuit maps, and team logos

export interface F1ImageUrls {
  driver?: string;
  circuit?: string;
  team?: string;
  helmet?: string;
  trackMap?: string;
}

// Driver photos - Using official Formula 1 media API
export function getDriverImageUrl(driverId: string, givenName?: string, familyName?: string): string {
  // Official F1 driver image pattern
  const getOfficialF1Image = (driverCode: string, teamCode: string = 'fallback') => {
    const year = new Date().getFullYear();
    return `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:${year}:fallback:driver:${year}fallbackdriverright.webp/v1740000000/common/f1/${year}/${teamCode}/${driverCode}/${year}${teamCode}${driverCode}right.webp`;
  };

  // Driver ID to official F1 codes mapping (drivercode + team)
  const driverMappings: Record<string, { code: string; team: string }> = {
    'verstappen': { code: 'maxver01', team: 'redbull' },
    'perez': { code: 'serper01', team: 'redbull' },
    'leclerc': { code: 'chalec01', team: 'ferrari' },
    'sainz': { code: 'carsai01', team: 'williams' }, // 2025 move
    'hamilton': { code: 'lewham01', team: 'ferrari' }, // 2025 move
    'russell': { code: 'georus01', team: 'mercedes' },
    'norris': { code: 'lannor01', team: 'mclaren' },
    'piastri': { code: 'oscpia01', team: 'mclaren' },
    'alonso': { code: 'feralo01', team: 'astonmartin' },
    'stroll': { code: 'lanstr01', team: 'astonmartin' },
    'gasly': { code: 'piegas01', team: 'alpine' },
    'ocon': { code: 'estoco01', team: 'alpine' },
    'albon': { code: 'alealb01', team: 'williams' },
    'colapinto': { code: 'fraCol01', team: 'williams' }, // 2025 speculation
    'tsunoda': { code: 'yuktsu01', team: 'rb' },
    'lawson': { code: 'lialaw01', team: 'rb' }, // 2025 speculation
    'bottas': { code: 'valbot01', team: 'kicksauber' },
    'zhou': { code: 'guazho01', team: 'kicksauber' },
    'magnussen': { code: 'kevmag01', team: 'haas' },
    'hulkenberg': { code: 'nichul01', team: 'haas' },
    'bearman': { code: 'olibea01', team: 'haas' }, // 2025 speculation
    
    // Legacy drivers with fallback
    'ricciardo': { code: 'danric01', team: 'fallback' },
    'sargeant': { code: 'logsar01', team: 'fallback' },
    'vettel': { code: 'sebvet01', team: 'fallback' },
    'raikkonen': { code: 'kimrai01', team: 'fallback' },
    'schumacher': { code: 'micsch02', team: 'fallback' },
    'antonelli': { code: 'kimant01', team: 'mercedes' } // 2025 speculation
  };
  
  // Try direct mapping first
  if (driverMappings[driverId]) {
    const mapping = driverMappings[driverId];
    return getOfficialF1Image(mapping.code, mapping.team);
  }
  
  // Try family name mapping
  if (familyName && driverMappings[familyName.toLowerCase()]) {
    const mapping = driverMappings[familyName.toLowerCase()];
    return getOfficialF1Image(mapping.code, mapping.team);
  }
  
  // Create a generic driver code if we have name info
  if (givenName && familyName) {
    // Generate a simple code pattern: first 3 letters of given name + first 3 of family name + 01
    const generatedCode = (givenName.substring(0, 3) + familyName.substring(0, 3) + '01').toLowerCase();
    return getOfficialF1Image(generatedCode, 'fallback');
  }
  
  // Ultimate fallback - return the F1 fallback image
  return `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2025:fallback:driver:2025fallbackdriverright.webp/v1740000000/common/f1/2025/fallback/fallback/2025fallbackfallbackright.webp`;
}

// Circuit images and track maps - Using real track images and reliable sources
export function getCircuitImageUrl(circuitId: string, circuitName?: string): string {
  // Real circuit images from various reliable sources
  const circuitImages: Record<string, string> = {
    // Major circuits with real track images
    'monaco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monte_Carlo_Formula_1_track_map.svg/400px-Monte_Carlo_Formula_1_track_map.svg.png',
    'silverstone': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Silverstone_Circuit_2020.svg/400px-Silverstone_Circuit_2020.svg.png',
    'monza': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Monza_track_map.svg/400px-Monza_track_map.svg.png',
    'spa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_Belgium.svg/400px-Spa-Francorchamps_of_Belgium.svg.png',
    'suzuka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Suzuka_circuit_map--Sting.svg/400px-Suzuka_circuit_map--Sting.svg.png',
    'interlagos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28AKA_Interlagos%29_track_map.svg/400px-Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28AKA_Interlagos%29_track_map.svg.png',
    'albert_park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Albert_Park_Circuit_track_map.svg/400px-Albert_Park_Circuit_track_map.svg.png',
    'bahrain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg/400px-Bahrain_International_Circuit--Grand_Prix_Layout.svg.png',
    'catalunya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Catalunya.svg/400px-Catalunya.svg.png',
    'red_bull_ring': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/A1-Ring_track_map.svg/400px-A1-Ring_track_map.svg.png',
    'hungaroring': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hungaroring.svg/400px-Hungaroring.svg.png',
    'zandvoort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Zandvoort.svg/400px-Zandvoort.svg.png',
    'baku': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Baku_City_Circuit_track_map.svg/400px-Baku_City_Circuit_track_map.svg.png',
    'singapore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Singapore_Street_Circuit_track_map.svg/400px-Singapore_Street_Circuit_track_map.svg.png',
    'austin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/400px-Austin_circuit.svg.png',
    'mexico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg/400px-Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg.png',
    'yas_marina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Yas_Marina_Circuit.svg/400px-Yas_Marina_Circuit.svg.png',
    'jeddah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Jeddah_Corniche_Circuit_track_map.svg/400px-Jeddah_Corniche_Circuit_track_map.svg.png',
    'imola': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Imola.svg/400px-Imola.svg.png',
    'miami': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Miami_International_Autodrome_track_map.svg/400px-Miami_International_Autodrome_track_map.svg.png',
    'las_vegas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Las_Vegas_Strip_Circuit_track_map.svg/400px-Las_Vegas_Strip_Circuit_track_map.svg.png',
    
    // Additional circuits
    'villeneuve': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Circuit_Gilles_Villeneuve.svg/400px-Circuit_Gilles_Villeneuve.svg.png',
    'paul_ricard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Paul_Ricard_Circuit.svg/400px-Paul_Ricard_Circuit.svg.png',
    'nurburgring': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/N%C3%BCrburgring_GP-Strecke.svg/400px-N%C3%BCrburgring_GP-Strecke.svg.png',
    'hockenheimring': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hockenheimring.svg/400px-Hockenheimring.svg.png'
  };
  
  // Simple but clean fallback for unknown circuits
  const createSimpleFallback = (name: string) => {
    const svgContent = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
        <circle cx="200" cy="100" r="60" fill="none" stroke="#6c757d" stroke-width="4"/>
        <text x="200" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#495057">${name}</text>
        <text x="200" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6c757d">F1 Circuit</text>
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };
  
  // Try direct circuitId match with real track images
  if (circuitImages[circuitId]) {
    return circuitImages[circuitId];
  }
  
  // Try some common alternative names
  const alternativeNames: Record<string, string> = {
    'Circuit de Monaco': 'monaco',
    'Silverstone Circuit': 'silverstone',
    'Autodromo Nazionale Monza': 'monza',
    'Circuit de Spa-Francorchamps': 'spa',
    'Suzuka International Racing Course': 'suzuka',
    'Autódromo José Carlos Pace': 'interlagos',
    'Albert Park Grand Prix Circuit': 'albert_park',
    'Bahrain International Circuit': 'bahrain',
    'Circuit de Barcelona-Catalunya': 'catalunya',
    'Red Bull Ring': 'red_bull_ring',
    'Hungaroring': 'hungaroring',
    'Circuit Zandvoort': 'zandvoort',
    'Baku City Circuit': 'baku',
    'Marina Bay Street Circuit': 'singapore',
    'Circuit of The Americas': 'austin',
    'Autódromo Hermanos Rodríguez': 'mexico',
    'Yas Marina Circuit': 'yas_marina',
    'Jeddah Corniche Circuit': 'jeddah',
    'Autodromo Enzo e Dino Ferrari': 'imola',
    'Miami International Autodrome': 'miami',
    'Las Vegas Strip Circuit': 'las_vegas'
  };
  
  if (circuitName && alternativeNames[circuitName]) {
    const mappedId = alternativeNames[circuitName];
    if (circuitImages[mappedId]) {
      return circuitImages[mappedId];
    }
  }
  
  // Fallback to a simple, clean placeholder
  const displayName = circuitName ?? circuitId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return createSimpleFallback(displayName);
}

// Team/Constructor logos - Using simpler, more reliable sources
export function getTeamLogoUrl(constructorId: string): string {
  // Helper function to generate team color badges
  const generateTeamBadge = (name: string, color: string) => {
    const svgContent = `
      <svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="80" rx="8" fill="${color}"/>
        <text x="100" y="45" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">${name}</text>
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const teamLogos: Record<string, string> = {
    // 2024/2025 Teams with consistent branding
    'red_bull': generateTeamBadge('RED BULL', '#3671C6'),
    'ferrari': generateTeamBadge('FERRARI', '#F91536'),
    'mercedes': generateTeamBadge('MERCEDES', '#6CD3BF'),
    'mclaren': generateTeamBadge('MCLAREN', '#FF8000'),
    'alpine': generateTeamBadge('ALPINE', '#2293D1'),
    'aston_martin': generateTeamBadge('ASTON MARTIN', '#358C75'),
    'williams': generateTeamBadge('WILLIAMS', '#37003C'),
    'alphatauri': generateTeamBadge('ALPHATAURI', '#5E8FAA'),
    'rb': generateTeamBadge('RB', '#6692FF'),
    'visa_rb': generateTeamBadge('VISA RB', '#6692FF'),
    'alfa': generateTeamBadge('ALFA ROMEO', '#C92D4B'),
    'kick_sauber': generateTeamBadge('KICK SAUBER', '#52E252'),
    'sauber': generateTeamBadge('SAUBER', '#52E252'),
    'haas': generateTeamBadge('HAAS', '#B6BABD'),
    
    // Legacy teams
    'force_india': generateTeamBadge('FORCE INDIA', '#FF80C7'),
    'racing_point': generateTeamBadge('RACING POINT', '#FF80C7'),
    'renault': generateTeamBadge('RENAULT', '#FDF503'),
    'lotus_f1': generateTeamBadge('LOTUS', '#FFB800'),
    'toro_rosso': generateTeamBadge('TORO ROSSO', '#469BFF'),
    'manor': generateTeamBadge('MANOR', '#6E0000'),
    'caterham': generateTeamBadge('CATERHAM', '#0B5345')
  };
  
  return teamLogos[constructorId] || generateTeamBadge(constructorId.toUpperCase().replace('_', ' '), '#666666');
}

// Country flags (backup to our existing function)
export function getCountryFlagUrl(country: string): string {
  const flagUrls: Record<string, string> = {
    'Netherlands': 'https://flagcdn.com/w320/nl.png',
    'Monaco': 'https://flagcdn.com/w320/mc.png',
    'United Kingdom': 'https://flagcdn.com/w320/gb.png',
    'Spain': 'https://flagcdn.com/w320/es.png',
    'Mexico': 'https://flagcdn.com/w320/mx.png',
    'Germany': 'https://flagcdn.com/w320/de.png',
    'France': 'https://flagcdn.com/w320/fr.png',
    'Canada': 'https://flagcdn.com/w320/ca.png',
    'Australia': 'https://flagcdn.com/w320/au.png',
    'Japan': 'https://flagcdn.com/w320/jp.png',
    'Finland': 'https://flagcdn.com/w320/fi.png',
    'Denmark': 'https://flagcdn.com/w320/dk.png',
    'Thailand': 'https://flagcdn.com/w320/th.png',
    'China': 'https://flagcdn.com/w320/cn.png',
    'United States': 'https://flagcdn.com/w320/us.png',
    'New Zealand': 'https://flagcdn.com/w320/nz.png',
    'Argentina': 'https://flagcdn.com/w320/ar.png',
    'Italy': 'https://flagcdn.com/w320/it.png',
    'Belgium': 'https://flagcdn.com/w320/be.png',
    'Austria': 'https://flagcdn.com/w320/at.png',
    'Switzerland': 'https://flagcdn.com/w320/ch.png',
    'Brazil': 'https://flagcdn.com/w320/br.png',
    'Russia': 'https://flagcdn.com/w320/ru.png',
    'Poland': 'https://flagcdn.com/w320/pl.png',
    'South Africa': 'https://flagcdn.com/w320/za.png'
  };
  
  return flagUrls[country] || 'https://via.placeholder.com/320x200/e8e8e8/999999?text=🏁';
}

// Helper function to get all images for a driver with better fallbacks
export function getDriverImages(driverId: string, nationality: string, constructorId?: string, givenName?: string, familyName?: string): F1ImageUrls {
  const helmetSvg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#f8f9fa" stroke="#ddd" stroke-width="2"/>
      <circle cx="100" cy="80" r="50" fill="#fff" stroke="#ccc" stroke-width="1"/>
      <text x="100" y="160" text-anchor="middle" font-family="Arial" font-size="24">⛑️</text>
    </svg>
  `;
  
  return {
    driver: getDriverImageUrl(driverId, givenName, familyName),
    team: constructorId ? getTeamLogoUrl(constructorId) : undefined,
    helmet: `data:image/svg+xml,${encodeURIComponent(helmetSvg)}`
  };
}

// Helper function to get all images for a circuit with better fallbacks
export function getCircuitImages(circuitId: string, country: string, circuitName?: string): F1ImageUrls {
  return {
    circuit: getCircuitImageUrl(circuitId, circuitName),
    trackMap: getCircuitImageUrl(circuitId, circuitName)
  };
}

// Enhanced function to check if an image URL is valid and provide fallback
export function getImageWithFallback(primaryUrl: string, fallbackUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(primaryUrl);
    img.onerror = () => resolve(fallbackUrl);
    img.src = primaryUrl;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(fallbackUrl), 5000);
  });
}
