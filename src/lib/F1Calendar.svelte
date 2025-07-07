<script lang="ts">
  import { onMount } from 'svelte';
  import { ergastService } from './ergast-service';
  import ErgastRaceCard from './ErgastRaceCard.svelte';
  import StandingsTab from './StandingsTab.svelte';
  import DriversTab from './DriversTab.svelte';
  import CircuitsTab from './CircuitsTab.svelte';
  import StatsTab from './StatsTab.svelte';
  import type { ProcessedRace } from './ergast-service';
  
  let races: ProcessedRace[] = [];
  let loading = true;
  let error: string | null = null;
  let selectedYear = 2025;
  let activeTab = 'calendar';
  
  // Neue State-Variablen für die verschiedenen Features
  let driverStandings: any[] = [];
  let constructorStandings: any[] = [];
  let drivers: any[] = [];
  let circuits: any[] = [];
  let fastestLaps: any[] = [];
  let onThisDay: any[] = [];
  
  const tabs = [
    { id: 'calendar', label: 'Kalender', icon: '📅' },
    { id: 'standings', label: 'Tabellen', icon: '🏆' },
    { id: 'drivers', label: 'Fahrer', icon: '🏎️' },
    { id: 'circuits', label: 'Strecken', icon: '🏁' },
    { id: 'stats', label: 'Statistiken', icon: '�' }
  ];
  
  async function loadRaces() {
    try {
      loading = true;
      error = null;
      races = await ergastService.getRaces(selectedYear);
      
      // Debug: Zeige die Anzahl der kommenden und vergangenen Rennen
      const upcoming = races.filter(r => r.isUpcoming);
      const past = races.filter(r => !r.isUpcoming);
      console.log(`Total races: ${races.length}`);
      console.log(`Upcoming races: ${upcoming.length}, Past races: ${past.length}`);
      console.log('Races:', races.map(r => ({ name: r.raceName, date: r.date, isUpcoming: r.isUpcoming })));
      
      if (races.length === 0) {
        error = `Keine Daten für ${selectedYear} verfügbar.`;
      }
    } catch (err: any) {
      error = 'Fehler beim Laden der Renndaten. Bitte versuchen Sie es später erneut.';
      console.error('Error loading races:', err);
    } finally {
      loading = false;
    }
  }
  
  async function loadStandings() {
    try {
      const [driverData, constructorData] = await Promise.all([
        ergastService.getDriverStandings(selectedYear),
        ergastService.getConstructorStandings(selectedYear)
      ]);
      driverStandings = driverData;
      constructorStandings = constructorData;
    } catch (err) {
      console.error('Error loading standings:', err);
    }
  }
  
  async function loadDrivers() {
    try {
      drivers = await ergastService.getDrivers(selectedYear);
    } catch (err) {
      console.error('Error loading drivers:', err);
    }
  }
  
  async function loadCircuits() {
    try {
      circuits = await ergastService.getCircuits(selectedYear);
    } catch (err) {
      console.error('Error loading circuits:', err);
    }
  }
  
  async function loadFastestLaps() {
    try {
      fastestLaps = await ergastService.getFastestLaps(selectedYear);
    } catch (err) {
      console.error('Error loading fastest laps:', err);
    }
  }
  
  async function loadOnThisDay() {
    try {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      onThisDay = await ergastService.getOnThisDay(month, day);
    } catch (err) {
      console.error('Error loading on this day:', err);
    }
  }
  
  onMount(() => {
    loadAllData();
  });
  
  async function loadAllData() {
    await Promise.all([
      loadRaces(),
      loadStandings(),
      loadDrivers(),
      loadCircuits(),
      loadFastestLaps(),
      loadOnThisDay()
    ]);
  }
  
  $: nextRace = races.find(r => r.isUpcoming);
  $: upcomingRaces = races.filter(r => r.isUpcoming);
  $: pastRaces = races.filter(r => !r.isUpcoming);
  
  function handleYearChange() {
    loadAllData();
  }
  
  function setActiveTab(tabId: string) {
    activeTab = tabId;
  }
</script>

