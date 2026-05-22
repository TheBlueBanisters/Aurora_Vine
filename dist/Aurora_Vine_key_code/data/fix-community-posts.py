# -*- coding: utf-8 -*-
import sqlite3
from pathlib import Path

DB = Path(__file__).resolve().parent / 'school_item.db'

POSTS = [
    {
        'title': '定校规划里的梯度划分，我是这样用的',
        'content': '''最近在 Aurora Vine 里把定校规划表单填完，系统给出的 reach / match / safety 分档比我预想中更"保守"一些，但回头想想反而有用：它迫使我重新审视 GPA、语言分和软背景之间是不是自洽。

我的做法是：先把目标国家/专业定死，再按"项目要求"而不是"学校名气"筛。比如同样叫 Data Science，有的偏统计、有的偏工程，课程先修要求差很多。定校规划提交后我会把每一档学校逐条对照：语言是否达标、先修课是否覆盖、是否有硬性 GRE 要求。只要有一项硬门槛不满足，就不强行放进 match。

另外分享一个小习惯：reach 校不超过 3 所，match 4-5 所，safety 2-3 所。申请季精力有限，reach 写文书成本最高，如果把 reach 列太长，最后往往每一篇都不够定制。社区里如果有同样在做欧陆/英港新的朋友，欢迎交流你们怎么平衡"排名"和"课程 fit"。''',
        'offset_days': -2,
    },
    {
        'title': 'GRE 和雅思并行备考：30 天冲刺的真实节奏',
        'content': '''我现在的策略是"阅读填空先行、数学维持手感、写作暂缓"。GRE 词汇如果只背中文释义，做 Text Completion 时还是容易被近义词绕晕；我现在每天 70 个词，但必须看完英文释义+例句，并把态度词/逻辑词单独成组。

数学部分我反而没那么焦虑——公式本身不难，难在英文题干和条件陷阱。最近把错题按"看错单位""漏读 integer""图形 not drawn to scale"分类，比刷题量更有用。建议资源中心 GRE 数学公式那篇可以配合错题本一起看。

语言考试和 GRE 并行的关键是：不要两套都按"全套模考"强度跑。我每周只安排 1 次 GRE section 计时 + 2 次雅思口语/写作限时。其余天做碎片化训练。这样不容易 burnout。大家如果也在并行备考，你们怎么分配模考频率？''',
        'offset_days': -1,
    },
    {
        'title': '从申请案例库里我学到的：同样的 GPA，路径可以完全不同',
        'content': '''这两天翻了申请案例页，有个感触：案例库最有价值的不是"录取学校有多亮"，而是软背景组合的差异。两个 GPA 相近的同学，一个靠科研论文链条进 match 档，另一个靠实习+项目作品集也能拿到不错 offer。

我现在读案例的顺序是：先看 language + GRE 是否卡线，再看 primary offer 的 tier，最后才看 tags（科研/实习/论文）。如果 tags 与项目方向一致，说明申请叙事是闭环的；如果 GPA 高但 tags 空，往往意味着文书里缺少"为什么是你"的证据。

也提醒后来者：案例是参考分布，不是复制模板。尤其欧陆项目，课程匹配和先修比 QS 排名更决定录取。欢迎一起拆案例：你会优先看哪几个字段？''',
        'offset_days': 0,
    },
]

conn = sqlite3.connect(DB)
conn.text_factory = str
cur = conn.cursor()

cur.execute('SELECT id, nickname FROM accounts ORDER BY id LIMIT 1')
account = cur.fetchone()
if not account:
    raise SystemExit('No account found')
author_id, nickname = account[0], account[1]

cur.execute('DELETE FROM community_replies WHERE post_id IN (SELECT id FROM community_posts WHERE id IN (1, 2, 3))')
cur.execute('DELETE FROM community_posts WHERE id IN (1, 2, 3)')

insert = '''
INSERT INTO community_posts (title, content, author_name, author_id, created_at, updated_at)
VALUES (?, ?, ?, ?, datetime('now', ? || ' days', 'localtime'), datetime('now', ? || ' days', 'localtime'))
'''
for post in POSTS:
    offset = str(post['offset_days'])
    cur.execute(insert, (post['title'], post['content'], nickname, author_id, offset, offset))

conn.commit()

cur.execute('SELECT id, title, length(content) FROM community_posts ORDER BY id DESC LIMIT 3')
rows = cur.fetchall()
conn.close()

print(f'Fixed posts for {nickname} (id={author_id}):')
for row in rows:
    print(row)
