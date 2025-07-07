<script lang="ts">
  import type { MeetingWithSessions, SessionWithResults } from './types';
  import { openF1Service } from './openf1-service';
  
  export let meeting: MeetingWithSessions;
  export let isExpanded: boolean = false;
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function getSessionTypeColor(sessionType: string): string {
    switch (sessionType.toLowerCase()) {
      case 'practice': return '#4CAF50';
      case 'qualifying': return '#FF9800';
      case 'race': return '#f44336';
      case 'sprint': return '#9C27B0';
      default: return '#757575';
    }
  }

  async function loadSessionResults(session: SessionWithResults) {
    if (session.results || session.isLoadingResults) return;
    
    console.log('Loading session results for session:', session.session_key, session.session_name, session.session_type);
    session.isLoadingResults = true;
    try {
      // Sequential requests to avoid rate limiting
      const results = await openF1Service.getSessionResults(session.session_key);
      console.log('Results loaded:', results.length);
      console.log('Sample result data:', results[0]); // Debug: zeige ersten Eintrag
      
      const drivers = await openF1Service.getDrivers(session.session_key);
      console.log('Drivers loaded:', drivers.length);
      
      session.results = results;
      session.drivers = drivers;
      
      // Trigger reactivity
      meeting = meeting;
    } catch (error) {
      console.error('Error loading session results:', error);
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('Rate Limit')) {
        alert('Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.');
      } else {
        alert('Fehler beim Laden der Session-Ergebnisse. Bitte versuchen Sie es später erneut.');
      }
    } finally {
      session.isLoadingResults = false;
    }
  }

  function getDriverName(driverNumber: number, drivers: any[]): string {
    const driver = drivers?.find(d => d.driver_number === driverNumber);
    return driver ? driver.name_acronym || driver.broadcast_name : `#${driverNumber}`;
  }

  function getDriverTeam(driverNumber: number, drivers: any[]): string {
    const driver = drivers?.find(d => d.driver_number === driverNumber);
    return driver ? driver.team_name : '';
  }

  function formatTimeGap(timeGap: number | null): string {
    if (timeGap === null || timeGap === undefined || isNaN(timeGap)) {
      return '--';
    }
    
    // Negative Werte bedeuten normalerweise überrundet
    if (timeGap < 0) {
      const laps = Math.abs(Math.round(timeGap));
      return `+${laps} Lap${laps > 1 ? 's' : ''}`;
    }
    
    // Sehr große Werte (> 3600 = 1 Stunde) sind wahrscheinlich auch Rundenrückstand
    if (timeGap > 3600) {
      const laps = Math.round(timeGap / 90); // Annahme: ~90 Sekunden pro Runde
      return `+${laps} Lap${laps > 1 ? 's' : ''}`;
    }
    
    // Normale Zeitabstände
    if (timeGap < 60) {
      return `+${timeGap.toFixed(3)}s`;
    }
    
    const minutes = Math.floor(timeGap / 60);
    const seconds = timeGap % 60;
    return `+${minutes}:${seconds.toFixed(3).padStart(6, '0')}`;
  }

  function formatWinnerTime(timeSeconds: number): string {
    if (!timeSeconds || isNaN(timeSeconds)) return 'Winner';
    
    const hours = Math.floor(timeSeconds / 3600);
    const minutes = Math.floor((timeSeconds % 3600) / 60);
    const seconds = timeSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
    } else {
      return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`;
    }
  }

  function calculateLapGap(result: any, winnerLaps: number): string {
    if (!result || !winnerLaps) return '--';
    
    const lapDiff = winnerLaps - result.number_of_laps;
    if (lapDiff > 0) {
      return `+${lapDiff} Lap${lapDiff > 1 ? 's' : ''}`;
    }
    return '--';
  }

  function getDisplayTimeGap(result: any, allResults: any[]): string {
    // Für P1 (Winner) - zeige die Gesamtzeit
    if (result.position === 1) {
      return result.time_gap ? formatWinnerTime(result.time_gap) : 'Winner';
    }
    
    // Wenn time_gap ungültig ist, versuche Rundenrückstand zu berechnen
    if (result.time_gap === null || result.time_gap === undefined || isNaN(result.time_gap)) {
      const winner = allResults.find(r => r.position === 1);
      if (winner && winner.number_of_laps) {
        return calculateLapGap(result, winner.number_of_laps);
      }
      return '--';
    }
    
    // Für alle anderen - normale Gap-Anzeige
    return formatTimeGap(result.time_gap);
  }

  function getQualifyingTime(result: any, allResults: any[]): string {
    console.log('Qualifying time for driver', result.driver_number, ':', result);
    
    // Versuche verschiedene Felder für die Rundenzeit
    if (result.time_gap && !isNaN(result.time_gap) && result.time_gap > 0) {
      return formatLapTime(result.time_gap);
    }
    
    // Manchmal ist die Zeit in anderen Feldern
    if (result.time && !isNaN(result.time) && result.time > 0) {
      return formatLapTime(result.time);
    }
    
    if (result.best_time && !isNaN(result.best_time) && result.best_time > 0) {
      return formatLapTime(result.best_time);
    }
    
    return '--';
  }

  function getQualifyingDelta(result: any, allResults: any[]): string {
    if (result.position === 1) return '--'; // Pole hat kein Delta
    
    const pole = allResults.find(r => r.position === 1);
    if (!pole) return '--';
    
    // Versuche verschiedene Kombinationen für Zeit-Vergleich
    const resultTime = result.time_gap || result.time || result.best_time;
    const poleTime = pole.time_gap || pole.time || pole.best_time;
    
    if (!resultTime || !poleTime || isNaN(resultTime) || isNaN(poleTime)) {
      return '--';
    }
    
    const delta = resultTime - poleTime;
    if (delta <= 0) return '--';
    
    if (delta < 60) {
      return `+${delta.toFixed(3)}`;
    } else {
      const minutes = Math.floor(delta / 60);
      const seconds = delta % 60;
      return `+${minutes}:${seconds.toFixed(3).padStart(6, '0')}`;
    }
  }

  function formatLapTime(timeSeconds: number): string {
    if (!timeSeconds || isNaN(timeSeconds)) return '--';
    
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = timeSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`;
    } else {
      return `${seconds.toFixed(3)}s`;
    }
  }
