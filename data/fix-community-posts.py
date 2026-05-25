# -*- coding: utf-8 -*-
import sqlite3
from pathlib import Path

DB = Path(__file__).resolve().parent / 'school_item.db'

POSTS = [
    {
        'title': 'How I actually use the reach / match / safety tiers',
        'content': '''I finished my school-planning form in Aurora Vine last week, and the reach / match / safety split felt stricter than I expected at first. Looking back, that was useful: it forced me to check whether my GPA, language scores, and background story actually fit together.

My workflow is simple: lock in target countries and programs first, then filter by requirements instead of brand name. Two programs can both be called "Data Science" while one leans statistics and the other engineering—the prerequisites are not the same. After submitting my plan, I compare every school in each tier against hard gates: language minimums, required coursework, and whether GRE is mandatory.

One habit that helped: cap reach schools at three, keep four or five in match, and two or three in safety. Reach applications eat the most time, and if the list is too long, none of the essays feel truly tailored. If anyone here is targeting the UK, Hong Kong, or Singapore, I'd love to hear how you balance ranking with program fit.''',
        'offset_days': -4,
    },
    {
        'title': 'Running GRE and IELTS in parallel without burning out',
        'content': '''Current strategy: vocabulary and reading first, math for maintenance, writing later. For GRE vocab, memorizing Chinese glosses alone was not enough—Text Completion still tripped me up on near-synonyms. I now do about 70 words a day with English definitions and example sentences, and I group attitude words separately.

Math is less scary than the wording. Most mistakes come from misreading "integer," unit conversion, or "figure not drawn to scale." Sorting errors by type helped more than blind repetition. The GRE formula sheet in the resource center pairs well with a personal error log.

For dual prep, I avoid full mock exams for both tests every week. One timed GRE section, plus two IELTS speaking/writing sessions, is enough. Everything else stays fragmented. How are you splitting mock-test days if you are doing both?''',
        'offset_days': -3,
    },
    {
        'title': 'What the application case library taught me about "similar GPA, different paths"',
        'content': '''I spent two evenings in the application cases section and kept noticing the same thing: the most useful signal is not how flashy the offer is, but how the soft-background pieces fit. Two applicants with close GPAs can look completely different—one with a research chain landing a strong match, another with internships and project work still getting a solid outcome.

The order I read cases now: language + GRE first, then offer tier, then tags (research / internship / publications). When tags align with the program direction, the narrative usually feels coherent. When GPA is high but tags are empty, the profile often lacks evidence for "why you."

Reminder to anyone browsing cases: they show distributions, not copy-paste templates. For many European programs, course fit matters more than QS rank. Which fields do you look at first when comparing cases?''',
        'offset_days': -2,
    },
    {
        'title': 'Building a target-school list before application season',
        'content': '''I used to add schools to my list based on ranking alone. Aurora Vine's university database made the habit harder to keep—once you open a school page and read program requirements side by side, the gaps show up fast.

Now I maintain two lists: a "research list" where I save anything interesting, and a "short list" of schools I would actually apply to this cycle. A school only moves to the short list if language scores are realistic, prerequisites are covered, and there is at least one concrete reason beyond rank (faculty, lab, curriculum track, location, etc.).

Starred favorites in the database became my weekly review queue. Every Sunday I remove one school I am no longer serious about. Smaller lists feel less romantic, but the essays get better. Curious how many schools others keep on their final short list.''',
        'offset_days': -1,
    },
    {
        'title': 'Study-planning timeline: turning a long goal into weekly tasks',
        'content': '''The study-planning module clicked for me when I stopped treating it like a calendar and started treating it like a backlog. I set one outcome per month (e.g., "finish two reach-school essay drafts" or "complete one full GRE verbal section under time"), then break it into tasks I can finish in a single sitting.

Daily check-in helps mostly as a honesty check: did I do the thing, or did I just think about doing it? Even a 25-minute block counts if it moves an application forward. The point is not perfect streaks—it is keeping momentum visible when motivation dips.

If you are in the same phase, what is one task you wish you had started earlier? I am trying to front-load recommendation-letter prep before coursework gets heavy again.''',
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

cur.execute('DELETE FROM community_replies')
cur.execute('DELETE FROM community_posts')

insert = '''
INSERT INTO community_posts (title, content, author_name, author_id, created_at, updated_at)
VALUES (?, ?, ?, ?, datetime('now', ? || ' days', 'localtime'), datetime('now', ? || ' days', 'localtime'))
'''
for post in POSTS:
    offset = str(post['offset_days'])
    cur.execute(insert, (post['title'], post['content'], nickname, author_id, offset, offset))

conn.commit()

cur.execute('SELECT id, title, author_name, length(content) FROM community_posts ORDER BY id')
rows = cur.fetchall()
conn.close()

print(f'Inserted {len(rows)} posts for {nickname} (id={author_id}):')
for row in rows:
    print(row)
