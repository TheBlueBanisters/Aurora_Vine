import * as echarts from 'echarts'
import { t } from './i18n.js'
import { institutionTierLabel } from './institution-tier.js'
import { escapeHtml } from './utils.js'
import { isAccountMode, getCurrentUserDisplayName } from './state.js'
import { getSchoolPlanningProfile } from './storage.js'
import { getTheme } from './theme.js'
import { computeStudentScore, profileToScoreInput } from './scoring.js'
import { normalizeGpaTopPercent, formatGpaTopPercentDisplay, topPercentToRankStrength } from './gpa-percent.js'
import { pickLocalized } from './localized-content.js'

let myProfileChartInstance = null
let schoolPlanningEditing = false
let myProfileChartResizeObserver = null

function resizeMyProfileChart() {
  if (!myProfileChartInstance) return
  const page = document.getElementById('page-my-profile')
  if (!page?.classList.contains('active')) return
  myProfileChartInstance.resize()
}

function bindMyProfileChartResize(chartEl) {
  if (myProfileChartResizeObserver) {
    myProfileChartResizeObserver.disconnect()
    myProfileChartResizeObserver = null
  }
  if (!chartEl || typeof ResizeObserver === 'undefined') return

  myProfileChartResizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(resizeMyProfileChart)
  })
  myProfileChartResizeObserver.observe(chartEl)
  const card = chartEl.closest('.my-profile-chart-card')
  if (card && card !== chartEl) myProfileChartResizeObserver.observe(card)
}

