<script lang="ts">
  import { getDriverFlag, getTeamColor, formatPoints, formatPosition, formatWins } from './utils';
  
  export let driverStandings: any[] = [];
  export let constructorStandings: any[] = [];
  export let selectedYear: number;
  
  let activeStandingsTab = 'drivers';
</script>

<div class="standings-tab">
  <div class="tab-header">
    <h2>🏆 Weltmeisterschaft {selectedYear}</h2>
    <div class="standings-tabs">
      <button 
        class="tab-btn" 
        class:active={activeStandingsTab === 'drivers'}
        on:click={() => activeStandingsTab = 'drivers'}
      >
        👨‍🔧 Fahrer
      </button>
      <button 
        class="tab-btn" 
        class:active={activeStandingsTab === 'constructors'}
        on:click={() => activeStandingsTab = 'constructors'}
      >
        🏎️ Konstrukteure
      </button>
    </div>
  </div>
  
  {#if activeStandingsTab === 'drivers'}
    <div class="standings-content">
      <h3>Fahrerwertung</h3>
      {#if driverStandings.length > 0}
        <div class="standings-table">
          <div class="table-header">
            <div class="pos">Pos</div>
            <div class="driver">Fahrer</div>
            <div class="team">Team</div>
            <div class="points">Punkte</div>
            <div class="wins">Siege</div>
          </div>
          {#each driverStandings as standing, index}
            <div class="table-row" class:podium={index < 3}>
              <div class="pos">
                {#if index === 0}🥇{:else if index === 1}🥈{:else if index === 2}🥉{:else}{formatPosition(standing.position)}{/if}
              </div>
              <div class="driver">
                <span class="flag">{getDriverFlag(standing.Driver.nationality)}</span>
                <span class="name">{standing.Driver.givenName} {standing.Driver.familyName}</span>
              </div>
              <div class="team" style="border-left: 4px solid {getTeamColor(standing.Constructors[0].constructorId)}">
                {standing.Constructors[0].name}
              </div>
              <div class="points">{formatPoints(standing.points)}</div>
              <div class="wins">{formatWins(standing.wins)}</div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-data">
          <p>Keine Fahrerwertung für {selectedYear} verfügbar</p>
        </div>
      {/if}
    </div>
  {:else if activeStandingsTab === 'constructors'}
    <div class="standings-content">
      <h3>Konstrukteurswertung</h3>
      {#if constructorStandings.length > 0}
        <div class="standings-table">
          <div class="table-header">
            <div class="pos">Pos</div>
            <div class="constructor">Konstrukteur</div>
            <div class="points">Punkte</div>
            <div class="wins">Siege</div>
          </div>
          {#each constructorStandings as standing, index}
            <div class="table-row" class:podium={index < 3}>
              <div class="pos">
                {#if index === 0}🥇{:else if index === 1}🥈{:else if index === 2}🥉{:else}{formatPosition(standing.position)}{/if}
              </div>
              <div class="constructor" style="border-left: 4px solid {getTeamColor(standing.Constructor.constructorId)}">
                {standing.Constructor.name}
              </div>
              <div class="points">{formatPoints(standing.points)}</div>
              <div class="wins">{formatWins(standing.wins)}</div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-data">
          <p>Keine Konstrukteurswertung für {selectedYear} verfügbar</p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .standings-tab {
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
  
  .standings-tabs {
    display: flex;
    gap: 8px;
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
  
  .standings-content {
    padding: 32px 24px;
  }
  
  .standings-content h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .standings-table {
    display: grid;
    gap: 8px;
    overflow-x: auto;
  }
  
  .table-header {
    display: grid;
    grid-template-columns: 80px 2fr 2fr 120px 80px;
    gap: 20px;
    padding: 16px 20px;
    background: #f8f9fa;
    border-radius: 8px;
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 600px;
  }
  
  .table-row {
    display: grid;
    grid-template-columns: 80px 2fr 2fr 120px 80px;
    gap: 20px;
    padding: 20px;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.3s ease;
    align-items: center;
    min-width: 600px;
  }
  
  .table-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .table-row.podium {
    background: linear-gradient(135deg, #fff8e1 0%, #fffde7 100%);
    border-color: #ffc107;
  }
  
  .pos {
    font-weight: 700;
    font-size: 1.1rem;
    text-align: center;
  }
  
  .driver {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .flag {
    font-size: 1.2rem;
  }
  
  .name {
    font-weight: 600;
    color: #333;
  }
  
  .team, .constructor {
    font-weight: 500;
    color: #666;
    padding-left: 12px;
  }
  
  .points {
    font-weight: 700;
    color: #ff3e00;
    font-size: 1.1rem;
    text-align: center;
  }
  
  .wins {
    font-weight: 600;
    color: #28a745;
    text-align: center;
  }
  
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px;
    color: #666;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    .table-header,
    .table-row {
      grid-template-columns: 50px 1fr 80px 50px;
      gap: 8px;
    }
    
    .team, .constructor {
      display: none;
    }
    
    .tab-header {
      padding: 16px;
    }
    
    .standings-content {
      padding: 16px;
    }
    
    .standings-tabs {
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
    
    .standings-content {
      padding: 32px;
    }
    
    .table-header,
    .table-row {
      grid-template-columns: 100px 3fr 2.5fr 140px 100px;
      gap: 24px;
      padding: 24px;
    }
  }
</style>
