import * as echarts from 'echarts'
import { escapeHtml } from './utils.js'
import { isAccountMode, getCurrentUserDisplayName } from './state.js'
import { getSchoolPlanningProfile } from './storage.js'
import { getTheme } from './theme.js'

let myProfileChartInstance = null

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
    { label: '本科毕业年份 / Graduation Year', value: profile.graduationYear },
    { label: '本科院校层次 / Institution Tier', value: profile.institutionTier },
    { label: '本科学校 / School', value: profile.schoolName },
    { label: '本科专业 / Major', value: profile.major },
    { label: '绩点 / GPA', value: profile.gpa ? `${profile.gpa} (${profile.gpaScale === '4' ? '四分制' : '五分制'})` : '-' },
    { label: '绩点前百分比 / GPA Percentile', value: profile.gpaPercentile ? `${profile.gpaPercentile}%` : '-' },
    { label: '雅思 / IELTS', value: profile.ielts != null ? profile.ielts : '无' },
    { label: '托福 / TOEFL', value: profile.toefl != null ? profile.toefl : '无' },
    { label: 'GRE / GRE Writing', value: profile.gre != null ? `${profile.gre} (写作 ${profile.greWriting || '-'})` : '无' },
  ]
  if (infoGrid) {
    infoGrid.innerHTML = infoItems
      .map((item) => `<div class="my-profile-info-item"><span class="my-profile-info-label">${escapeHtml(item.label)}</span><span class="my-profile-info-value">${escapeHtml(String(item.value))}</span></div>`)
      .join('')
  }

  const chartData = []
  const labels = []
  const gpaInverted = []
  if (profile.gpaPercentile != null && profile.gpaPercentile !== '') {
    const pct = parseFloat(profile.gpaPercentile)
    if (!isNaN(pct) && pct >= 0 && pct <= 100) {
      chartData.push([labels.length, 0, Math.round((100 - pct) * 100) / 100])
      gpaInverted.push(labels.length)
      labels.push('GPA')
    }
  }
  if (profile.ielts != null && profile.ielts !== '') {
    const score = parseFloat(profile.ielts)
    if (!isNaN(score)) {
      const pct = Math.round(((score - 4) / (9 - 4)) * 100 * 100) / 100
      chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))])
      labels.push('雅思 / IELTS')
    }
  }
  if (profile.toefl != null && profile.toefl !== '') {
    const score = parseInt(profile.toefl, 10)
    if (!isNaN(score)) {
      const pct = Math.round(((score - 70) / (120 - 70)) * 100 * 100) / 100
      chartData.push([labels.length, 0, Math.min(100, Math.max(0, pct))])
      labels.push('托福 / TOEFL')
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
      labels.push('GRE写作 / GRE Writing')
    }
  }

  const isDark = getTheme() === 'dark'
  const barColors = ['#89b4fa', '#74c7ec', '#a6e3a1', '#f9e2af', '#fab387']

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
      if (myProfileChartInstance) { myProfileChartInstance.dispose(); myProfileChartInstance = null }
      chartEl.innerHTML = '<p class="placeholder-hint" style="padding: 40px; text-align: center;">暂无标化成绩数据可展示 / No test score data to display</p>'
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
            if (gpaInverted.includes(idx)) rawVal = 100 - rawVal
            const pct = isNaN(rawVal) ? String(chartData[idx][2]) : rawVal.toFixed(2)
            return `${name}: ${pct}%`
          },
        },
        grid: { left: 80, right: 60, top: 20, bottom: 20, containLabel: true },
        xAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: (v) => v + '%' } },
        yAxis: { type: 'category', data: labels, axisLabel: { interval: 0 }, inverse: false },
        series: [{
          type: 'bar',
          data: barData,
          barWidth: '50%',
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
    }
  }
}

export function setSchoolPlanningView(showThanks) {
  const introBox = document.querySelector('#page-school-planning .planning-intro-box')
  const form = document.getElementById('school-planning-form')
  const thanksView = document.getElementById('school-planning-thanks')
  if (introBox) introBox.style.display = showThanks ? 'none' : ''
  if (form) form.style.display = showThanks ? 'none' : ''
  if (thanksView) thanksView.style.display = showThanks ? '' : 'none'
}

export function syncSchoolPlanningIdentityState() {
  const currentProfile = getSchoolPlanningProfile()
  setSchoolPlanningView(!!currentProfile)
}

export function initProfile(navigateTo) {
  document.getElementById('my-profile-go-planning')?.addEventListener('click', () => navigateTo('school-planning'))
  document.getElementById('my-profile-refill')?.addEventListener('click', () => {
    setSchoolPlanningView(false)
    navigateTo('school-planning')
  })
}
