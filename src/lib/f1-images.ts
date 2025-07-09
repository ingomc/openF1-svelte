// F1 Images Service - Provides URLs for driver photos, circuit maps, and team logos

export interface F1ImageUrls {
  driver?: string;
  driverAvatar?: string; // Generated avatar fallback
  circuit?: string;
  team?: string;
  helmet?: string;
  trackMap?: string;
}

// Function to generate driver avatar with initials
function generateDriverAvatar(givenName?: string, familyName?: string, nationality?: string): string {
  const initials = [givenName?.[0], familyName?.[0]].filter(Boolean).join('') || '?';
  
  // Color scheme based on nationality for visual consistency
  const nationalityColors: Record<string, string> = {
    'Netherlands': '#FF6B35',
    'British': '#E63946',
    'German': '#FFC233',
    'Spanish': '#FF006E',
    'Mexican': '#8AC926',
    'French': '#4895EF',
    'Canadian': '#F72585',
    'Australian': '#90E0EF',
    'Japanese': '#F77F00',
    'Finnish': '#560BAD',
    'Danish': '#FB8500',
    'Thai': '#FFBE0B',
    'Chinese': '#DC2F02',
    'American': '#0077B6',
    'Monégasque': '#F72585',
    'Italian': '#06D6A0',
    'Belgian': '#F8961E',
    'Swiss': '#6A4C93'
  };

  const backgroundColor = nationalityColors[nationality || ''] || '#6C757D';
  
  const svgContent = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="200" fill="${backgroundColor}"/>
      <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
      <text x="200" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">${initials}</text>
      <text x="200" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)">${nationality || 'F1 Driver'}</text>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

// Driver photos - Using multiple reliable sources with fallbacks
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

  // Wikipedia/Wikimedia Commons driver images as reliable fallback
  const wikipediaDriverImages: Record<string, string> = {
    // Current drivers
    'verstappen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Max_Verstappen_2023_Bahrain_GP.jpg/400px-Max_Verstappen_2023_Bahrain_GP.jpg',
    'hamilton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg/400px-Lewis_Hamilton_2016_Malaysia_2.jpg',
    'leclerc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Charles_Leclerc_2019_Bahrain.jpg/400px-Charles_Leclerc_2019_Bahrain.jpg',
    'russell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/George_Russell_2022_British_GP.jpg/400px-George_Russell_2022_British_GP.jpg',
    'sainz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Carlos_Sainz_Jr._2022_Bahrain_GP.jpg/400px-Carlos_Sainz_Jr._2022_Bahrain_GP.jpg',
    'perez': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sergio_P%C3%A9rez_2022_Bahrain_GP.jpg/400px-Sergio_P%C3%A9rez_2022_Bahrain_GP.jpg',
    'norris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lando_Norris_2023_Bahrain_GP.jpg/400px-Lando_Norris_2023_Bahrain_GP.jpg',
    'piastri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Oscar_Piastri_2023_Bahrain_GP.jpg/400px-Oscar_Piastri_2023_Bahrain_GP.jpg',
    'alonso': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Fernando_Alonso_2022_Bahrain_GP.jpg/400px-Fernando_Alonso_2022_Bahrain_GP.jpg',
    'ocon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Esteban_Ocon_2023_Bahrain_GP.jpg/400px-Esteban_Ocon_2023_Bahrain_GP.jpg',
    'gasly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pierre_Gasly_2023_Bahrain_GP.jpg/400px-Pierre_Gasly_2023_Bahrain_GP.jpg',
    'stroll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Lance_Stroll_2023_Bahrain_GP.jpg/400px-Lance_Stroll_2023_Bahrain_GP.jpg',
    'tsunoda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Yuki_Tsunoda_2023_Bahrain_GP.jpg/400px-Yuki_Tsunoda_2023_Bahrain_GP.jpg',
    'albon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Alexander_Albon_2023_Bahrain_GP.jpg/400px-Alexander_Albon_2023_Bahrain_GP.jpg',
    'bottas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Valtteri_Bottas_2023_Bahrain_GP.jpg/400px-Valtteri_Bottas_2023_Bahrain_GP.jpg',
    'zhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Zhou_Guanyu_2023_Bahrain_GP.jpg/400px-Zhou_Guanyu_2023_Bahrain_GP.jpg',
    'magnussen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Kevin_Magnussen_2023_Bahrain_GP.jpg/400px-Kevin_Magnussen_2023_Bahrain_GP.jpg',
    'hulkenberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Nico_H%C3%BClkenberg_2023_Bahrain_GP.jpg/400px-Nico_H%C3%BClkenberg_2023_Bahrain_GP.jpg',
    
    // Legacy drivers - well-known Wikipedia images
    'ricciardo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Daniel_Ricciardo_2022_Bahrain_GP.jpg/400px-Daniel_Ricciardo_2022_Bahrain_GP.jpg',
    'vettel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sebastian_Vettel_2019_Canadian_GP.jpg/400px-Sebastian_Vettel_2019_Canadian_GP.jpg',
    'raikkonen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Kimi_R%C3%A4ikk%C3%B6nen_2018_Malaysian_GP.jpg/400px-Kimi_R%C3%A4ikk%C3%B6nen_2018_Malaysian_GP.jpg',
    'schumacher': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mick_Schumacher_2022_Bahrain_GP.jpg/400px-Mick_Schumacher_2022_Bahrain_GP.jpg',
  };