</script>

<div class="race-card" class:expanded={isExpanded} class:upcoming={meeting.isUpcoming}>
  <button 
    class="race-header" 
    on:click={() => isExpanded = !isExpanded}
    aria-expanded={isExpanded}
    aria-controls="race-details-{meeting.meeting_key}"
  >
    <div class="race-basic-info">
      <h2>{meeting.meeting_name}</h2>
      <div class="location">
        <span class="country">{meeting.country_name}</span>
        <span class="flag">{meeting.country_code}</span>
      </div>
      <div class="date">{formatDate(meeting.date_start)}</div>
    </div>
    
    <div class="expand-indicator" class:rotated={isExpanded}>
      ▼
    </div>
  </button>
  
  {#if isExpanded}
    <div class="race-details" id="race-details-{meeting.meeting_key}">
      <div class="circuit-info">
        {#if meeting.circuit}
          <h3>Streckeninformationen</h3>
          <div class="circuit-grid">
            <div class="info-item">
              <div class="info-label">Streckenname:</div>
              <span>{meeting.circuit.circuit_name}</span>
            </div>
            <div class="info-item">
              <div class="info-label">Länge:</div>
              <span>{meeting.circuit.circuit_length} km</span>
            </div>
            <div class="info-item">
              <div class="info-label">Kurven:</div>
              <span>{meeting.circuit.number_of_turns}</span>
            </div>
            <div class="info-item">
              <div class="info-label">Erstes Rennen:</div>
              <span>{meeting.circuit.year_first_race}</span>
            </div>
          </div>
        {/if}
      </div>
      
      <div class="sessions">
        <h3>Sessions</h3>
        <div class="sessions-list">
          {#each meeting.sessions as session}
            <div class="session" style="border-left-color: {getSessionTypeColor(session.session_type)}">
              <div class="session-header">
                <div class="session-info">
                  <div class="session-name">{session.session_name}</div>
                  <div class="session-type">{session.session_type}</div>
                  <div class="session-time">
                    {formatDate(session.date_start)} - {formatTime(session.date_start)}
                  </div>
                </div>
                
                <button 
                  class="load-results-btn"
                  on:click={() => loadSessionResults(session)}
                  disabled={session.isLoadingResults}
                >
                  {#if session.isLoadingResults}
                    <div class="mini-spinner"></div>
                  {:else if session.results}
                    📊 Ergebnisse
                  {:else}
                    📊 Ergebnisse laden
                  {/if}
                </button>
              </div>
              
              {#if session.results && session.results.length > 0}
                <div class="session-results">
                  <div class="results-header">
                    <span>Pos</span>
                    <span>Fahrer</span>
                    <span>Team</span>
                    {#if session.session_type.toLowerCase().includes('qualifying') || session.session_type.toLowerCase().includes('practice')}
                      <span>Beste Zeit</span>
                      <span>Delta</span>
                    {:else}
                      <span>Zeit/Gap</span>
                      <span>Runden</span>
                    {/if}
                  </div>
                  
                  {#each session.results
                    .filter(result => result.position > 0) // Nur Fahrer mit gültiger Position
                    .sort((a, b) => a.position - b.position) // Nach Position sortieren
                    as result}
                    <div class="result-row" class:winner={result.position === 1}>
                      <span class="position">#{result.position}</span>
                      <span class="driver">{getDriverName(result.driver_number, session.drivers || [])}</span>
                      <span class="team">{getDriverTeam(result.driver_number, session.drivers || [])}</span>
                      {#if session.session_type.toLowerCase().includes('qualifying') || session.session_type.toLowerCase().includes('practice')}
                        <span class="time">
                          {getQualifyingTime(result, session.results)}
                        </span>
                        <span class="delta">
                          {getQualifyingDelta(result, session.results)}
                        </span>
                      {:else}
                        <span class="time">
                          {getDisplayTimeGap(result, session.results)}
                        </span>
                        <span class="laps">{result.number_of_laps}</span>
                      {/if}
                    </div>
                  {/each}
                  
                  <!-- Zeige DNF/DSQ Fahrer separat -->
                  {#each session.results
                    .filter(result => result.position <= 0) // Fahrer ohne gültige Position (DNF, DSQ, etc.)
                    .sort((a, b) => b.number_of_laps - a.number_of_laps) // Nach Runden sortieren
                    as result}
                    <div class="result-row dnf-row">
                      <span class="position">DNF</span>
                      <span class="driver">{getDriverName(result.driver_number, session.drivers || [])}</span>
                      <span class="team">{getDriverTeam(result.driver_number, session.drivers || [])}</span>
                      {#if session.session_type.toLowerCase().includes('qualifying') || session.session_type.toLowerCase().includes('practice')}
                        <span class="time">{result.time_gap && !isNaN(result.time_gap) ? formatLapTime(result.time_gap) : '--'}</span>
                        <span class="delta">--</span>
                      {:else}
                        <span class="time">DNF</span>
                        <span class="laps">{result.number_of_laps}</span>
                      {/if}
                    </div>
                  {/each}
                  
                  <div class="results-summary">
                    Gesamt: {session.results.length} Fahrer
                  </div>
                </div>
              {:else if session.results && session.results.length === 0}
                <div class="no-results">
                  <p>❌ Keine Ergebnisse für diese Session verfügbar.</p>
                  <small>Diese Session wurde möglicherweise abgesagt oder die Ergebnisse sind noch nicht verfügbar.</small>
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
  
  .location {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  
  .country {
    font-weight: 500;
    color: #666;
  }
  
  .flag {
    background: #ff3e00;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
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
  
  .session-type {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 4px;
    text-transform: capitalize;
  }
  
  .session-time {
    color: #888;
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
  
  .session-results {
    margin-top: 16px;
    background: #f8f9fa;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .results-header {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 100px 80px;
    gap: 8px;
    padding: 12px 16px;
    background: #e9ecef;
    font-weight: 600;
    font-size: 0.9rem;
    color: #495057;
  }
  
  .result-row {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 100px 80px;
    gap: 8px;
    padding: 10px 16px;
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.2s ease;
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
  
  .laps {
    color: #666;
    text-align: center;
  }
  
  .delta {
    font-family: 'Courier New', monospace;
    color: #dc3545;
    font-weight: 500;
    text-align: right;
  }
  
  .more-results {
    padding: 12px 16px;
    text-align: center;
    color: #666;
    font-style: italic;
    background: #f8f9fa;
  }
  
  .dnf-row {
    background: #fff5f5 !important;
    color: #666;
  }
  
  .dnf-row:hover {
    background: #ffebeb !important;
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
    margin: 0 0 8px 0;
    color: #856404;
    font-weight: 500;
  }
  
  .no-results small {
    color: #6c757d;
    font-size: 0.85rem;
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
