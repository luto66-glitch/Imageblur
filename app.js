// 1. Registro del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('SW registrado:', reg.scope))
      .catch((err) => console.error('Error registrando SW:', err));
  });
}

// 2. Lógica para botón de instalación PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add('hidden');
});

// 3. Elementos del DOM y estado
const form = document.getElementById('generateForm');
const apiEndpointInput = document.getElementById('apiEndpoint');
const stepsInput = document.getElementById('steps');
const stepsValue = document.getElementById('stepsValue');
const submitBtn = document.getElementById('submitBtn');

const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');
const errorBox = document.getElementById('errorBox');
const imageWrapper = document.getElementById('imageWrapper');
const outputImage = document.getElementById('outputImage');
const downloadBtn = document.getElementById('downloadBtn');

// Recuperar endpoint guardado previamente
const savedEndpoint = localStorage.getItem('ai_api_endpoint');
if (savedEndpoint) {
  apiEndpointInput.value = savedEndpoint;
}

stepsInput.addEventListener('input', (e) => {
  stepsValue.textContent = e.target.value;
});

// 4. Envío del formulario y llamada al backend
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const endpoint = apiEndpointInput.value.trim();
  const prompt = document.getElementById('prompt').value.trim();
  const negativePrompt = document.getElementById('negativePrompt').value.trim();
  const [width, height] = document.getElementById('aspectRatio').value.split('x').map(Number);
  const steps = Number(stepsInput.value);

  localStorage.setItem('ai_api_endpoint', endpoint);

  // Preparar UI
  submitBtn.disabled = true;
  resultSection.classList.remove('hidden');
  loader.classList.remove('hidden');
  errorBox.classList.add('hidden');
  imageWrapper.classList.add('hidden');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: negativePrompt,
        width,
        height,
        steps
      })
    });

    if (!response.ok) {
      throw new Error(`Error del servidor (${response.status})`);
    }

    const data = await response.json();

    // Soporta respuesta en Base64 (data.image_base64) o URL directa (data.image_url)
    let imageSrc = '';
    if (data.image_base64) {
      imageSrc = data.image_base64.startsWith('data:')
        ? data.image_base64
        : `data:image/png;base64,${data.image_base64}`;
    } else if (data.image_url) {
      imageSrc = data.image_url;
    } else {
      throw new Error('La respuesta del servidor no contiene una imagen válida.');
    }

    outputImage.src = imageSrc;
    downloadBtn.href = imageSrc;
    imageWrapper.classList.remove('hidden');
  } catch (err) {
    errorBox.textContent = `No se pudo generar la imagen: ${err.message}`;
    errorBox.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
    submitBtn.disabled = false;
  }
});