// Function to generate driver avatar with initials
function generateDriverAvatar(givenName?: string, familyName?: string, nationality?: string): string {
  const initials = [givenName?.[0], familyName?.[0]].filter(Boolean).join('') || '?';
  
  // Color scheme based on nationality for visual consistency
  const nationalityColors: Record<string, string> = {
    'Netherlands': '#FF6B35',
    'British': '#E63946',
    'German': '#FFC233',
    'Spanish': '#FF006E',
    'Mexican': '#8AC926',
    'French': '#4895EF',
    'Canadian': '#F72585',
    'Australian': '#90E0EF',
    'Japanese': '#F77F00',
    'Finnish': '#560BAD',
    'Danish': '#FB8500',
    'Thai': '#FFBE0B',
    'Chinese': '#DC2F02',
    'American': '#0077B6',
    'Monégasque': '#F72585',
    'Italian': '#06D6A0',
    'Belgian': '#F8961E',
    'Swiss': '#6A4C93'
  };

  const backgroundColor = nationalityColors[nationality || ''] || '#6C757D';
  
  const svgContent = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="200" fill="${backgroundColor}"/>
      <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
      <text x="200" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">${initials}</text>
      <text x="200" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)">${nationality || 'F1 Driver'}</text>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

  
  // Try direct mapping first - Official F1 API
  if (driverMappings[driverId]) {
    const mapping = driverMappings[driverId];
    return getOfficialF1Image(mapping.code, mapping.team);
  }
  
  // Try family name mapping for F1 API
  if (familyName && driverMappings[familyName.toLowerCase()]) {
    const mapping = driverMappings[familyName.toLowerCase()];
    return getOfficialF1Image(mapping.code, mapping.team);
  }
  
  // Wikipedia fallback - more reliable for legacy drivers
  const wikipediaUrl = getWikipediaImage(driverId, familyName);
  if (wikipediaUrl) {
    return wikipediaUrl;
  }
  
  // Create a generic driver code if we have name info for F1 API fallback
  if (givenName && familyName) {
    // Generate a simple code pattern: first 3 letters of given name + first 3 of family name + 01
    const generatedCode = (givenName.substring(0, 3) + familyName.substring(0, 3) + '01').toLowerCase();
    return getOfficialF1Image(generatedCode, 'fallback');
  }
  
  // Ultimate fallback - return a static F1 fallback image
  return `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2025:fallback:driver:2025fallbackdriverright.webp/v1740000000/common/f1/2025/fallback/fallback/2025fallbackfallbackright.webp`;
}

// Get driver avatar (generated with initials) - used as tertiary fallback
export function getDriverAvatarUrl(driverId: string, givenName?: string, familyName?: string, nationality?: string): string {
  return generateDriverAvatar(givenName, familyName, nationality);
}

