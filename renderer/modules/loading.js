
let overlayEl = null;
let progressBarEl = null;
let percentEl = null;

function ensureElements() {
  if (!overlayEl) overlayEl = document.getElementById('ai-loading-overlay');
  if (!progressBarEl) progressBarEl = document.getElementById('ai-loading-progress-bar');
  if (!percentEl) percentEl = document.getElementById('ai-loading-percent');
}

export function showLoading() {
  ensureElements();
  if (!overlayEl) return;
  updateLoadingProgress(0);
  overlayEl.classList.add('active');
  overlayEl.setAttribute('aria-hidden', 'false');
}

export function updateLoadingProgress(percent) {
  ensureElements();
  const value = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  if (progressBarEl) progressBarEl.style.width = `${value}%`;
  if (percentEl) percentEl.textContent = `${value}%`;
}

export function hideLoading() {
  ensureElements();
  if (!overlayEl) return;
  overlayEl.classList.remove('active');
  overlayEl.setAttribute('aria-hidden', 'true');
  updateLoadingProgress(0);
}

export function createLoadingProgressTracker(totalSteps) {
  const total = Math.max(1, Number(totalSteps) || 1);
  let completed = 0;

  return {
    tick(step = 1) {
      completed += Math.max(0, Number(step) || 0);
      updateLoadingProgress(Math.min(100, Math.round((completed / total) * 100)));
    }
  };
}

export function countSubmitPipelineSteps({ resumeFile, generatePersonalStatement } = {}) {
  let total = 2;
  if (resumeFile) total += 2;
  if (generatePersonalStatement) total += 1;
  return total;
}

export function countSmartRegenerateSteps() {
  return 3;
}
