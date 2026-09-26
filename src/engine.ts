/* =====================================================================
   engine.ts — Lecture Interactive Engine
   Initializes interactive code widgets, tabs, TOC rail, quizzes, glossary search,
   and checklists whenever a route template is loaded.
   ===================================================================== */

interface QuizOption {
  q: string
  o: string[]
  c: number
  e: string
  fb?: string[]
}

interface PickerItem {
  name: string
  in?: string[]
  out?: string[]
  note?: string
}

interface PipeItem {
  label: string
  title: string
  text: string
}

interface LessonData {
  quiz?: QuizOption[]
  glossary?: [string, string][]
  anatomy?: Record<string, string>
  pickers?: Record<string, PickerItem[]>
  pipes?: Record<string, PipeItem[]>
}

export function initEngine() {
  const $ = <T extends HTMLElement>(s: string, r?: Element | Document): T | null =>
    (r || document).querySelector(s) as T | null
  const $$ = <T extends HTMLElement>(s: string, r?: Element | Document): T[] =>
    Array.from((r || document).querySelectorAll(s)) as T[]

  let D: LessonData = {}
  const scriptData = document.getElementById('lesson-data')
  if (scriptData && scriptData.textContent) {
    try {
      D = JSON.parse(scriptData.textContent)
    } catch {
      D = {}
    }
  }

  /* ---------- Progress bar ---------- */
  const bar = $('#bar')
  function updateProgress() {
    if (!bar) return
    const h = document.documentElement.scrollHeight - window.innerHeight
    bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%'
  }
  window.onscroll = updateProgress
  updateProgress()

  /* ---------- Navigation: Rail & Topnav ---------- */
  const rail = $('nav.rail ol#toc')
  const topNav = $('.topnav')
  if (rail && topNav && !$('ol', topNav)) {
    const clone = rail.cloneNode(true) as HTMLElement
    clone.id = 'toc-m'
    topNav.appendChild(clone)
  }

  const links = $$<HTMLAnchorElement>('nav.rail a[href^="#"], .topnav a[href^="#"]')
  const secs = $$<HTMLElement>('main section[id]')

  function mark(id: string) {
    links.forEach(l => {
      const on = l.getAttribute('href') === '#' + id
      l.classList.toggle('on', on)
      if (on && l.closest('.topnav')) {
        try {
          l.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
        } catch {}
      }
    })
  }

  let curSection: string | null = null
  let tick = false
  function pickSection() {
    tick = false
    if (!secs.length) return
    const line = window.innerHeight * 0.35
    let best: HTMLElement | null = null
    for (let i = 0; i < secs.length; i++) {
      if (secs[i].getBoundingClientRect().top <= line) {
        best = secs[i]
      }
    }
    if (!best) best = secs[0]
    if (best && best.id !== curSection) {
      curSection = best.id
      mark(curSection)
    }
  }

  if (secs.length) {
    window.addEventListener(
      'scroll',
      () => {
        if (!tick) {
          tick = true
          requestAnimationFrame(pickSection)
        }
      },
      { passive: true }
    )
    pickSection()
  }

  /* ---------- Tabs: [data-tabs] ---------- */
  $$('[data-tabs]').forEach(t => {
    const key = t.getAttribute('data-tabs')
    t.addEventListener('click', e => {
      const target = e.target as HTMLElement
      const b = target.closest<HTMLButtonElement>('button[data-p]')
      if (!b) return
      $$<HTMLButtonElement>('button', t).forEach(x => {
        x.setAttribute('aria-selected', x === b ? 'true' : 'false')
      })
      $$<HTMLElement>('[data-panel^="' + key + '-"]').forEach(p => {
        p.hidden = p.getAttribute('data-panel') !== key + '-' + b.getAttribute('data-p')
      })
    })
  })

  /* ---------- Run buttons: [data-run] ---------- */
  $$('[data-run]').forEach(b => {
    const lbl = b.textContent || ''
    b.addEventListener('click', () => {
      const targetId = b.getAttribute('data-run')
      if (!targetId) return
      const o = document.getElementById(targetId)
      if (!o) return
      o.hidden = !o.hidden
      b.textContent = o.hidden ? lbl : '✕ Сховати результат'
    })
  })

  /* ---------- Chips picker: .chips[data-picker] ---------- */
  $$('.chips[data-picker]').forEach(box => {
    const name = box.getAttribute('data-picker')
    if (!name || !D.pickers || !D.pickers[name]) return
    const P = D.pickers[name]
    const out = $('[data-picker-out="' + name + '"]')
    const note = $('[data-picker-note="' + name + '"]')

    box.innerHTML = P.map(
      (p, i) =>
        `<button class="chip" aria-pressed="${i === 0 ? 'true' : 'false'}" data-i="${i}">${p.name}</button>`
    ).join('')

    function draw(i: number) {
      const p = P[i]
      let h = ''
      ;(p.in || []).forEach(f => {
        h += `<span class="fld in">${f}</span>`
      })
      ;(p.out || []).forEach(f => {
        h += `<span class="fld out">${f}</span>`
      })
      if (out) out.innerHTML = h
      if (note) note.innerHTML = p.note || ''
    }

    box.addEventListener('click', e => {
      const target = e.target as HTMLElement
      const b = target.closest<HTMLButtonElement>('.chip')
      if (!b) return
      $$('.chip', box).forEach(x => {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false')
      })
      draw(Number(b.getAttribute('data-i')))
    })

    draw(0)
  })

  /* ---------- Pipe picker: .pipe[data-pipe] ---------- */
  $$('.pipe[data-pipe]').forEach(box => {
    const name = box.getAttribute('data-pipe')
    if (!name || !D.pipes || !D.pipes[name]) return
    const P = D.pipes[name]
    const out = $('[data-pipe-out="' + name + '"]')

    box.innerHTML = P.map(
      (p, i) =>
        `<button aria-pressed="${i === 0 ? 'true' : 'false'}" data-i="${i}">${p.label}</button>`
    ).join('')

    function draw(i: number) {
      if (out) out.innerHTML = `<b>${P[i].title}</b>${P[i].text}`
    }

    box.addEventListener('click', e => {
      const target = e.target as HTMLElement
      const b = target.closest<HTMLButtonElement>('button')
      if (!b) return
      $$('button', box).forEach(x => {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false')
      })
      draw(Number(b.getAttribute('data-i')))
    })

    draw(0)
  })

  /* ---------- Code anatomy: .tok[data-e] ---------- */
  const aOut = $('.anat-out')
  $$('.tok').forEach(t => {
    t.setAttribute('tabindex', '0')
    t.setAttribute('role', 'button')
    function show() {
      $$('.tok').forEach(x => x.classList.remove('on'))
      t.classList.add('on')
      const key = t.getAttribute('data-e')
      if (aOut && key) {
        aOut.innerHTML = (D.anatomy && D.anatomy[key]) || ''
      }
    }
    t.addEventListener('click', show)
    t.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        show()
      }
    })
  })

  /* ---------- Quiz: #quizBox ---------- */
  const Q = D.quiz || []
  const LET = ['А', 'Б', 'В', 'Г', 'Д']
  const quizBox = $('#quizBox')
  const scEl = $('#sc')
  const ansEl = $('#ans')
  const totEl = $('#qtotal')
  let score = 0
  let answered = 0

  function buildQuiz() {
    if (!quizBox) return
    quizBox.innerHTML = ''
    score = 0
    answered = 0
    if (scEl) scEl.textContent = '0'
    if (ansEl) ansEl.textContent = '0'
    if (totEl) totEl.textContent = String(Q.length)

    Q.forEach((item, i) => {
      const d = document.createElement('div')
      d.className = 'q'
      let h = `<div class="qh"><span class="qn">${String(i + 1).padStart(
        2,
        '0'
      )}</span><p class="qt">${item.q}</p></div><div class="opts">`
      item.o.forEach((o, j) => {
        h += `<button class="opt" data-i="${i}" data-j="${j}"><span class="mk">${LET[j]}</span><span>${o}</span></button>`
      })
      d.innerHTML = h + '</div>'
      quizBox.appendChild(d)
    })
  }

  if (quizBox) {
    quizBox.addEventListener('click', e => {
      const target = e.target as HTMLElement
      const b = target.closest<HTMLButtonElement>('.opt')
      if (!b || b.disabled) return

      const i = Number(b.getAttribute('data-i'))
      const j = Number(b.getAttribute('data-j'))
      const item = Q[i]
      const wrap = b.closest('.q')
      if (!wrap) return

      $$<HTMLButtonElement>('.opt', wrap).forEach((x, k) => {
        x.disabled = true
        if (k === item.c) x.classList.add('right')
      })

      if (j !== item.c) {
        b.classList.add('wrong')
      } else {
        score++
      }

      answered++
      if (scEl) scEl.textContent = String(score)
      if (ansEl) ansEl.textContent = String(answered)

      const ex = document.createElement('div')
      ex.className = 'expl'
      const feedbackText = item.fb && item.fb[j] ? item.fb[j] : item.e
      ex.innerHTML =
        (j === item.c ? '<strong>Правильно. </strong>' : '<strong>Не зовсім. </strong>') +
        feedbackText
      wrap.appendChild(ex)
    })

    const r = $('#reset')
    if (r) r.addEventListener('click', buildQuiz)
    buildQuiz()
  }

  /* ---------- Glossary: #glList ---------- */
  const glList = $('#glList')
  const glEmpty = $('#glEmpty')
  const glS = $<HTMLInputElement>('#glSearch')
  if (glList) {
    glList.innerHTML = (D.glossary || [])
      .map(g => `<dl class="row"><dt>${g[0]}</dt><dd>${g[1]}</dd></dl>`)
      .join('')

    if (glS) {
      glS.addEventListener('input', function () {
        const v = this.value.trim().toLowerCase()
        let shown = 0
        $$('.row', glList).forEach(r => {
          const hit = !v || r.textContent?.toLowerCase().includes(v)
          r.classList.toggle('hide', !hit)
          if (hit) shown++
        })
        if (glEmpty) glEmpty.hidden = shown > 0
      })
    }
  }

  /* ---------- Checklist: ul.chk[data-key] ---------- */
  $$('ul.chk[data-key]').forEach(ul => {
    const KEY = ul.getAttribute('data-key')
    if (!KEY) return
    const boxes = $$<HTMLInputElement>('input[type=checkbox]', ul)
    const countEl = $('[data-chk-count="' + KEY + '"]')

    function saveState() {
      try {
        localStorage.setItem(
          KEY!,
          boxes.map(b => (b.checked ? '1' : '0')).join('')
        )
      } catch {}
    }

    function updateCount() {
      const n = boxes.filter(b => b.checked).length
      if (countEl) {
        countEl.textContent = `Виконано ${n} з ${boxes.length} пунктів`
      }
    }

    try {
      const s = localStorage.getItem(KEY)
      if (s) {
        boxes.forEach((b, i) => {
          b.checked = s[i] === '1'
        })
      }
    } catch {}

    boxes.forEach(b => {
      b.addEventListener('change', () => {
        saveState()
        updateCount()
      })
    })

    updateCount()
  })
}