// Get Wikipedia image URL for a driver - used as secondary fallback
export function getWikipediaImage(driverId: string, familyName?: string): string | null {
  // Wikipedia/Wikimedia Commons driver images as reliable fallback
  const wikipediaDriverImages: Record<string, string> = {
    // Current drivers
    'verstappen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Max_Verstappen_2023_Bahrain_GP.jpg/400px-Max_Verstappen_2023_Bahrain_GP.jpg',
    'hamilton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg/400px-Lewis_Hamilton_2016_Malaysia_2.jpg',
    'leclerc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Charles_Leclerc_2019_Bahrain.jpg/400px-Charles_Leclerc_2019_Bahrain.jpg',
    'russell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/George_Russell_2022_British_GP.jpg/400px-George_Russell_2022_British_GP.jpg',
    'sainz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Carlos_Sainz_Jr._2022_Bahrain_GP.jpg/400px-Carlos_Sainz_Jr._2022_Bahrain_GP.jpg',
    'perez': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sergio_P%C3%A9rez_2022_Bahrain_GP.jpg/400px-Sergio_P%C3%A9rez_2022_Bahrain_GP.jpg',
    'norris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lando_Norris_2023_Bahrain_GP.jpg/400px-Lando_Norris_2023_Bahrain_GP.jpg',
    'piastri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Oscar_Piastri_2023_Bahrain_GP.jpg/400px-Oscar_Piastri_2023_Bahrain_GP.jpg',
    'alonso': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Fernando_Alonso_2022_Bahrain_GP.jpg/400px-Fernando_Alonso_2022_Bahrain_GP.jpg',
    'ocon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Esteban_Ocon_2023_Bahrain_GP.jpg/400px-Esteban_Ocon_2023_Bahrain_GP.jpg',
    'gasly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pierre_Gasly_2023_Bahrain_GP.jpg/400px-Pierre_Gasly_2023_Bahrain_GP.jpg',
    'stroll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Lance_Stroll_2023_Bahrain_GP.jpg/400px-Lance_Stroll_2023_Bahrain_GP.jpg',
    'tsunoda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Yuki_Tsunoda_2023_Bahrain_GP.jpg/400px-Yuki_Tsunoda_2023_Bahrain_GP.jpg',
    'albon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Alexander_Albon_2023_Bahrain_GP.jpg/400px-Alexander_Albon_2023_Bahrain_GP.jpg',
    'bottas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Valtteri_Bottas_2023_Bahrain_GP.jpg/400px-Valtteri_Bottas_2023_Bahrain_GP.jpg',
    'zhou': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Zhou_Guanyu_2023_Bahrain_GP.jpg/400px-Zhou_Guanyu_2023_Bahrain_GP.jpg',
    'magnussen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Kevin_Magnussen_2023_Bahrain_GP.jpg/400px-Kevin_Magnussen_2023_Bahrain_GP.jpg',
    'hulkenberg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Nico_H%C3%BClkenberg_2023_Bahrain_GP.jpg/400px-Nico_H%C3%BClkenberg_2023_Bahrain_GP.jpg',
    
    // Legacy drivers - well-known Wikipedia images
    'ricciardo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Daniel_Ricciardo_2022_Bahrain_GP.jpg/400px-Daniel_Ricciardo_2022_Bahrain_GP.jpg',
    'vettel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sebastian_Vettel_2019_Canadian_GP.jpg/400px-Sebastian_Vettel_2019_Canadian_GP.jpg',
    'raikkonen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Kimi_R%C3%A4ikk%C3%B6nen_2018_Malaysian_GP.jpg/400px-Kimi_R%C3%A4ikk%C3%B6nen_2018_Malaysian_GP.jpg',
    'schumacher': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mick_Schumacher_2022_Bahrain_GP.jpg/400px-Mick_Schumacher_2022_Bahrain_GP.jpg',
    'sargeant': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Logan_Sargeant_2023_Bahrain_GP.jpg/400px-Logan_Sargeant_2023_Bahrain_GP.jpg'
  };

  // Try direct driverId mapping first
  if (wikipediaDriverImages[driverId]) {
    return wikipediaDriverImages[driverId];
  }
  
  // Try family name mapping
  if (familyName && wikipediaDriverImages[familyName.toLowerCase()]) {
    return wikipediaDriverImages[familyName.toLowerCase()];
  }
  
  return null;
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
    driverAvatar: getDriverAvatarUrl(driverId, givenName, familyName, nationality),
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

// Enhanced function to check if an image URL is valid and provide multiple fallbacks
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

// Enhanced function with multiple fallback levels
export function getImageWithMultipleFallbacks(
  primaryUrl: string, 
  secondaryUrl: string, 
  tertiaryUrl: string, 
  ultimateUrl: string
): Promise<string> {
  return new Promise((resolve) => {
    // Try primary URL first
    const tryPrimary = new Image();
    tryPrimary.onload = () => resolve(primaryUrl);
    tryPrimary.onerror = () => {
      // Try secondary URL (Wikipedia)
      const trySecondary = new Image();
      trySecondary.onload = () => resolve(secondaryUrl);
      trySecondary.onerror = () => {
        // Try tertiary URL (generated avatar)
        const tryTertiary = new Image();
        tryTertiary.onload = () => resolve(tertiaryUrl);
        tryTertiary.onerror = () => resolve(ultimateUrl);
        tryTertiary.src = tertiaryUrl;
      };
      trySecondary.src = secondaryUrl;
    };
    tryPrimary.src = primaryUrl;
    
    // Timeout fallback - go to ultimate after 8 seconds
    setTimeout(() => resolve(ultimateUrl), 8000);
  });
}
