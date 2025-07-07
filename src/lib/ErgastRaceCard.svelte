<script lang="ts">
  import type { ProcessedRace, ProcessedSession, ErgastQualifyingResult, ErgastRaceResult } from './ergast-service';
  import { ergastService } from './ergast-service';
  
  export let race: ProcessedRace;
  export let isExpanded: boolean = false;
  export let totalRaces: number = 0;
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatTime(timeString?: string): string {
    if (!timeString) return 'TBA';
    return timeString.slice(0, 5); // HH:MM format
  }
  
  function formatDateTime(dateString: string, timeString?: string): string {
    const date = new Date(`${dateString}T${timeString ?? '00:00:00'}`);
    return date.toLocaleString('de-DE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function getCountryFlag(country: string): string {
    const flagMap: { [key: string]: string } = {
      'Australia': '🇦🇺',
      'Bahrain': '🇧🇭', 
      'Saudi Arabia': '🇸🇦',
      'Azerbaijan': '🇦🇿',
      'USA': '🇺🇸',
      'United States': '🇺🇸',
      'Miami': '🇺🇸',
      'Italy': '🇮🇹',
      'Monaco': '🇲🇨',
      'Spain': '🇪🇸',
      'Canada': '🇨🇦',
      'Austria': '🇦🇹',
      'UK': '🇬🇧',
      'Great Britain': '🇬🇧',
      'Hungary': '🇭🇺',
      'Belgium': '🇧🇪',
      'Netherlands': '🇳🇱',
      'Singapore': '🇸🇬',
      'Japan': '🇯🇵',
      'Qatar': '🇶🇦',
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'Las Vegas': '🇺🇸',
      'Abu Dhabi': '🇦🇪',
      'UAE': '🇦🇪',
      'France': '🇫🇷',
      'Turkey': '🇹🇷',
      'Russia': '🇷🇺',
      'Portugal': '🇵🇹',
      'Germany': '🇩🇪',
      'China': '🇨🇳'
    };
    return flagMap[country] || '🏁';
  }

  function getCircuitImage(circuitId: string): string {
    // Placeholder für Circuit-Bilder - könnte später durch echte URLs ersetzt werden
    return `https://media.formula1.com/image/upload/f_auto,c_limit,w_195,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuitId}`;
  }

  function getRaceWeekendStatus(): string {
    if (race.isUpcoming) {
      const now = new Date();
      const raceDate = new Date(race.date);
      const daysUntil = Math.ceil((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil === 0) return 'Heute!';
      if (daysUntil === 1) return 'Morgen';
      if (daysUntil <= 7) return `In ${daysUntil} Tagen`;
      return `In ${Math.ceil(daysUntil / 7)} Wochen`;
    }
    return 'Abgeschlossen';
  }
  
  function getSessionColor(sessionType: string): string {
    const colors = {
      'practice1': '#4CAF50',
      'practice2': '#4CAF50', 
      'practice3': '#4CAF50',
      'qualifying': '#FF9800',
      'sprint': '#9C27B0',
      'race': '#F44336'
    };
    return colors[sessionType as keyof typeof colors] || '#757575';
  }
  
  async function loadSessionResults(session: ProcessedSession) {
    if (session.isLoaded || session.isLoading) return;
    
    session.isLoading = true;
    const year = parseInt(race.season);
    const round = parseInt(race.round);
    
    try {
      switch (session.type) {
        case 'qualifying':
          session.results = await ergastService.getQualifyingResults(year, round);
          break;
        case 'race':
          session.results = await ergastService.getRaceResults(year, round);
          break;
        case 'sprint':
          session.results = await ergastService.getSprintResults(year, round);
          break;
        default:
          session.results = []; // Practice sessions haben keine Results in Ergast
          break;
      }
      session.isLoaded = true;
      race = race; // Trigger reactivity
    } catch (error) {
      console.error('Error loading session results:', error);
      alert('Fehler beim Laden der Session-Ergebnisse.');
    } finally {
      session.isLoading = false;
    }
  }
  
  function formatQualifyingTime(result: ErgastQualifyingResult): string {
    return result.Q3 ?? result.Q2 ?? result.Q1 ?? '--';
  }
  
  function formatQualifyingDelta(result: ErgastQualifyingResult, pole: ErgastQualifyingResult): string {
    if (result.position === '1') return '--';
    
    const resultTime = result.Q3 ?? result.Q2 ?? result.Q1;
    const poleTime = pole.Q3 ?? pole.Q2 ?? pole.Q1;
    
    if (!resultTime || !poleTime) return '--';
    
    // Convert MM:SS.SSS to seconds
    const parseTime = (timeStr: string) => {
      const parts = timeStr.split(':');
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    };
    
    try {
      const delta = parseTime(resultTime) - parseTime(poleTime);
      return delta > 0 ? `+${delta.toFixed(3)}` : '--';
    } catch {
      return '--';
    }
  }
  
  function formatRaceTime(result: ErgastRaceResult): string {
    if (result.position === '1' && result.Time) {
      return result.Time.time;
    }
    if (result.Time) {
      // Entferne bereits vorhandene + Zeichen um doppelte ++ zu vermeiden
      const time = result.Time.time.startsWith('+') ? result.Time.time : `+${result.Time.time}`;
      return time;
    }
    if (result.status !== 'Finished') {
      return result.status;
    }
    return '--';
  }

  function formatRaceTimeOnly(result: ErgastRaceResult): string {
    // Bei Position 1: Zeige die absolute Rennzeit
    if (result.position === '1' && result.Time) {
      return result.Time.time;
    }
    
    // Bei normaler Zeit: Zeige Zeitrückstand
    if (result.Time && result.status === 'Finished') {
      const time = result.Time.time.startsWith('+') ? result.Time.time : `+${result.Time.time}`;
      return time;
    }
    
    // Alles andere: Kein Zeitwert
    return '--';
  }

  function formatRaceTimeWithLaps(result: ErgastRaceResult, allResults: ErgastRaceResult[]): string {
    // Bei Position 1: Zeige die absolute Rennzeit
    if (result.position === '1' && result.Time) {
      return result.Time.time;
    }
    
    // Bei normaler Zeit und Finished: Zeige Zeitrückstand
    if (result.Time && result.status === 'Finished') {
      const time = result.Time.time.startsWith('+') ? result.Time.time : `+${result.Time.time}`;
      return time;
    }
    
    // Bei "lapped" Fahrern (Status enthält "Lap"): Zeige Lap-Status
    if (result.status && (result.status.includes('Lap') || result.status === 'Lapped')) {
      if (result.status === '+1 Lap') {
        return '+1 Runde';
      } else if (result.status === '+2 Laps') {
        return '+2 Runden';
      } else if (result.status.match(/^\+(\d+) Lap/)) {
        const laps = result.status.match(/^\+(\d+) Lap/)?.[1];
        return `+${laps} Runden`;
      } else if (result.status === 'Lapped') {
        // Fallback: Berechne aus den gefahrenen Runden
        if (result.laps && allResults.length > 0) {
          const maxLaps = Math.max(...allResults.map(r => parseInt(r.laps) || 0));
          const driverLaps = parseInt(result.laps) || 0;
          const lapsDifference = maxLaps - driverLaps;
          
          if (lapsDifference === 1) {
            return '+1 Runde';
          } else if (lapsDifference > 1) {
            return `+${lapsDifference} Runden`;
          }
        }
        return 'Überrundet';
      }
      return result.status; // Fallback für andere Lap-Status
    }
    
    // Bei anderen nicht-finishern: Zeige entsprechendes Emoji
    if (result.status !== 'Finished') {
      if (result.status === 'Retired') {
        return '❌';
      } else if (result.status === 'Accident') {
        return '💥';
      } else if (result.status === 'Engine') {
        return '🔧';
      } else if (result.status === 'Gearbox') {
        return '⚙️';
      } else if (result.status === 'Disqualified') {
        return '🚫';
      } else {
        return '⚠️';
      }
    }
    
    // Alles andere: Kein Zeitwert
    return '--';
  }

  function getRaceTimeTooltip(result: ErgastRaceResult): string {
    if (result.status === 'Finished') {
      return '';
    }
    
    // Bei "lapped" Fahrern: Tooltip für Rundenrückstand
    if (result.status && (result.status.includes('Lap') || result.status === 'Lapped')) {
      if (result.status === '+1 Lap') {
        return '1 Runde zurück';
      } else if (result.status === '+2 Laps') {
        return '2 Runden zurück';
      } else if (result.status.match(/^\+(\d+) Lap/)) {
        const laps = result.status.match(/^\+(\d+) Lap/)?.[1];
        return `${laps} Runden zurück`;
      } else if (result.status === 'Lapped') {
        return 'Überrundet (Runden zurück)';
      }
      return `${result.status} - Runden zurück`;
    }
    
    // Bei anderen nicht-finishern: Detaillierte Beschreibung
    if (result.status === 'Retired') {
      return 'Ausgeschieden';
    } else if (result.status === 'Accident') {
      return 'Unfall';
    } else if (result.status === 'Engine') {
      return 'Motorproblem';
    } else if (result.status === 'Gearbox') {
      return 'Getriebeproblem';
    } else if (result.status === 'Disqualified') {
      return 'Disqualifiziert';
    } else {
      return result.status;
    }
  }

  function getRaceStatus(result: ErgastRaceResult): string {
    if (result.status === 'Finished') {
      return '✅';
    }
    if (result.status && (result.status.includes('Lap') || result.status === 'Lapped')) {
      return '🔴';
    }
    if (result.status === 'Retired') {
      return '❌';
    }
    if (result.status === 'Accident') {
      return '💥';
    }
    if (result.status === 'Engine') {
      return '🔧';
    }
    if (result.status === 'Gearbox') {
      return '⚙️';
    }
    return '⚠️';
  }

  function getRaceStatusTitle(result: ErgastRaceResult): string {
    if (result.status === 'Finished') {
      return 'Rennen beendet';
    }
    if (result.status && (result.status.includes('Lap') || result.status === 'Lapped')) {
      if (result.status === '+1 Lap') {
        return '1 Runde zurück';
      } else if (result.status === '+2 Laps') {
        return '2 Runden zurück';
      } else if (result.status.match(/^\+(\d+) Lap/)) {
        const laps = result.status.match(/^\+(\d+) Lap/)?.[1];
        return `${laps} Runden zurück`;
      } else if (result.status === 'Lapped') {
        return 'Überrundet (Runden zurück)';
      }
      return `${result.status} - Runden zurück`;
    }
    if (result.status === 'Retired') {
      return 'Ausgeschieden';
    }
    if (result.status === 'Accident') {
      return 'Unfall';
    }
    if (result.status === 'Engine') {
      return 'Motorproblem';
    }
    if (result.status === 'Gearbox') {
      return 'Getriebeproblem';
    }
    return `${result.status}`;
  }

</script>

<div class="race-card" class:expanded={isExpanded} class:upcoming={race.isUpcoming}>
  <button 
    class="race-header" 
    on:click={() => isExpanded = !isExpanded}
    aria-expanded={isExpanded}
    aria-controls="race-details-{race.round}"
  >
    <div class="race-basic-info">
      <div class="race-title-section">
        <h2>{race.raceName}</h2>
        <div class="race-number-badge">
          Rennen {race.round} von {totalRaces}
        </div>
      </div>
      <div class="location">
        <span class="country-with-flag">
          {getCountryFlag(race.Circuit.Location.country)} {race.Circuit.Location.country}
        </span>
        <span class="circuit">{race.Circuit.circuitName}</span>
      </div>
      <div class="race-status">
        <span class="date">{formatDate(race.date)}</span>
        <span class="status-badge" class:upcoming-badge={race.isUpcoming} class:completed-badge={!race.isUpcoming} class:today-badge={getRaceWeekendStatus() === 'Heute!'} class:tomorrow-badge={getRaceWeekendStatus() === 'Morgen'}>
          {getRaceWeekendStatus()}
        </span>
      </div>
    </div>
    
    <div class="expand-indicator" class:rotated={isExpanded}>
      ▼
    </div>
  </button>
  
  {#if isExpanded}
    <div class="race-details" id="race-details-{race.round}">
      <div class="circuit-info">
        <h3>Streckeninformationen</h3>
        <div class="circuit-grid">
          <div class="info-item">
            <div class="info-label">Streckenname:</div>
            <span>{race.Circuit.circuitName}</span>
          </div>
          <div class="info-item">
            <div class="info-label">Ort:</div>
            <span>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</span>
          </div>
          <div class="info-item">
            <div class="info-label">Runde:</div>
            <span>{race.round} / {race.season}</span>
          </div>
        </div>
      </div>
      
      <div class="sessions">
        <h3>Sessions</h3>
        <div class="sessions-list">
          {#each race.sessions as session}
            <div class="session" style="border-left-color: {getSessionColor(session.type)}">
              <div class="session-header">
                <div class="session-info">
                  <div class="session-name">{session.name}</div>
                  <div class="session-datetime">
                    {formatDateTime(session.date, session.time)}
                  </div>
                </div>
                
                {#if (session.type === 'qualifying' || session.type === 'race' || session.type === 'sprint') && !race.isUpcoming}
                  <button 
                    class="load-results-btn"
                    on:click={() => loadSessionResults(session)}
                    disabled={session.isLoading}
                  >
                    {#if session.isLoading}
                      <div class="mini-spinner"></div>
                    {:else if session.isLoaded}
                      📊 Ergebnisse
                    {:else}
                      📊 Ergebnisse laden
                    {/if}
                  </button>
                {/if}
              </div>
              
              {#if session.isLoaded && session.results && session.results.length > 0}
                <div class="session-results">
                  {#if session.type === 'qualifying'}
                    <div class="results-header">
                      <span>Pos</span>
                      <span>Fahrer</span>
                      <span>Team</span>
                      <span>Beste Zeit</span>
                      <span>Delta</span>
                    </div>
                    
                    {#each session.results as result, index}
                      <div class="result-row" class:winner={result.position === '1'}>
                        <span class="position">#{result.position}</span>
                        <span class="driver">{result.Driver.code}</span>
                        <span class="team">{result.Constructor.name}</span>
                        <span class="time">{formatQualifyingTime(result)}</span>
                        <span class="delta">
                          {formatQualifyingDelta(result, session.results[0])}
                        </span>
                      </div>
                    {/each}
                  {:else}
                    <div class="results-header race-header">
                      <span>Pos</span>
                      <span>Fahrer</span>
                      <span>Team</span>
                      <span>Zeit/Rückstand</span>
                      <span>Punkte</span>
                    </div>
                    
                    {#each session.results as result}
                      <div class="result-row race-result" class:winner={result.position === '1'}>
                        <span class="position">#{result.position}</span>
                        <span class="driver">{result.Driver.code}</span>
                        <span class="team">{result.Constructor.name}</span>
                        <span class="time" title={getRaceTimeTooltip(result)}>{formatRaceTimeWithLaps(result, session.results)}</span>
                        <span class="points">{result.points}</span>
                      </div>
                    {/each}
                  {/if}
                  
                  <div class="results-summary">
                    Gesamt: {session.results.length} Fahrer
                  </div>
                </div>
              {:else if session.isLoaded && (!session.results || session.results.length === 0)}
                <div class="no-results">
                  <p>❌ Keine Ergebnisse für diese Session verfügbar.</p>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .race-card {
    background: white;
    border-radius: 12px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    border: 2px solid transparent;
  }
  
  .race-card.upcoming {
    border-color: #ff3e00;
    box-shadow: 0 4px 16px rgba(255, 62, 0, 0.2);
  }
  
  .race-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: none;
    width: 100%;
    text-align: left;
  }
  
  .race-card.upcoming .race-header {
    background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  }
  
  .race-basic-info h2 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .race-title-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .race-number-badge {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .country-with-flag {
    font-weight: 600;
    color: #495057;
    font-size: 1rem;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.upcoming-badge {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
  }

  .status-badge.today-badge {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    animation: pulse 2s infinite;
  }

  .status-badge.tomorrow-badge {
    background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
    color: white;
  }

  .status-badge.completed-badge {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .location {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 4px;
  }
  
  .circuit {
    font-size: 0.9rem;
    color: #888;
    font-style: italic;
    margin-left: 8px;
  }
  
  .date {
    color: #888;
    font-size: 0.9rem;
  }
  
  .expand-indicator {
    font-size: 1.2rem;
    color: #666;
    transition: transform 0.3s ease;
  }
  
  .expand-indicator.rotated {
    transform: rotate(180deg);
  }
  
  .race-details {
    padding: 0 20px 20px 20px;
    background: #fafafa;
  }
  
  .circuit-info h3,
  .sessions h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 1.2rem;
    border-bottom: 2px solid #ff3e00;
    padding-bottom: 8px;
  }
  
  .circuit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .info-label {
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
  }
  
  .info-item span {
    color: #333;
    font-weight: 500;
  }
  
  .sessions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .session {
    background: white;
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid #757575;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .session-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .session-info {
    flex: 1;
  }
  
  .session-name {
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .session-datetime {
    color: #666;
    font-size: 0.9rem;
  }
  
  .load-results-btn {
    background: #2196F3;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.3s ease;
  }
  
  .load-results-btn:hover:not(:disabled) {
    background: #1976D2;
  }
  
  .load-results-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .mini-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .session-results {
    margin-top: 16px;
    background: #f8f9fa;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .results-header {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 120px 80px;
    gap: 8px;
    padding: 12px 16px;
    background: #e9ecef;
    font-weight: 600;
    font-size: 0.9rem;
    color: #495057;
  }

  .results-header.race-header {
    grid-template-columns: 50px 1fr 1fr 120px 80px;
  }
  
  .result-row {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 120px 80px;
    gap: 8px;
    padding: 10px 16px;
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.2s ease;
  }

  .result-row.race-result {
    grid-template-columns: 50px 1fr 1fr 120px 80px;
  }
  
  .result-row:hover {
    background: #f1f3f4;
  }
  
  .result-row.winner {
    background: linear-gradient(135deg, #fff3cd 0%, #fffbf0 100%);
    border-left: 3px solid #ffc107;
  }
  
  .result-row:last-child {
    border-bottom: none;
  }
  
  .position {
    font-weight: 600;
    color: #333;
  }
  
  .driver {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .team {
    color: #666;
    font-size: 0.9rem;
  }
  
  .time {
    font-family: 'Courier New', monospace;
    color: #495057;
    font-weight: 500;
  }
  
  .delta {
    font-family: 'Courier New', monospace;
    color: #dc3545;
    font-weight: 500;
    text-align: right;
  }
  
  .points {
    color: #666;
    text-align: center;
    font-weight: 600;
  }
  
  .results-summary {
    padding: 12px 16px;
    text-align: center;
    background: #e9ecef;
    font-weight: 600;
    color: #495057;
    border-top: 2px solid #dee2e6;
  }
  
  .no-results {
    margin-top: 16px;
    padding: 16px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 6px;
    text-align: center;
  }
  
  .no-results p {
    margin: 0;
    color: #856404;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    .results-header,
    .result-row {
      grid-template-columns: 40px 1fr 80px 50px;
      gap: 4px;
    }
    
    .team {
      display: none;
    }
    
    .session-header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
  }
</style>