export function loadMyProfile() {
  const emptyEl = document.getElementById('my-profile-empty')
  const contentEl = document.getElementById('my-profile-content')
  const infoGrid = document.getElementById('my-profile-info-grid')
  const chartEl = document.getElementById('my-profile-chart')

  if (!emptyEl || !contentEl) return

  const profile = getSchoolPlanningProfile()
  if (!profile) {
    emptyEl.style.display = 'flex'
    contentEl.style.display = 'none'
    return
  }

  emptyEl.style.display = 'none'
  contentEl.style.display = ''

  const infoItems = [
    { label: t('profile.gradYear'), value: profile.graduationYear },
    { label: t('profile.tier'), value: institutionTierLabel(profile.institutionTier) },
    { label: t('profile.school'), value: profile.schoolName },
    { label: t('profile.major'), value: profile.major },
    { label: t('profile.gpa'), value: profile.gpa ? `${profile.gpa} (${profile.gpaScale === '4' ? t('planning.scale4') : t('planning.scale5')})` : '-' },
    { label: t('profile.gpaPercentile'), value: formatGpaTopPercentDisplay(profile.gpaPercentile) || '-' },
    { label: t('profile.ielts'), value: profile.ielts != null ? profile.ielts : t('profile.noData') },
    { label: t('profile.toefl'), value: profile.toefl != null ? profile.toefl : t('profile.noData') },
    { label: 'GRE', value: profile.gre != null ? `${profile.gre} (${t('profile.greWriting')} ${profile.greWriting || '-'})` : t('profile.noData') },
    {
      label: t('profile.preferredRegions'),
      value: Array.isArray(profile.preferredRegions) && profile.preferredRegions.length
        ? profile.preferredRegions.map((id) => t(`planning.region.${id}`)).join(' / ')
        : '-'
    },
    { label: t('profile.studyGoal'), value: profile.studyGoal || '-' },
    {
      label: t('profile.preferencesExtra'),
      value: profile.preferencesExtra
        || [profile.preferredSchools, profile.constraintsNotes].filter(Boolean).join('；')
        || '-'
    },
  ]
  if (infoGrid) {
    infoGrid.innerHTML = infoItems
      .map((item) => `<div class="my-profile-info-item"><span class="my-profile-info-label">${escapeHtml(item.label)}</span><span class="my-profile-info-value">${escapeHtml(String(item.value))}</span></div>`)
      .join('')
  }

  const chartData = []
  const labels = []
  const gpaInverted = []
  const gpaTopPct = normalizeGpaTopPercent(profile.gpaPercentile)
  if (gpaTopPct !== undefined) {
    const strength = topPercentToRankStrength(gpaTopPct)
    chartData.push([labels.length, 0, Math.round(strength * 100) / 100])
    gpaInverted.push(labels.length)
    labels.push('GPA')
  }
  if (profile.ielts != null && profile.ielts !== '') {
    const score = parseFloat(profile.ielts)
    if (!isNaN(score)) {
      const pct = Math.round(((score - 4) / (9 - 4)) * 100 * 100) / 100
      chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))])
      labels.push(t('profile.ielts'))
    }
  }
  if (profile.toefl != null && profile.toefl !== '') {
    const score = parseInt(profile.toefl, 10)
    if (!isNaN(score)) {
      const pct = Math.round(((score - 70) / (120 - 70)) * 100 * 100) / 100
      chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))])
      labels.push(t('profile.toefl'))
    }
  }
  if (profile.gre != null && profile.gre !== '') {
    const score = parseInt(profile.gre, 10)
    if (!isNaN(score)) {
      const pct = Math.round(((score - 300) / (340 - 300)) * 100 * 100) / 100
      chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))])
      labels.push('GRE')
    }
  }
  if (profile.greWriting != null && profile.greWriting !== '') {
    const score = parseFloat(profile.greWriting)
    if (!isNaN(score)) {
      const pct = Math.round((score / 6) * 100 * 100) / 100
      chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))])
      labels.push(t('profile.greWriting'))
    }
  }

  const isDark = getTheme() === 'dark'
  const barColors = isDark
    ? ['#ffe066', '#fff176', '#a6e3a1', '#f9e2af', '#fab387']
    : ['#62c492', '#a8e4c8', '#a6e3a1', '#f9e2af', '#fab387']

  const roundedStarSvg = (color) =>
    `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,5 L61,38 L95,38 L68,55 L78,88 L50,72 L22,88 L32,55 L5,38 L39,38 Z" fill="${color}" stroke="${color}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/></svg>`
    )}`

  const starRich = {}
  barColors.forEach((c, i) => {
    starRich[`star${i}`] = { backgroundColor: { image: roundedStarSvg(c) }, width: 18, height: 18 }
  })

  if (chartEl && typeof echarts !== 'undefined') {
    if (chartData.length === 0) {
      if (myProfileChartResizeObserver) {
        myProfileChartResizeObserver.disconnect()
        myProfileChartResizeObserver = null
      }
      if (myProfileChartInstance) { myProfileChartInstance.dispose(); myProfileChartInstance = null }
      chartEl.innerHTML = `<p class="placeholder-hint" style="padding: 40px; text-align: center;">${escapeHtml(t('profile.noTestData'))}</p>`
    } else {
      chartEl.innerHTML = ''
      if (myProfileChartInstance) myProfileChartInstance.dispose()
      myProfileChartInstance = echarts.init(chartEl, isDark ? 'dark' : null)

      const barData = chartData.map((d, i) => ({
        value: d[2],
        itemStyle: { color: barColors[i % barColors.length] },
      }))

      myProfileChartInstance.setOption({
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const idx = params.dataIndex
            const name = (labels[idx] || '').replace(/\n/g, ' ')
            let rawVal = Number(chartData[idx][2])
            if (gpaInverted.includes(idx)) {
              const top = normalizeGpaTopPercent(profile.gpaPercentile)
              return top !== undefined
                ? `${name}: ${t('profile.gpaTopTooltip', top.toFixed(1))}`
                : `${name}: —`
            }
            const pct = isNaN(rawVal) ? String(chartData[idx][2]) : rawVal.toFixed(1)
            return `${name}: ${pct}%`
          },
        },
        grid: { left: 80, right: 60, top: 20, bottom: 20, containLabel: true },
        xAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: (v) => v + '%' } },
        yAxis: { type: 'category', data: labels, axisLabel: { interval: 0 }, inverse: false },
        series: [{
          type: 'bar',
          data: barData,
          barMaxWidth: 22,
          barCategoryGap: '40%',
          animation: true,
          animationDuration: 700,
          animationDelay: (idx) => (chartData.length - 1 - idx) * 120,
          label: {
            show: true, position: 'right', distance: 6,
            formatter: (params) => `{star${params.dataIndex % barColors.length}| }`,
            rich: starRich,
          },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } },
        }],
      })
      bindMyProfileChartResize(chartEl)
      requestAnimationFrame(resizeMyProfileChart)
    }
  }

  const statementEl = document.getElementById('my-profile-statement-box')
  if (statementEl) {
    const stmtText = profile.personalStatement ? pickLocalized(profile.personalStatement) : ''
    if (stmtText) {
      statementEl.textContent = stmtText
      statementEl.classList.add('has-content')
      statementEl.removeAttribute('data-i18n')
    } else {
      statementEl.textContent = t('profile.statementNone')
      statementEl.classList.remove('has-content')
      statementEl.setAttribute('data-i18n', 'profile.statementNone')
    }
  }
}

export function isSchoolPlanningEditing() {
  return schoolPlanningEditing
}

export function enterSchoolPlanningEditMode() {
  schoolPlanningEditing = true
  setSchoolPlanningView(false)
}

export function exitSchoolPlanningEditMode() {
  schoolPlanningEditing = false
}

export function setSchoolPlanningView(showScore) {
  const introBox = document.querySelector('#page-school-planning .planning-intro-box')
  const form = document.getElementById('school-planning-form')
  const scoreView = document.getElementById('school-planning-thanks')
  if (introBox) {
    introBox.hidden = showScore
    introBox.classList.toggle('is-hidden', showScore)
  }
  if (form) {
    form.hidden = showScore
    form.classList.toggle('is-hidden', showScore)
  }
  if (scoreView) {
    scoreView.hidden = !showScore
    scoreView.classList.toggle('is-hidden', !showScore)
  }
}

export function renderScoreResult(result) {
  const { totalScore, detail } = result
  const CIRCUMFERENCE = 2 * Math.PI * 70

  const numberEl = document.getElementById('score-total-number')
  if (numberEl) numberEl.textContent = totalScore.toFixed(1)

  const ringFill = document.querySelector('.score-ring-fill')
  if (ringFill) {
    const offset = CIRCUMFERENCE * (1 - totalScore / 100)
    ringFill.style.strokeDasharray = String(CIRCUMFERENCE)
    ringFill.style.strokeDashoffset = String(CIRCUMFERENCE)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ringFill.style.strokeDashoffset = String(offset)
      })
    })
  }

  const dims = ['gpa', 'lang', 'bg', 'school']
  dims.forEach((dim) => {
    const raw = detail[dim] ?? 0
    const pct = Math.max(0, Math.min(100, raw))
    const bar = document.getElementById(`score-bar-${dim}`)
    const val = document.getElementById(`score-val-${dim}`)
    if (bar) {
      bar.style.width = '0'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = `${pct}%`
        })
      })
    }
    if (val) val.textContent = raw.toFixed(1)
  })

  const llmWrap = document.getElementById('score-bar-llm-wrap')
  const llmRaw = detail.llm
  if (llmWrap) {
    if (llmRaw != null) {
      llmWrap.style.display = ''
      const pct = Math.max(0, Math.min(100, llmRaw))
      const bar = document.getElementById('score-bar-llm')
      const val = document.getElementById('score-val-llm')
      if (bar) {
        bar.style.width = '0'
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.width = `${pct}%`
          })
        })
      }
      if (val) val.textContent = llmRaw.toFixed(1)
    } else {
      llmWrap.style.display = 'none'
    }
  }
}

export function syncSchoolPlanningIdentityState() {
  const currentProfile = getSchoolPlanningProfile()
  if (schoolPlanningEditing) {
    setSchoolPlanningView(false)
    document.dispatchEvent(new CustomEvent('aurora:sync-school-planning-form-i18n'))
    return
  }
  setSchoolPlanningView(!!currentProfile)
  if (currentProfile) {
    const scoreInput = profileToScoreInput(currentProfile)
    const result = computeStudentScore(scoreInput)
    renderScoreResult(result)
  }
  document.dispatchEvent(new CustomEvent('aurora:sync-school-planning-form-i18n'))
}

export function initProfile(navigateTo) {
  window.addEventListener('resize', resizeMyProfileChart)
  document.getElementById('my-profile-go-planning')?.addEventListener('click', () => navigateTo('school-planning'))
  document.getElementById('score-go-my-profile')?.addEventListener('click', () => navigateTo('my-profile'))
  document.getElementById('score-go-study-planning')?.addEventListener('click', () => navigateTo('study-planning'))
}
