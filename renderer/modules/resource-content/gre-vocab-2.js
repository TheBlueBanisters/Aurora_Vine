/** GRE 高频词汇表（进阶篇）— 章节式正文 */
export const greVocab2Content = {
  zh: {
    sections: [
      {
        type: 'chapter',
        title: '进阶定位与学术表达',
        blocks: [
          { type: 'heading', text: '进阶篇解决什么问题' },
          { type: 'paragraph', text: '核心篇解决“认词与定方向”，进阶篇解决“近义词辨析与高级学术表达”。GRE 填空的高分瓶颈往往不在生僻词，而在一组看起来都很像的选项：例如 austere / ascetic / spartan，或 objective / dispassionate / disinterested。进阶词汇复习应配合大量对比例句，而不是继续线性刷词表。' },
          { type: 'heading', text: '抽象名词、动词与形容词' },
          { type: 'paragraph', text: '学术写作与阅读中，abstract nouns 承担论点骨架：hypothesis、corollary、anomaly、hegemony、dichotomy。动词是句子的引擎：amplify、attenuate、exacerbate、mitigate 表示变化；advocate、impugn、vindicate、repudiate 表示支持或反对。形容词考点中，ingenious（巧妙）≠ ingenuous（天真）；disinterested（公正）≠ uninterested（不感兴趣）；credible（可信）≠ credulous（轻信）。' },
          { type: 'list', items: [
            'austere / ascetic / spartan / draconian / stringent — 严厉程度递增',
            'corroborate / substantiate / buttress / undercut / refute — 证据与论证'
          ]}
        ]
      },
      {
        type: 'chapter',
        title: '多空题策略与阅读反哺',
        blocks: [
          { type: 'heading', text: '双空与三空题' },
          { type: 'paragraph', text: '双空/三空题不要逐空孤立做。应先读全句，判断整体逻辑：是“尽管 A，仍然 B”还是“因为 A，所以 B”？确定全局后，从最有信息量的那个空入手。选完一组后，把整句读一遍，检查是否语义自洽、语法通顺。' },
          { type: 'heading', text: '阅读与功能词' },
          { type: 'paragraph', text: '阅读文章会出现词表外的专业词，但命题人通常通过举例、同位语、对比给出解释。部分副词与介词短语决定论证力度：ostensibly、purportedly、inasmuch as、notwithstanding。它们常在阅读第二段出现，提示作者真实态度。' },
          { type: 'template', lines: [
            'The study corroborates earlier findings, but does not substantiate the causal claim.',
            'Critics impugn the methodology; the author attempts to vindicate it with new data.',
            'Her tone is dispassionate, not merely uninterested in the topic.'
          ]},
          { type: 'paragraph', text: '每周选 1 篇 GRE 阅读，摘 15 个高价值词，按“态度/逻辑/抽象名词”分类，并自己造 1 道双空题。Aurora Vine 社区讨论区也适合互相交换这类自造题。' }
        ]
      },
      {
        type: 'chapter',
        title: '计划、易混对与考场策略',
        blocks: [
          { type: 'heading', text: '60 天进阶计划' },
          { type: 'paragraph', text: '第 5–6 周：每天 40 个进阶词 + 10 组易混辨析；第 7 周：专攻双空三空限时，每题目标 90 秒内完成并写一句复盘；第 8 周：混合 verbal section，统计“辨析失误”占比。若辨析失误仍高于 30%，应回退到英文释义复述练习。' },
          { type: 'list', items: [
            'complement vs. compliment    |    continuous vs. continual',
            'affect vs. effect    |    economic vs. economical',
            'definite vs. definitive    |    alternate vs. alternative'
          ]},
          { type: 'heading', text: '错题本与考场取舍' },
          { type: 'paragraph', text: '记录进阶词错题时，增加三列：① 我选的词 ② 正确词 ③ 二者差异一句话。例如 plausible vs. specious：前者“貌似合理”，后者“看似合理实则谬误”。若时间紧张，优先做 sentence equivalence 和单空，双空三空放后但不可全弃。' },
          { type: 'note', text: '进阶篇适合已完成核心篇 800–1200 词、且 TC 正确率稳定在 60% 以上的同学。若基础词仍大量遗忘，请回核心篇调整复习周期。' }
        ]
      }
    ]
  },
  en: {
    sections: [
      {
        type: 'chapter',
        title: 'Advanced Purpose and Academic Expression',
        blocks: [
          { type: 'heading', text: 'What This List Adds' },
          { type: 'paragraph', text: 'The core list builds recognition; the advanced list builds synonym discrimination and academic precision. Plateaus often come from clusters such as austere/ascetic/spartan or objective/dispassionate/disinterested.' },
          { type: 'paragraph', text: 'Abstract nouns anchor reasoning; verbs drive change and argument; adjective pairs like ingenious/ingenuous and credible/credulous are classic traps.' },
          { type: 'list', items: [
            'austere / ascetic / spartan / draconian / stringent',
            'corroborate / substantiate / buttress / undercut / refute'
          ]}
        ]
      },
      {
        type: 'chapter',
        title: 'Multi-Blank Strategy and Reading Feedback',
        blocks: [
          { type: 'heading', text: 'Two- and Three-Blank Items' },
          { type: 'paragraph', text: 'Read for global logic first, then attack the blank with the strongest signal. Read the full sentence aloud for coherence before confirming.' },
          { type: 'template', lines: [
            'The study corroborates earlier findings but does not substantiate causality.',
            'Tone is dispassionate, not merely uninterested.'
          ]}
        ]
      },
      {
        type: 'chapter',
        title: 'Plan and Exam Strategy',
        blocks: [
          { type: 'paragraph', text: 'Weeks 5–6: 40 advanced words + discrimination drills daily. Week 7: timed multi-blank sets. Week 8: mixed verbal sections with error-type tracking.' },
          { type: 'note', text: 'Use after 800–1200 core words and roughly 60% text-completion accuracy.' }
        ]
      }
    ]
  }
}
