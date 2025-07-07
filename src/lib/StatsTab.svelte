<script lang="ts">
  import { getDriverFlag, formatTime, formatLapTime, formatSpeed, formatRound, formatBirthDate, getYearsAgo } from './utils';
  
  export let fastestLaps: any[] = [];
  export let onThisDay: any[] = [];
  export let selectedYear: number;
  
  let activeStatsTab = 'fastest';
</script>

<div class="stats-tab">
  <div class="tab-header">
    <h2>📈 Statistiken & Geschichte</h2>
    <div class="stats-tabs">
      <button 
        class="tab-btn" 
        class:active={activeStatsTab === 'fastest'}
        on:click={() => activeStatsTab = 'fastest'}
      >
        ⚡ Schnellste Runden
      </button>
      <button 
        class="tab-btn" 
        class:active={activeStatsTab === 'history'}
        on:click={() => activeStatsTab = 'history'}
      >
        📅 An diesem Tag
      </button>
    </div>
  </div>
  
  {#if activeStatsTab === 'fastest'}
    <div class="stats-content">
      <h3>⚡ Schnellste Runden {selectedYear}</h3>
      {#if fastestLaps.length > 0}
        <div class="fastest-laps-table">
          <div class="table-header">
            <div class="race">Rennen</div>
            <div class="driver">Fahrer</div>
            <div class="team">Team</div>
            <div class="time">Zeit</div>
            <div class="avg-speed">Ø Geschw.</div>
          </div>
          {#each fastestLaps as lap, index}
            <div class="table-row" class:fastest={index === 0}>
              <div class="race">
                <span class="race-name">{lap.raceName || 'Unbekannt'}</span>
                <span class="round">Runde {formatRound(lap.round)}</span>
              </div>
              <div class="driver">
                <span class="flag">{getDriverFlag(lap.Driver?.nationality || '')}</span>
                <span class="name">{lap.Driver?.givenName || ''} {lap.Driver?.familyName || 'Unbekannt'}</span>
              </div>
              <div class="team">{lap.Constructor?.name || 'Unbekannt'}</div>
              <div class="time fastest-time">{formatLapTime(lap.FastestLap?.Time?.time || lap.time || 'N/A')}</div>
              <div class="avg-speed">{formatSpeed(lap.FastestLap?.AverageSpeed?.speed)}</div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-data">
          <p>Keine Daten zu schnellsten Runden für {selectedYear} verfügbar</p>
        </div>
      {/if}
    </div>
  {:else if activeStatsTab === 'history'}
    <div class="stats-content">
      <h3>📅 An diesem Tag in der F1-Geschichte</h3>
      {#if onThisDay.length > 0}
        <div class="history-timeline">
          {#each onThisDay as event}
            <div class="timeline-item">
              <div class="timeline-date">
                <span class="year">{new Date(event.date).getFullYear()}</span>
                <span class="years-ago">vor {getYearsAgo(event.date)} Jahren</span>
              </div>
              <div class="timeline-content">
                <h4 class="event-title">{event.raceName}</h4>
                <p class="event-location">{event.Circuit?.circuitName || event.circuitName}</p>
                <p class="event-date">{formatBirthDate(event.date)}</p>
                
                {#if event.Results && event.Results.length > 0}
                  <div class="event-results">
                    <h5>Podium:</h5>
                    <div class="podium">
                      {#each event.Results.slice(0, 3) as result, index}
                        <div class="podium-position">
                          <span class="position">
                            {#if index === 0}🥇{:else if index === 1}🥈{:else if index === 2}🥉{/if}
                          </span>
                          <span class="driver-name">
                            {result.Driver.givenName} {result.Driver.familyName}
                          </span>
                          <span class="constructor">({result.Constructor.name})</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
                
                {#if event.url}
                  <a href={event.url} target="_blank" rel="noopener noreferrer" class="wiki-link">
                    📖 Mehr erfahren
                  </a>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-data">
          <p>Keine historischen Ereignisse für heute gefunden</p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .stats-tab {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .tab-header {
    padding: 24px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #dee2e6;
  }
  
  .tab-header h2 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .stats-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .tab-btn {
    padding: 10px 20px;
    border: 2px solid #e9ecef;
    background: #f8f9fa;
    color: #495057;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .tab-btn:hover {
    background: #e9ecef;
    border-color: #dee2e6;
    color: #212529;
    transform: translateY(-1px);
  }
  
  .tab-btn.active {
    background: #ff3e00;
    color: white;
    border-color: #ff3e00;
    box-shadow: 0 4px 8px rgba(255, 62, 0, 0.3);
  }
  
  .stats-content {
    padding: 32px 24px;
  }
  
  .stats-content h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .fastest-laps-table {
    display: grid;
    gap: 8px;
    overflow-x: auto;
  }
  
  .table-header {
    display: grid;
    grid-template-columns: 2fr 2.5fr 2fr 1.2fr 1.2fr;
    gap: 20px;
    padding: 16px 20px;
    background: #f8f9fa;
    border-radius: 8px;
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 700px;
  }
  
  .table-row {
    display: grid;
    grid-template-columns: 2fr 2.5fr 2fr 1.2fr 1.2fr;
    gap: 20px;
    padding: 20px;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.3s ease;
    align-items: center;
    min-width: 700px;
  }
  
  .table-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .table-row.fastest {
    background: linear-gradient(135deg, #fff8e1 0%, #fffde7 100%);
    border-color: #ffc107;
  }
  
  .race-name {
    font-weight: 600;
    color: #333;
    display: block;
  }
  
  .round {
    font-size: 0.8rem;
    color: #666;
  }
  
  .driver {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .flag {
    font-size: 1.1rem;
  }
  
  .name {
    font-weight: 500;
    color: #333;
  }
  
  .team {
    font-weight: 500;
    color: #666;
  }
  
  .fastest-time {
    font-weight: 700;
    color: #ff3e00;
    font-family: monospace;
    font-size: 1.1rem;
  }
  
  .avg-speed {
    font-weight: 600;
    color: #28a745;
    text-align: center;
  }
  
  .history-timeline {
    display: grid;
    gap: 24px;
  }
  
  .timeline-item {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    padding: 24px;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .timeline-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .timeline-date {
    text-align: center;
    justify-self: center;
    align-self: start;
  }
  
  .year {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #ff3e00;
  }
  
  .years-ago {
    display: block;
    font-size: 0.8rem;
    color: #666;
    font-style: italic;
  }
  
  .timeline-content {
    width: 100%;
  }
  
  .event-title {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 1.3rem;
    font-weight: 600;
  }
  
  .event-location {
    margin: 0 0 4px 0;
    color: #666;
    font-weight: 500;
  }
  
  .event-date {
    margin: 0 0 16px 0;
    color: #999;
    font-size: 0.9rem;
  }
  
  .event-results h5 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .podium {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .podium-position {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .position {
    font-size: 1.1rem;
  }
  
  .driver-name {
    font-weight: 600;
    color: #333;
  }
  
  .constructor {
    color: #666;
    font-size: 0.9rem;
  }
  
  .wiki-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  
  .wiki-link:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px;
    color: #666;
    font-style: italic;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .table-header,
    .table-row {
      grid-template-columns: 1fr 1fr 80px;
      gap: 8px;
    }
    
    .team,
    .avg-speed {
      display: none;
    }
    
    .timeline-item {
      flex-direction: column;
      gap: 12px;
    }
    
    .timeline-date {
      min-width: unset;
      text-align: left;
    }
    
    .stats-content {
      padding: 16px;
    }
    
    .stats-tabs {
      flex-direction: column;
    }
    
    .tab-btn {
      width: 100%;
    }
  }
  
  /* Large screens optimization */
  @media (min-width: 1400px) {
    .tab-header {
      padding: 32px;
    }
    
    .stats-content {
      padding: 32px;
    }
    
    .table-header,
    .table-row {
      grid-template-columns: 2.5fr 3fr 2.5fr 1.5fr 1.5fr;
      gap: 24px;
      padding: 24px;
    }
    
    .timeline-item {
      grid-template-columns: 140px 1fr;
      gap: 32px;
      padding: 32px;
    }
  }
</style>
