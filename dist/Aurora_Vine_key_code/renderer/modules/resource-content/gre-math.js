/** GRE 数学公式速查 — 章节式正文 + KaTeX 公式 */
export const greMathContent = {
  zh: {
    sections: [
      {
        type: 'chapter',
        title: 'GRE Quant 备考总览',
        blocks: [
          { type: 'heading', text: '考查本质与四大题型' },
          { type: 'paragraph', text: 'GRE 数学（Quantitative Reasoning）考查在限时条件下阅读英文题干、建模并计算的能力。对中国大陆多数理工科同学，知识难度通常不高于高中，但分数差异来自：英文条件读漏、单位未统一、整数/正数/非零等限制未注意、以及 Data Interpretation 图表误读。Quant 含 Quantity Comparison（比大小）、Multiple Choice、Numeric Entry 和 Data Interpretation。建议平时按 1.5–2 分钟/题训练，整 section 留 3–5 分钟检查。' },
          { type: 'heading', text: 'Quantity Comparison 与 Word Problem' },
          { type: 'paragraph', text: '比大小题先化简两边表达式，再考虑特殊值。若涉及变量，测试 0、1、负数、分数——但须满足题干条件（如 $x$ 为正整数）。两边同时加/减同一数不等关系不变；同乘正数不变；同乘负数反转。英文应用题建议分三行笔记：已知量与单位 → 设未知数写关系式 → 求解目标。关键词：at least $\\geq$；at most $\\leq$；increased by 30% $\\times 1.3$。' },
          { type: 'heading', text: 'Data Interpretation 读图要点' },
          { type: 'paragraph', text: '图表题先读标题、坐标轴单位、图例，再读题。注意 scale 是否从 0 开始；bar 高度比较时看清是否 stacked。DI 错题常因“看错单位”或“把近似当精确”。' }
        ]
      },
      {
        type: 'chapter',
        title: '核心公式体系',
        blocks: [
          { type: 'heading', text: '算术与数论' },
          { type: 'list', items: [
            '奇偶性：odd $\\pm$ odd $=$ even；odd $\\times$ odd $=$ odd',
            '余数：若 $n$ 除以 $k$ 余 $r$，则 $n = qk + r$',
            'percent change $= \\dfrac{\\text{new} - \\text{old}}{\\text{old}} \\times 100\\%$'
          ]},
          { type: 'formula', latex: '\\text{lcm}(a,b) \\times \\gcd(a,b) = |ab|', caption: '最小公倍数与最大公约数' },
          { type: 'heading', text: '代数' },
          { type: 'formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', caption: '一元二次方程求根公式' },
          { type: 'formula', latex: 'a^2 - b^2 = (a+b)(a-b)', caption: '平方差因式分解' },
          { type: 'formula', latex: 'a^m \\cdot a^n = a^{m+n},\\quad (a^m)^n = a^{mn}', caption: '指数法则' },
          { type: 'heading', text: '几何' },
          { type: 'formula', latex: 'C = 2\\pi r,\\quad A = \\pi r^2', caption: '圆的周长与面积' },
          { type: 'formula', latex: 'A = \\frac{1}{2}bh', caption: '三角形面积' },
          { type: 'paragraph', text: '特殊直角三角形：30°-60°-90° 边长比 $1:\\sqrt{3}:2$；45°-45°-90° 为 $1:1:\\sqrt{2}$。圆柱体积 $V = \\pi r^2 h$，侧面积 $2\\pi rh$。' },
          { type: 'heading', text: '坐标几何' },
          { type: 'formula', latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}', caption: '斜率' },
          { type: 'formula', latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', caption: '两点距离' },
          { type: 'formula', latex: '(x-h)^2 + (y-k)^2 = r^2', caption: '圆的标准方程' },
          { type: 'heading', text: '计数与概率' },
          { type: 'formula', latex: 'nP_r = \\frac{n!}{(n-r)!},\\quad nC_r = \\frac{n!}{r!(n-r)!}', caption: '排列与组合' },
          { type: 'formula', latex: 'P(A \\cap B) = P(A) \\cdot P(B)', caption: '独立事件' },
          { type: 'formula', latex: 'E(X) = \\sum x_i \\cdot P(x_i)', caption: '期望值' }
        ]
      },
      {
        type: 'chapter',
        title: '复盘方法与备考计划',
        blocks: [
          { type: 'heading', text: '错题分类' },
          { type: 'paragraph', text: '建议错题本四分类：A 读题错误（关键字、限制条件）；B 知识漏洞（公式、定义）；C 计算失误；D 时间压力下跳步。只记录题面不记录错因，复盘价值很低。GRE 允许写板，估算可节省大量时间，例如 $\\sqrt{50} \\approx 7.07$，$\\pi \\approx 3.14$。' },
          { type: 'heading', text: '30 天维持计划与检查清单' },
          { type: 'paragraph', text: '若 verbal 是主战场，Quant 可“维持手感”：每天 20 题限时 + 5 题错题复盘，每周 1 套完整 Quant section。目标 160+ 重点保证 arithmetic/algebra/word problem 稳定；目标 165+ 需在 QC 与 hard MC 上压缩时间，减少 careless error。' },
          { type: 'list', items: [
            '题目问 integer、positive、distinct 还是 any number？',
            '单位是否统一（minutes vs hours）？',
            '几何图是否标注 not drawn to scale？',
            '多选题是否漏选 “select all that apply”？'
          ]},
          { type: 'note', text: '公式速查的价值在“快速定位知识盲点”，而非替代做题。请与 Aurora Vine 定校规划中的 GRE 字段对照，确认目标项目是否有最低 Quant 要求。' }
        ]
      }
    ]
  },
  en: {
    sections: [
      {
        type: 'chapter',
        title: 'GRE Quant Overview',
        blocks: [
          { type: 'heading', text: 'What Quant Tests' },
          { type: 'paragraph', text: 'GRE Quant tests modeling and computation under time pressure with English wording. Score gaps often come from misread conditions, unit errors, and chart misinterpretation—not missing advanced math.' },
          { type: 'heading', text: 'QC and Word Problems' },
          { type: 'paragraph', text: 'For quantity comparison, simplify both sides and test permitted values including 0, 1, and negatives. For word problems, track units and translate keywords: at least $\\geq$, increased by 30% $\\times 1.3$.' }
        ]
      },
      {
        type: 'chapter',
        title: 'Core Formula Reference',
        blocks: [
          { type: 'formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', caption: 'Quadratic formula' },
          { type: 'formula', latex: 'C = 2\\pi r,\\quad A = \\pi r^2', caption: 'Circle' },
          { type: 'formula', latex: 'A = \\frac{1}{2}bh', caption: 'Triangle area' },
          { type: 'formula', latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', caption: 'Distance' },
          { type: 'formula', latex: 'nC_r = \\frac{n!}{r!(n-r)!}', caption: 'Combinations' },
          { type: 'formula', latex: 'P(A \\cap B) = P(A)P(B)', caption: 'Independent events' }
        ]
      },
      {
        type: 'chapter',
        title: 'Review and Study Plan',
        blocks: [
          { type: 'paragraph', text: 'Track four error types: misread stem, knowledge gap, calculation slip, time pressure. Maintain Quant with 20 timed questions daily if Verbal is your focus.' },
          { type: 'note', text: 'Cross-check target programs in School Planning for minimum Quant expectations.' }
        ]
      }
    ]
  }
}