<div class="f1-calendar">
  <header class="calendar-header">
    <h1>🏎️ Formula 1 Dashboard</h1>
    <div class="year-selector">
      <label for="year-select">Jahr:</label>
      <select 
        id="year-select" 
        bind:value={selectedYear} 
        on:change={handleYearChange}
      >
        {#each [2023, 2024, 2025] as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
    </div>
  </header>
  
  <nav class="tab-navigation">
    {#each tabs as tab}
      <button 
        class="tab-button" 
        class:active={activeTab === tab.id}
        on:click={() => setActiveTab(tab.id)}
      >
        <span class="tab-icon">{tab.icon}</span>
        <span class="tab-label">{tab.label}</span>
      </button>
    {/each}
  </nav>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Lade Daten für {selectedYear}...</p>
    </div>
  {:else if error && activeTab === 'calendar'}
    <div class="error">
      <p>{error}</p>
      <button on:click={loadRaces} class="retry-button">
        Erneut versuchen
      </button>
    </div>
  {:else}
    <div class="tab-content">
      {#if activeTab === 'calendar'}
        <div class="races-container">
          {#if nextRace}
            <section class="upcoming-section">
              <h2>Nächstes Rennen</h2>
              <ErgastRaceCard race={nextRace} isExpanded={true} totalRaces={races.length} />
            </section>
          {/if}
          
          {#if upcomingRaces.length > 1}
            <section class="future-races-section">
              <h2>Kommende Rennen {selectedYear}</h2>
              <div class="races-grid">
                {#each upcomingRaces.slice(1) as race}
                  <ErgastRaceCard {race} isExpanded={false} totalRaces={races.length} />
                {/each}
              </div>
            </section>
          {/if}
          
          {#if pastRaces.length > 0}
            <section class="past-races-section">
              <h2>Vergangene Rennen {selectedYear}</h2>
              <div class="races-grid">
                {#each pastRaces as race}
                  <ErgastRaceCard {race} isExpanded={false} totalRaces={races.length} />
                {/each}
              </div>
            </section>
          {/if}
          
          {#if races.length === 0}
            <div class="no-data">
              <p>Keine Renndaten für {selectedYear} verfügbar.</p>
            </div>
          {/if}
        </div>
      {:else if activeTab === 'standings'}
        <StandingsTab {driverStandings} {constructorStandings} {selectedYear} />
      {:else if activeTab === 'drivers'}
        <DriversTab {drivers} {selectedYear} />
      {:else if activeTab === 'circuits'}
        <CircuitsTab {circuits} {selectedYear} />
      {:else if activeTab === 'stats'}
        <StatsTab {fastestLaps} {onThisDay} {selectedYear} />
      {/if}
    </div>
  {/if}
</div>

<style>
  .f1-calendar {
    width: min(95vw, 1400px);
    margin: 0 auto;
    padding: 32px 20px;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  /* Mobile: weniger Padding */
  @media (max-width: 768px) {
    .f1-calendar {
      padding: 24px 16px;
    }
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .calendar-header h1 {
    margin: 0;
    color: #333;
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  .year-selector {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .year-selector label {
    font-weight: 600;
    color: #666;
  }
  
  .year-selector select {
    padding: 8px 16px;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  
  .year-selector select:focus {
    outline: none;
    border-color: #ff3e00;
  }
  
  .tab-navigation {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    background: white;
    padding: 8px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .tab-navigation::-webkit-scrollbar {
    display: none;
  }
  
  .tab-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: fit-content;
  }
  
  .tab-button:hover {
    background: #f8f9fa;
    color: #333;
    transform: translateY(-1px);
  }
  
  .tab-button.active {
    background: linear-gradient(135deg, #ff3e00 0%, #e63500 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 62, 0, 0.3);
  }
  
  .tab-icon {
    font-size: 1.2rem;
  }
  
  .tab-label {
    font-weight: 600;
  }
  
  .tab-content {
    animation: fadeIn 0.3s ease-in-out;
    padding: 16px 0;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .loading, .error, .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ff3e00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading p, .error p, .no-data p {
    margin: 0;
    color: #666;
    font-size: 1.1rem;
  }
  
  .retry-button {
    margin-top: 16px;
    padding: 12px 24px;
    background: #ff3e00;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .retry-button:hover {
    background: #e63500;
  }
  
  .upcoming-section {
    margin-bottom: 48px;
  }
  
  .future-races-section {
    margin-bottom: 48px;
  }
  
  .past-races-section {
    margin-bottom: 24px;
  }
  
  .upcoming-section h2,
  .future-races-section h2,
  .past-races-section h2 {
    margin: 0 0 24px 0;
    color: #333;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .future-races-section h2 {
    background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%);
    border-left: 4px solid #4CAF50;
  }
  
  .past-races-section h2 {
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
    border-left: 4px solid #757575;
  }
  
  .races-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .f1-calendar {
      padding: 16px;
    }
    
    .calendar-header {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    
    .calendar-header h1 {
      font-size: 2rem;
    }
    
    .year-selector {
      justify-content: center;
    }
    
    .tab-navigation {
      padding: 6px;
      gap: 2px;
    }
    
    .tab-button {
      padding: 10px 16px;
      font-size: 0.9rem;
    }
    
    .tab-icon {
      font-size: 1.1rem;
    }
    
    .tab-label {
      display: none;
    }
  }
  
  /* Large screens - better space utilization */
  @media (min-width: 1200px) {
    .calendar-header {
      padding: 32px;
    }
    
    .tab-navigation {
      margin-bottom: 32px;
    }
    
    .tab-button {
      padding: 16px 28px;
      font-size: 1.1rem;
    }
    
    .races-grid {
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: 24px;
    }
  }
</style>
