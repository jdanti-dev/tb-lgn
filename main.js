const AGENT_URL = 'http://localhost:14545/api/v1/system-id';

document.addEventListener('DOMContentLoaded', () => {
  const statusContainer = document.getElementById('status-container');
  const statusText = document.getElementById('status-text');
  const spinnerElement = document.querySelector('.spinner');
  
  const resultContainer = document.getElementById('result-container');
  const valMac = document.getElementById('val-mac');
  const valHost = document.getElementById('val-host');
  const valOs = document.getElementById('val-os');
  const continueBtn = document.getElementById('continue-btn');

  // Simular un temps de validació breu pel WOW effect de l'usuari
  setTimeout(() => {
    verifyHardware();
  }, 1200);

  async function verifyHardware() {
    try {
      // Ens assegurem de fer fetch sense mode-no-cors perquè necessitem les dades
      const response = await fetch(AGENT_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Estat d'èxit (Success)
      spinnerElement.style.display = 'none';
      statusContainer.classList.add('success');
      statusText.innerHTML = '✅ Hardware Verified';
      statusText.style.color = 'var(--success)';

      // Popular les dades a la taula
      valMac.textContent = data.machineId || 'Unknown';
      valMac.classList.add('accent');
      valHost.textContent = data.hostname || 'Unknown';
      valOs.textContent = data.os || 'Unknown';

      // Mostrar els resultats 
      resultContainer.classList.remove('hidden');
      continueBtn.disabled = false;
      
      // Fer la interfície animadament més petita a dalt 
      statusContainer.style.height = '60px';

    } catch (error) {
      console.error("Local agent not detected or offline.", error);
      
      // Estat d'error / denegació
      spinnerElement.style.display = 'none';
      statusContainer.classList.add('error');
      statusText.innerHTML = '❌ Verification Failed<br><span style="color:var(--text-muted); font-size: 0.8em; margin-top:8px; display:inline-block">Local Agent is unreachable or connection rejected by CORS.</span>';
      statusText.style.color = 'var(--error)';
      statusContainer.style.height = 'auto';
      statusContainer.style.padding = '20px';
    }
  }

  continueBtn.addEventListener('click', () => {
    continueBtn.innerHTML = 'Redirecting...';
    continueBtn.style.opacity = '0.7';
    setTimeout(() => {
        alert('Authentication passed! You would be redirected into the app now.');
        continueBtn.innerHTML = 'Access System';
        continueBtn.style.opacity = '1';
    }, 800);
  });
});
