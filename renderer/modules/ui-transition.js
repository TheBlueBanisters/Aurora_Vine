/** 列表/卡片切换、侧滑面板等 UI 过渡时长（ms） */
export const CONTENT_SWITCH_MS = 240
export const PANEL_SLIDE_MS = 300

export function getContentSwitchMs() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0 : CONTENT_SWITCH_MS
}

export function getPanelSlideMs() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0 : PANEL_SLIDE_MS
}

export function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 筛选切换：旧内容上浮淡出 → 更新 DOM → 新内容自下上浮淡入
 * @param {HTMLElement | null | undefined} container
 * @param {() => void | Promise<void>} updateFn
 * @param {{ animate?: boolean }} [options]
 */
export async function runContentFadeTransition(container, updateFn, options = {}) {
  if (!container) {
    await updateFn()
    return
  }
  const ms = getContentSwitchMs()
  const shouldAnimate =
    options.animate !== false && ms > 0 && container.childElementCount > 0
  if (!shouldAnimate) {
    await updateFn()
    return
  }
  container.classList.add('is-content-switching')
  await waitMs(ms)
  await updateFn()
  container.classList.remove('is-content-switching')
  container.classList.add('is-content-entering')
  void container.offsetHeight
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      container.classList.remove('is-content-entering')
      resolve()
    })
  })
  await waitMs(ms)
}

/** 取消进行中的侧滑关闭（例如关闭过程中再次打开） */
export function cancelPanelSlideClose(panelEl) {
  if (!panelEl) return
  panelEl._slideCloseToken = (panelEl._slideCloseToken || 0) + 1
  panelEl.classList.remove('is-closing')
}

/**
 * 侧滑面板关闭：保留 active，加 is-closing，动画结束后再 cleanup
 */
export async function runPanelSlideClose(panelEl, cleanupFn) {
  if (!panelEl) {
    cleanupFn()
    return
  }
  const ms = getPanelSlideMs()
  if (!ms) {
    panelEl.classList.remove('active', 'is-closing')
    cleanupFn()
    return
  }
  const token = (panelEl._slideCloseToken = (panelEl._slideCloseToken || 0) + 1)
  panelEl.classList.add('is-closing')
  await waitMs(ms)
  if (panelEl._slideCloseToken !== token) return
  panelEl.classList.remove('active', 'is-closing')
  cleanupFn()
}
