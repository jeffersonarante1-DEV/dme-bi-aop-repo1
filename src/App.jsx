import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import * as am5 from '@amcharts/amcharts5'
import * as am5map from '@amcharts/amcharts5/map'
import am5geodataWorldLow from '@amcharts/amcharts5-geodata/worldLow.js'
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated'
import './App.css'

// Stable page IDs keep scroll targets, CSS scopes, and future navigation isolated per slide.
const PAGE_IDS = Object.freeze({
  starfield: 'page-starfield',
  opening: 'page-opening-globe',
  intro: 'page-intro',
  delivered: 'page-delivered',
  secretSauce: 'page-secret-sauce',
  commitment: 'page-commitment',
  needs: 'page-needs',
  thankYou: 'page-thank-you',
  tldr: 'page-tldr',
})

// Page 03 card data: What we've delivered.
const deliveredCards = [
  {
    id: 'andromeda',
    label: 'andromeda',
    backTitle: '01. People Development',
    backIcon: 'groups',
    backBody:
      'People Development : Building internal capability through hands-on training in data engineering, ETL, and Power BI reporting.',
    backItems: [
      'Carlito, Celina, Dunstan, and Jammy can now upload data from SharePoint to Azure SQL in one click.',
      'George and Megail are designing Power BI dashboards.',
      'Gleah supports project coordination.',
    ],
    backFooter: 'training - fgd - motivation',
    motion: {
      '--drift-duration': '78s',
      '--float-duration': '42s',
      '--pulse-duration': '31s',
      '--trace-duration': '36s',
      '--drift-rotation': '137deg',
      '--float-x': '1.1%',
      '--float-y': '-0.7%',
      '--float-rotation': '0.7deg',
    },
    points: [[24, 55], [38, 44], [54, 48], [70, 38], [82, 47]],
    path: 'M24 55 L38 44 L54 48 L70 38 L82 47',
  },
  {
    id: 'big-dipper',
    label: 'big dipper',
    backTitle: '02. Azure SQL Centralization',
    backIcon: 'database',
    backBody:
      'Data is now hosted and centralized in Azure SQL, creating a stronger foundation for reporting, automation, and analytics.',
    backItems: ['UKG data ingestion', 'InContact data ingestion', 'QA data ingestion', 'Additional operational datasets'],
    backFooter: 'cloud - governance - foundation',
    motion: {
      '--drift-duration': '94s',
      '--float-duration': '58s',
      '--pulse-duration': '39s',
      '--trace-duration': '44s',
      '--drift-rotation': '-219deg',
      '--float-x': '-0.6%',
      '--float-y': '1.3%',
      '--float-rotation': '-0.9deg',
    },
    points: [[18, 60], [32, 52], [47, 56], [58, 47], [70, 35], [82, 39], [90, 51]],
    path: 'M18 60 L32 52 L47 56 L58 47 L70 35 L82 39 L90 51 M47 56 L52 68 L66 70 L58 47',
  },
  {
    id: 'small-dipper',
    label: 'small dipper',
    backTitle: '03. Power BI Dashboards',
    backIcon: 'bar_chart',
    backBody:
      'Manual Excel reports are being rebuilt into Power BI dashboards - faster to load, cleaner to read, and designed to provide decision-grade insights for leadership and operations.',
    backItems: [
      'InContact Dashboard',
      'HR Dashboards',
      'CSAT Dashboards',
      'Additional leadership and operations dashboards',
    ],
    backFooter: 'dashboards - insight - self-serve',
    motion: {
      '--drift-duration': '86s',
      '--float-duration': '51s',
      '--pulse-duration': '35s',
      '--trace-duration': '41s',
      '--drift-rotation': '284deg',
      '--float-x': '0.4%',
      '--float-y': '1.1%',
      '--float-rotation': '1.2deg',
    },
    points: [[20, 42], [34, 48], [48, 43], [58, 54], [69, 61], [80, 55], [88, 66]],
    path: 'M20 42 L34 48 L48 43 L58 54 L69 61 L80 55 L88 66 M58 54 L54 68 L68 74 L69 61',
  },
  {
    id: 'constellation',
    label: 'constellation',
    backTitle: '04. Custom Web Apps',
    backIcon: 'web_asset',
    backBody:
      'Custom web applications solve current business needs when teams require entry forms, approval flows, or structured data capture.',
    backItems: [
      'Billable Hours Approval',
      'HR Rewards and Recognition Site',
      'DocuPlanner - a centralized documentation and project coordination platform for leadership visibility, team alignment, and operational continuity.',
    ],
    backFooter: 'forms - workflow - capture',
    motion: {
      '--drift-duration': '103s',
      '--float-duration': '64s',
      '--pulse-duration': '43s',
      '--trace-duration': '49s',
      '--drift-rotation': '-156deg',
      '--float-x': '-1.2%',
      '--float-y': '-0.4%',
      '--float-rotation': '-0.6deg',
    },
    points: [[16, 35], [30, 28], [43, 44], [55, 34], [66, 50], [78, 45], [88, 62], [52, 68], [31, 72]],
    path: 'M16 35 L30 28 L43 44 L55 34 L66 50 L78 45 L88 62 M43 44 L52 68 L31 72 M66 50 L52 68',
  },
]

// Page 04 card data: The Secret Sauce we are building steadily.
const secretSauceCards = [
  {
    id: 'data-discipline',
    label: 'secured spaces',
    backTitle: '01. Secured Spaces',
    backIcon: 'lock',
    backBody:
      'Each BI member has a secured sandbox space where they can work safely without the risk of deleting or affecting another team member\'s data.',
    backItems: [],
    backFooter: '',
    motion: {
      '--drift-duration': '91s',
      '--float-duration': '55s',
      '--pulse-duration': '37s',
      '--trace-duration': '44s',
      '--drift-rotation': '214deg',
      '--float-x': '0.7%',
      '--float-y': '-0.9%',
      '--float-rotation': '0.8deg',
    },
    points: [[18, 58], [32, 46], [48, 51], [61, 39], [78, 44], [88, 34]],
    path: 'M18 58 L32 46 L48 51 L61 39 L78 44 L88 34',
  },
  {
    id: 'cloud-core',
    label: 'azure sql',
    backTitle: '02. Azure SQL',
    backIcon: 'storage',
    backBody:
      'Write once, reuse by many. Centralized data in Azure SQL creates one trusted source that can power multiple reports, dashboards, and automation workflows.',
    backItems: [],
    backFooter: '',
    motion: {
      '--drift-duration': '99s',
      '--float-duration': '62s',
      '--pulse-duration': '41s',
      '--trace-duration': '48s',
      '--drift-rotation': '-188deg',
      '--float-x': '-0.8%',
      '--float-y': '1%',
      '--float-rotation': '-1deg',
    },
    points: [[20, 39], [34, 35], [48, 44], [62, 34], [76, 42], [84, 56], [66, 64]],
    path: 'M20 39 L34 35 L48 44 L62 34 L76 42 L84 56 M48 44 L66 64 L84 56',
  },
  {
    id: 'insight-design',
    label: 'custom web development',
    backTitle: '03. Custom Web Development',
    backIcon: 'code',
    backBody:
      'Entry forms for every situation. When the business needs structured data capture, approvals, or workflow tracking, custom web apps become the fastest path from problem to solution.',
    backItems: [],
    backFooter: '',
    motion: {
      '--drift-duration': '84s',
      '--float-duration': '49s',
      '--pulse-duration': '33s',
      '--trace-duration': '39s',
      '--drift-rotation': '302deg',
      '--float-x': '1%',
      '--float-y': '0.6%',
      '--float-rotation': '1.1deg',
    },
    points: [[16, 62], [30, 52], [42, 55], [54, 45], [66, 49], [78, 38], [88, 48]],
    path: 'M16 62 L30 52 L42 55 L54 45 L66 49 L78 38 L88 48',
  },
  {
    id: 'workflow-apps',
    label: 'machine learning',
    backTitle: '04. Machine Learning',
    backIcon: 'psychology',
    backBody:
      'Turning data into prediction. Machine Learning helps move DME-BI from reporting what happened to anticipating what needs attention next.',
    backItems: [],
    backFooter: '',
    motion: {
      '--drift-duration': '107s',
      '--float-duration': '68s',
      '--pulse-duration': '45s',
      '--trace-duration': '53s',
      '--drift-rotation': '-248deg',
      '--float-x': '-1.1%',
      '--float-y': '-0.5%',
      '--float-rotation': '-0.7deg',
    },
    points: [[22, 34], [36, 48], [49, 42], [58, 58], [72, 51], [86, 63], [40, 69]],
    path: 'M22 34 L36 48 L49 42 L58 58 L72 51 L86 63 M58 58 L40 69 L36 48',
  },
  {
    id: 'team-momentum',
    label: 'power bi',
    backTitle: '05. Power BI',
    backIcon: 'dashboard',
    backBody:
      'Built for visualization. Power BI transforms centralized data into clean, fast, and decision-ready dashboards for leadership and operations.',
    backItems: [],
    backFooter: '',
    motion: {
      '--drift-duration': '96s',
      '--float-duration': '57s',
      '--pulse-duration': '42s',
      '--trace-duration': '46s',
      '--drift-rotation': '166deg',
      '--float-x': '0.3%',
      '--float-y': '1.2%',
      '--float-rotation': '0.5deg',
    },
    points: [[14, 50], [28, 42], [42, 46], [55, 36], [70, 43], [84, 36], [90, 54], [66, 66]],
    path: 'M14 50 L28 42 L42 46 L55 36 L70 43 L84 36 L90 54 M70 43 L66 66 L42 46',
  },
]

const tldrColumns = [
  {
    id: 'delivered',
    title: "What's delivered",
    icon: 'task_alt',
    footer: 'Foundation delivered',
    tableRows: [['1.A | People Development', 'Building internal capability through hands-on training in data engineering, ETL, and Power BI reporting.'], ['2.A | Azure SQL Environment', 'Centralizing key datasets into one trusted source to power reporting, automation, and analytics.'], ['3.A | Custom Web Applications', 'Built when the business needs entry forms, approval flows, or structured data capture connected directly to Azure SQL.'], ['4.A | Power BI Dashboards', 'Transforming centralized Azure SQL data into clean, decision-ready dashboards for leadership and operations.'], '5.A | -'],
  },
  {
    id: 'commitment',
    title: 'Commitments Through EOY',
    icon: 'event_upcoming',
    footer: 'Execution focus',
    tableRows: ['1.B | Continuous Training and Development', '2.B | Continuous Data Integration', '3.B | Continuous Custom Web Applications', '4.B | Continuous Power BI Dashboards', ['5.B | Machine Learning', '(Forecasting, Clustering, Segmentations, etc.)']],
  },
  {
    id: 'needs',
    title: ["What's", 'needed'],
    icon: 'priority_high',
    footer: 'Support required',
    tableRows: ['1.C | Better Laptop Specs', '2.C | Strategic Reserve of $500.00 monthly', '3.C | -', '4.C | -', '5.C | Data Engineer | Machine Learning'],
  },
  {
    id: 'ecosystem',
    title: ['The', 'ecosystem'],
    icon: 'hub',
    footer: 'Target state',
    tableRows: ['1.D | Secured Training Environment for Python and SQL', ['2.D | Azure Ecosystem', '( Automations, SQL Server, Web Page Hosting, etc. )'], ['3.D | Custom Web Development', '( Billable Hours, HR Rewards, DocuPlanner, etc. )'], ['4.D | Power BI', 'Reports without the need for Human Delivery'], '5.D | Visualizations + ML'],
  },
]

const CommitmentNetworkCanvas = memo(function CommitmentNetworkCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frame = 0
    let nodes = []
    let edges = []
    let crawlers = []
    const startedAt = performance.now()

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build(rect.width, rect.height)
    }

    function spawnCrawler() {
      if (edges.length === 0) return
      const edge = edges[Math.floor(Math.random() * edges.length)]
      crawlers.push({
        edge,
        progress: Math.random(),
        speed: 0.0008 + Math.random() * 0.0012,
        color: ['0,229,255', '167,139,255', '255,91,205'][Math.floor(Math.random() * 3)],
        size: 1.8 + Math.random() * 1.2,
      })
    }

    function build(w, h) {
      nodes = []
      edges = []
      const count = Math.max(18, Math.floor((w * h) / 7000))
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: w * 0.06 + Math.random() * w * 0.88,
          y: h * 0.06 + Math.random() * h * 0.88,
          r: 1.4 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.5,
          color: ['0,229,255', '167,139,255', '255,91,205'][Math.floor(Math.random() * 3)],
        })
      }
      const maxDist = Math.min(w, h) * 0.42
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b, j) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < maxDist) edges.push({ a: i, b: i + j + 1, d, maxDist })
        })
      })

      // Seed crawlers on random edges
      crawlers = []
      const crawlerCount = Math.max(2, Math.floor(edges.length * 0.12))
      for (let i = 0; i < crawlerCount; i++) {
        spawnCrawler()
      }
    }

    function draw() {
      const t = (performance.now() - startedAt) / 1000
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2))
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2))

      ctx.clearRect(0, 0, w, h)

      edges.forEach(({ a, b, d, maxDist }) => {
        const na = nodes[a], nb = nodes[b]
        const baseAlpha = (1 - d / maxDist) * 0.14
        const breathe = 0.5 + 0.5 * Math.sin(t * 0.7 + na.phase + nb.phase)
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.lineTo(nb.x, nb.y)
        ctx.strokeStyle = `rgba(255,255,255,${baseAlpha * breathe})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      })

      nodes.forEach(node => {
        const pulse = Math.sin(t * node.speed + node.phase)
        const r = node.r + pulse * 1.4
        const alpha = 0.28 + pulse * 0.22

        ctx.beginPath()
        ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${node.color},${alpha * 0.22})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(${node.color},0.7)`
        ctx.fillStyle = `rgba(${node.color},${alpha})`
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Crawlers — glowing dots that travel along existing edges
      crawlers = crawlers.filter(c => {
        c.progress += c.speed
        if (c.progress >= 1) {
          spawnCrawler()
          return false
        }
        const na = nodes[c.edge.a]
        const nb = nodes[c.edge.b]
        const x = na.x + (nb.x - na.x) * c.progress
        const y = na.y + (nb.y - na.y) * c.progress

        ctx.beginPath()
        ctx.arc(x, y, c.size, 0, Math.PI * 2)
        ctx.shadowBlur = 12
        ctx.shadowColor = `rgba(${c.color},0.9)`
        ctx.fillStyle = `rgba(${c.color},0.95)`
        ctx.fill()
        ctx.shadowBlur = 0
        return true
      })

      frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="commitment-network-canvas" aria-hidden="true" />
})

const CircuitBoardCanvas = memo(function CircuitBoardCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let rafId = 0
    let nodes = []
    let traces = []
    let crawlers = []
    let heroCrawlers = []
    const T0 = performance.now()

    function resize() {
      const el = canvas.parentElement
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = el.clientWidth
      const h = el.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build(w, h)
    }

    function spawnCrawler() {
      if (!traces.length) return
      const tr = traces[Math.floor(Math.random() * traces.length)]
      crawlers.push({
        tr,
        t: Math.random(),
        dir: Math.random() < 0.5 ? 1 : -1,
        speed: 0.00016 + Math.random() * 0.00020,
        col: Math.random() < 0.55 ? '0,229,255' : Math.random() < 0.6 ? '167,139,255' : '255,91,205',
        sz: 1.1 + Math.random() * 0.9,
      })
    }

    function spawnHeroCrawler() {
      if (!traces.length) return
      // Prefer longer traces so the comet has room to travel
      const pool = traces.filter(tr => {
        let len = 0
        for (let i = 1; i < tr.pts.length; i++)
          len += Math.hypot(tr.pts[i].x - tr.pts[i - 1].x, tr.pts[i].y - tr.pts[i - 1].y)
        return len > 100
      })
      const src = pool.length > 0 ? pool : traces
      const tr = src[Math.floor(Math.random() * src.length)]
      const dir = Math.random() < 0.5 ? 1 : -1
      heroCrawlers.push({
        tr,
        t: dir === 1 ? 0 : 1,
        dir,
        speed: 0.00055 + Math.random() * 0.00035,
        col: Math.random() < 0.5 ? '0,229,255' : '255,60,172',
        tailSteps: 14,
        stepBack: 0.018,
      })
    }

    function build(w, h) {
      nodes = []; traces = []; crawlers = []

      const G = Math.round(Math.min(w, h) / 13)
      const cols = Math.ceil(w / G) + 1
      const rows = Math.ceil(h / G) + 1
      const grid = new Map()

      // Jittered grid nodes
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (Math.random() > 0.46) continue
          const x = Math.min(w - 2, Math.max(2, c * G + (Math.random() - 0.5) * G * 0.10))
          const y = Math.min(h - 2, Math.max(2, r * G + (Math.random() - 0.5) * G * 0.10))
          const rnd = Math.random()
          const nd = {
            x, y, c, r,
            kind: rnd < 0.05 ? 'chip' : rnd < 0.20 ? 'via' : 'pad',
            col: Math.random() < 0.60 ? '0,229,255' : Math.random() < 0.55 ? '167,139,255' : '255,91,205',
            ph: Math.random() * Math.PI * 2,
            spd: 0.28 + Math.random() * 0.52,
          }
          nodes.push(nd)
          grid.set(`${c},${r}`, nd)
        }
      }

      // Long horizontal + vertical bus traces
      const busN = Math.max(6, Math.round(Math.min(w, h) / G * 0.45))
      for (let i = 0; i < busN; i++) {
        if (Math.random() < 0.5) {
          const y = (0.06 + Math.random() * 0.88) * h
          const x0 = Math.random() * w * 0.12
          const x1 = w * (0.82 + Math.random() * 0.14)
          traces.push({ pts: [{ x: x0, y }, { x: x1, y }], al: 0.05 + Math.random() * 0.05, lw: Math.random() < 0.25 ? 1.3 : 0.65 })
          nodes.push({ x: x0, y, c: -1, r: -1, kind: 'pad', col: '0,229,255', ph: Math.random() * Math.PI * 2, spd: 0.3 + Math.random() * 0.4 })
          nodes.push({ x: x1, y, c: -1, r: -1, kind: 'pad', col: '0,229,255', ph: Math.random() * Math.PI * 2, spd: 0.3 + Math.random() * 0.4 })
        } else {
          const x = (0.06 + Math.random() * 0.88) * w
          const y0 = Math.random() * h * 0.10
          const y1 = h * (0.84 + Math.random() * 0.12)
          traces.push({ pts: [{ x, y: y0 }, { x, y: y1 }], al: 0.05 + Math.random() * 0.05, lw: Math.random() < 0.25 ? 1.3 : 0.65 })
          nodes.push({ x, y: y0, c: -1, r: -1, kind: 'pad', col: '167,139,255', ph: Math.random() * Math.PI * 2, spd: 0.3 + Math.random() * 0.4 })
          nodes.push({ x, y: y1, c: -1, r: -1, kind: 'pad', col: '167,139,255', ph: Math.random() * Math.PI * 2, spd: 0.3 + Math.random() * 0.4 })
        }
      }

      // Orthogonal L-shaped traces between nearby grid nodes
      const seen = new Set()
      nodes.forEach(a => {
        if (a.c === -1) return
        for (let dc = -2; dc <= 2; dc++) {
          for (let dr = -2; dr <= 2; dr++) {
            if (!dc && !dr) continue
            const b = grid.get(`${a.c + dc},${a.r + dr}`)
            if (!b) continue
            const key = a.x <= b.x
              ? `${a.x.toFixed(1)}|${a.y.toFixed(1)}-${b.x.toFixed(1)}|${b.y.toFixed(1)}`
              : `${b.x.toFixed(1)}|${b.y.toFixed(1)}-${a.x.toFixed(1)}|${a.y.toFixed(1)}`
            if (seen.has(key)) continue
            if (Math.random() > 0.40) continue
            if (Math.hypot(b.x - a.x, b.y - a.y) < G * 0.4) continue
            seen.add(key)
            const mid = Math.random() < 0.5 ? { x: b.x, y: a.y } : { x: a.x, y: b.y }
            traces.push({ pts: [{ x: a.x, y: a.y }, mid, { x: b.x, y: b.y }], al: 0.07 + Math.random() * 0.08, lw: Math.random() < 0.10 ? 1.2 : 0.65 })
          }
        }
      })

      const crawlerN = Math.max(10, Math.floor(traces.length * 0.14))
      for (let i = 0; i < crawlerN; i++) spawnCrawler()

      heroCrawlers = []
      spawnHeroCrawler()
      spawnHeroCrawler()
    }

    function draw() {
      const t = (performance.now() - T0) / 1000
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      // Traces
      traces.forEach(({ pts, al, lw }) => {
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
        ctx.strokeStyle = `rgba(0,210,255,${al})`
        ctx.lineWidth = lw
        ctx.lineJoin = 'miter'
        ctx.stroke()
      })

      // Nodes
      nodes.forEach(nd => {
        const pulse = Math.sin(t * nd.spd + nd.ph)
        const al = 0.22 + pulse * 0.16

        if (nd.kind === 'chip') {
          const sz = 11 + pulse * 1.2
          ctx.strokeStyle = `rgba(${nd.col},${al * 0.68})`
          ctx.lineWidth = 0.55
          ctx.strokeRect(nd.x - sz / 2, nd.y - sz / 2, sz, sz)
          // Pin marks
          for (let p = 0; p < 3; p++) {
            const py = nd.y - sz / 2 + sz * (0.22 + p * 0.28)
            ctx.beginPath(); ctx.moveTo(nd.x - sz / 2, py); ctx.lineTo(nd.x - sz / 2 - 3.5, py); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(nd.x + sz / 2, py); ctx.lineTo(nd.x + sz / 2 + 3.5, py); ctx.stroke()
          }
          ctx.beginPath()
          ctx.arc(nd.x, nd.y, 1.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${nd.col},${al + 0.1})`
          ctx.fill()

        } else if (nd.kind === 'via') {
          ctx.beginPath()
          ctx.arc(nd.x, nd.y, 4.2, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${nd.col},${al * 0.5})`
          ctx.lineWidth = 0.65
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(nd.x, nd.y, 2.1, 0, Math.PI * 2)
          ctx.shadowBlur = 7
          ctx.shadowColor = `rgba(${nd.col},0.65)`
          ctx.fillStyle = `rgba(${nd.col},${al})`
          ctx.fill()
          ctx.shadowBlur = 0

        } else {
          ctx.beginPath()
          ctx.arc(nd.x, nd.y, 1.6, 0, Math.PI * 2)
          ctx.shadowBlur = 5
          ctx.shadowColor = `rgba(${nd.col},0.5)`
          ctx.fillStyle = `rgba(${nd.col},${al + 0.08})`
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Regular crawlers
      crawlers = crawlers.filter(c => {
        c.t += c.speed * c.dir
        if (c.t > 1 || c.t < 0) { spawnCrawler(); return false }
        const { pts } = c.tr
        const seg = c.t * (pts.length - 1)
        const si = Math.min(Math.floor(seg), pts.length - 2)
        const st = seg - si
        const x = pts[si].x + (pts[si + 1].x - pts[si].x) * st
        const y = pts[si].y + (pts[si + 1].y - pts[si].y) * st
        ctx.beginPath()
        ctx.arc(x, y, c.sz, 0, Math.PI * 2)
        ctx.shadowBlur = 12
        ctx.shadowColor = `rgba(${c.col},0.95)`
        ctx.fillStyle = `rgba(${c.col},0.9)`
        ctx.fill()
        ctx.shadowBlur = 0
        return true
      })

      // Hero crawlers — large comet with a fading tail
      function sampleTrace(pts, t) {
        const seg = Math.max(0, Math.min(1, t)) * (pts.length - 1)
        const si = Math.min(Math.floor(seg), pts.length - 2)
        const st = seg - si
        return {
          x: pts[si].x + (pts[si + 1].x - pts[si].x) * st,
          y: pts[si].y + (pts[si + 1].y - pts[si].y) * st,
        }
      }

      heroCrawlers = heroCrawlers.filter(c => {
        c.t += c.speed * c.dir
        if (c.t > 1 || c.t < 0) { spawnHeroCrawler(); return false }

        const { tr, col, tailSteps, stepBack, dir } = c
        const { pts } = tr

        // Draw tail — steps behind the head, each smaller and dimmer
        for (let j = tailSteps; j >= 1; j--) {
          const tBack = c.t - dir * j * stepBack
          const pos = sampleTrace(pts, tBack)
          const frac = 1 - j / tailSteps
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 3.5 * frac + 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col},${frac * 0.45})`
          ctx.fill()
        }

        // Draw head
        const head = sampleTrace(pts, c.t)
        ctx.beginPath()
        ctx.arc(head.x, head.y, 5, 0, Math.PI * 2)
        ctx.shadowBlur = 26
        ctx.shadowColor = `rgba(${col},1)`
        ctx.fillStyle = `rgba(${col},1)`
        ctx.fill()
        // Outer halo ring
        ctx.beginPath()
        ctx.arc(head.x, head.y, 10, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${col},0.28)`
        ctx.lineWidth = 1.8
        ctx.stroke()
        ctx.shadowBlur = 0

        return true
      })

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="circuit-board-canvas" aria-hidden="true" />
})

const ConstellationArt = memo(function ConstellationArt({ card }) {
  return (
    <div className={`constellation-art ${card.id}`} style={card.motion} aria-hidden="true">
      <div className="galaxy-core"></div>
      <svg viewBox="0 0 100 100" role="presentation" focusable="false">
        <path className="constellation-line" d={card.path} />
        {card.points.map(([x, y], index) => (
          <circle
            className="constellation-star"
            cx={x}
            cy={y}
            r={index % 3 === 0 ? 1.55 : 1.1}
            key={`${x}-${y}`}
            style={{ '--star-index': index }}
          />
        ))}
      </svg>
    </div>
  )
})

// Shared flip-card shell. Keep section-specific differences in card data and page-scoped CSS.
const FlipCard = memo(function FlipCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [backNumber, backHeading] = card.backTitle.split('. ')

  function toggleCard() {
    setIsFlipped((currentState) => !currentState)
  }

  return (
    <article
      className={`flip-card${isFlipped ? ' is-flipped' : ''}`}
      data-card-id={card.id}
      tabIndex="0"
      role="button"
      aria-pressed={isFlipped}
      onClick={toggleCard}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return

        event.preventDefault()
        toggleCard()
      }}
    >
      <div className="flip-card-inner">
        <div className="flip-face flip-front">
          <ConstellationArt card={card} />
        </div>
        <div className="flip-face flip-back">
          <div className="back-card-copy">
            <span className="back-card-number">{backNumber}</span>
            <span className="back-card-signal material-symbols-outlined" aria-hidden="true">
              {card.backIcon || 'table_chart'}
            </span>
            <h3>{backHeading}</h3>
            <p>{card.backBody}</p>
            {card.backItems.length > 0 && (
              <ul>
                {card.backItems.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {card.backFooter && <span className="back-card-footer">{card.backFooter}</span>}
          <span className="face-label">back</span>
        </div>
      </div>
    </article>
  )
})

const NEON_LABELS = [
  'UKG | Overtime', 'UKG | Schedules', 'UKG | Time-In/Time-Out',
  'UKG | HR Cases', 'UKG | Recruitment Data', 'UKG | Employment Data',
  'UKG | Recruitment Candidate Data', 'InContact Phone Data', 'QA Data',
  'Power BI Dashboards', 'Azure SQL Server', 'Custom Web Development',
  'Python Automation', 'ETL Pipelines', 'Data Validation',
  'SalesForce Data', 'Client Data', 'Machine Learning',
  'AI Insights', 'UKG | Coaching', 'Employee Birthday Greetings Automation',
  'JIRA | IT Ticket Tracking', 'JIRA | BI Tickets Tracking',
  'DocuPlanner', 'SharePoint Integration',
]

const NEON_COLORS = [
  { hex: '#00e5ff', rgb: '0,229,255' },
  { hex: '#ff3cac', rgb: '255,60,172' },
  { hex: '#b44fff', rgb: '180,79,255' },
  { hex: '#39ff14', rgb: '57,255,20' },
  { hex: '#ff9500', rgb: '255,149,0' },
  { hex: '#5b8cff', rgb: '91,140,255' },
]

// Text block sits at top:37%, x:20–80%, y:18–54% — pills are kept outside that zone.
// 5 safe zones × 5 pills each = 25 pills total.
const neonPills = NEON_LABELS.map((label, i) => {
  const zone = i % 5          // which safe zone
  const slot = Math.floor(i / 5) // 0–4 position within that zone
  const jx = Math.sin(i * 2.718) * 2.0
  const jy = Math.cos(i * 1.618) * 2.0

  let x, y
  if (zone === 0) {
    // Left strip — x: 2–14%, full height
    x = 2 + (slot % 3) * 4 + jx
    y = 7 + slot * 17 + jy
  } else if (zone === 1) {
    // Right strip — x: 83–92%, full height
    x = 83 + (slot % 3) * 3 + jx
    y = 11 + slot * 17 + jy
  } else if (zone === 2) {
    // Top strip — x: 22–74%, y: 3–13%
    x = 22 + slot * 13 + jx
    y = 4 + (slot % 2) * 6 + jy
  } else if (zone === 3) {
    // Bottom-left — x: 3–43%, y: 59–87%
    x = 3 + slot * 9 + jx
    y = 60 + (slot % 3) * 10 + jy
  } else {
    // Bottom-right — x: 52–76%, y: 59–87%
    x = 52 + slot * 6 + jx
    y = 62 + (slot % 3) * 9 + jy
  }

  return {
    id: i,
    label,
    homeX: x,
    homeY: y,
    color: NEON_COLORS[i % NEON_COLORS.length],
    dur: `${9 + (i % 9) * 1.4}s`,
    delay: `${(i % 13) * -1.15}s`,
    flickerDur: `${5 + (i % 7) * 0.9}s`,
    flickerDelay: `${(i % 11) * -0.8}s`,
    dx: `${Math.sin(i * 1.31) * 10 + 4}px`,
    dy: `${Math.cos(i * 0.91) * 8 + 3}px`,
  }
})

const PILL_EDGE_PADDING = 24
const PILL_COLLISION_GAP = 18
const PILL_MOTION_PADDING = 18

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function toCollisionRect(left, top, width, height) {
  return {
    left: left - PILL_COLLISION_GAP - PILL_MOTION_PADDING,
    top: top - PILL_COLLISION_GAP - PILL_MOTION_PADDING,
    right: left + width + PILL_COLLISION_GAP + PILL_MOTION_PADDING,
    bottom: top + height + PILL_COLLISION_GAP + PILL_MOTION_PADDING,
  }
}

function getPillAvoidRects(width, height) {
  return [
    {
      left: width * 0.25,
      top: height * 0.2,
      right: width * 0.75,
      bottom: height * 0.52,
    },
    {
      left: width * 0.28,
      top: height * 0.9,
      right: width * 0.72,
      bottom: height,
    },
  ]
}

function createPillCandidatePoints(width, height, pillWidth, pillHeight) {
  const xLimit = Math.max(PILL_EDGE_PADDING, width - pillWidth - PILL_EDGE_PADDING)
  const yLimit = Math.max(PILL_EDGE_PADDING, height - pillHeight - PILL_EDGE_PADDING)
  const points = []
  const zones = [
    { xs: [2, 7, 12], ys: [7, 22, 37, 52, 67, 82] },
    { xs: [82, 87, 92], ys: [9, 24, 39, 54, 69, 84] },
    { xs: [20, 33, 46, 59, 72], ys: [4, 11] },
    { xs: [3, 15, 27, 39], ys: [60, 72, 84] },
    { xs: [52, 64, 76, 86], ys: [60, 72, 84] },
  ]

  zones.forEach((zone) => {
    zone.ys.forEach((yPercent) => {
      zone.xs.forEach((xPercent) => {
        points.push({
          left: clampNumber((width * xPercent) / 100, PILL_EDGE_PADDING, xLimit),
          top: clampNumber((height * yPercent) / 100, PILL_EDGE_PADDING, yLimit),
        })
      })
    })
  })

  const stepX = Math.max(pillWidth + (PILL_COLLISION_GAP + PILL_MOTION_PADDING) * 2, 112)
  const stepY = Math.max(pillHeight + (PILL_COLLISION_GAP + PILL_MOTION_PADDING) * 2, 58)
  for (let top = PILL_EDGE_PADDING; top <= yLimit; top += stepY) {
    for (let left = PILL_EDGE_PADDING; left <= xLimit; left += stepX) {
      points.push({
        left,
        top,
      })
    }
  }

  return points.map((point) => ({
    left: clampNumber(point.left, PILL_EDGE_PADDING, xLimit),
    top: clampNumber(point.top, PILL_EDGE_PADDING, yLimit),
  }))
}

function calculatePillLayout(pills, pillSizes, width, height) {
  const avoidRects = getPillAvoidRects(width, height)
  const placedRects = []
  const candidateCache = new Map()

  return pills.map((pill) => {
    const size = pillSizes[pill.id] || { width: 140, height: 28 }
    const xLimit = Math.max(PILL_EDGE_PADDING, width - size.width - PILL_EDGE_PADDING)
    const yLimit = Math.max(PILL_EDGE_PADDING, height - size.height - PILL_EDGE_PADDING)
    const home = {
      left: clampNumber((width * pill.homeX) / 100, PILL_EDGE_PADDING, xLimit),
      top: clampNumber((height * pill.homeY) / 100, PILL_EDGE_PADDING, yLimit),
    }
    const cacheKey = `${Math.round(size.width)}:${Math.round(size.height)}`
    const pool = candidateCache.get(cacheKey) || createPillCandidatePoints(width, height, size.width, size.height)
    candidateCache.set(cacheKey, pool)

    const candidates = [home, ...pool]
      .map((candidate) => ({
        ...candidate,
        score: Math.hypot(candidate.left - home.left, candidate.top - home.top),
      }))
      .sort((a, b) => a.score - b.score)

    const selected =
      candidates.find((candidate) => {
        const rect = toCollisionRect(candidate.left, candidate.top, size.width, size.height)
        return !avoidRects.some((avoidRect) => rectsOverlap(rect, avoidRect)) &&
          !placedRects.some((placedRect) => rectsOverlap(rect, placedRect))
      }) || home

    placedRects.push(toCollisionRect(selected.left, selected.top, size.width, size.height))

    return {
      left: selected.left,
      top: selected.top,
    }
  })
}

function NeonPillLayer({ pills }) {
  const layerRef = useRef(null)
  const pillRefs = useRef([])
  const [positions, setPositions] = useState([])

  useLayoutEffect(() => {
    const layer = layerRef.current
    if (!layer) return undefined

    function updateLayout() {
      const { width, height } = layer.getBoundingClientRect()
      if (!width || !height) return

      const pillSizes = pillRefs.current.map((pillElement) => {
        if (!pillElement) return { width: 140, height: 28 }

        const rect = pillElement.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      })

      setPositions(calculatePillLayout(pills, pillSizes, width, height))
    }

    updateLayout()

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(layer)

    return () => {
      resizeObserver.disconnect()
    }
  }, [pills])

  return (
    <div className="neon-pill-layer" ref={layerRef} aria-hidden="true">
      {pills.map((pill, index) => {
        const position = positions[index]

        return (
          <span
            key={pill.id}
            ref={(pillElement) => { pillRefs.current[index] = pillElement }}
            className="neon-pill"
            style={{
              left: position ? `${position.left}px` : `${pill.homeX}%`,
              top: position ? `${position.top}px` : `${pill.homeY}%`,
              color: pill.color.hex,
              borderColor: pill.color.hex,
              '--pill-dur': pill.dur,
              '--pill-delay': pill.delay,
              '--pill-flicker-dur': pill.flickerDur,
              '--pill-flicker-delay': pill.flickerDelay,
              '--pill-dx': pill.dx,
              '--pill-dy': pill.dy,
              boxShadow: `0 0 5px ${pill.color.hex}, 0 0 16px rgba(${pill.color.rgb},0.58), 0 0 32px rgba(${pill.color.rgb},0.28), inset 0 0 10px rgba(${pill.color.rgb},0.06)`,
              visibility: positions.length === pills.length ? 'visible' : 'hidden',
            }}
          >
            {pill.label}
          </span>
        )
      })}
    </div>
  )
}

const starfieldDots = Array.from({ length: 320 }, (_, i) => ({
  id: `sf-${i}`,
  x: (i * 41.3 + (i % 17) * 9.8) % 100,
  y: (i * 67.1 + (i % 13) * 5.4) % 100,
  size: i % 29 === 0 ? 2.6 : i % 11 === 0 ? 1.7 : i % 4 === 0 ? 1.1 : 0.55,
  tone: i % 9 === 0 ? 'cyan' : i % 15 === 0 ? 'pink' : 'white',
  delay: `${(i % 37) * -0.55}s`,
  duration: `${7 + (i % 19) * 1.8}s`,
}))

const backgroundStars = Array.from({ length: 180 }, (_, index) => ({
  id: `bg-star-${index}`,
  x: (index * 29.7 + (index % 11) * 7.3) % 100,
  y: (index * 53.1 + (index % 13) * 4.9) % 100,
  size: index % 17 === 0 ? 2.35 : index % 7 === 0 ? 1.6 : index % 3 === 0 ? 1.1 : 0.72,
  tone: index % 9 === 0 ? 'cyan' : index % 11 === 0 ? 'pink' : 'white',
  delay: `${(index % 23) * -0.75}s`,
  duration: `${9 + (index % 13) * 1.9}s`,
}))

function RandomStars() {
  return (
    <div className="random-stars" aria-hidden="true">
      {backgroundStars.map((star) => (
        <span
          className={`random-star ${star.tone}`}
          key={star.id}
          style={{
            '--star-x': `${star.x}%`,
            '--star-y': `${star.y}%`,
            '--star-size': `${star.size}px`,
            '--star-delay': star.delay,
            '--star-duration': star.duration,
          }}
        ></span>
      ))}
    </div>
  )
}


function OpeningGlobe() {
  const globeRef = useRef(null)

  useEffect(() => {
    const root = am5.Root.new(globeRef.current)

    root.setThemes([am5themesAnimated.new(root)])
    root._logo?.dispose()

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoOrthographic(),
        panX: 'none',
        panY: 'none',
        wheelX: 'none',
        wheelY: 'none',
        pinchZoom: false,
        rotationX: -36,
        rotationY: -8,
        maxZoomLevel: 1,
        minZoomLevel: 1,
        homeGeoPoint: { longitude: 0, latitude: 0 },
      }),
    )

    chart.series.push(
      am5map.GraticuleSeries.new(root, {
        step: 10,
        stroke: am5.color(0x2dcfe4),
      }),
    ).mapLines.template.setAll({
      strokeOpacity: 0.08,
      strokeWidth: 0.55,
    })

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodataWorldLow,
        exclude: ['AQ'],
      }),
    )

    polygonSeries.mapPolygons.template.setAll({
      interactive: false,
      fill: am5.color(0x071526),
      stroke: am5.color(0x1c91a8),
      fillOpacity: 0.9,
      strokeOpacity: 0.42,
      strokeWidth: 0.72,
    })

    polygonSeries.events.on('datavalidated', () => {
      polygonSeries.mapPolygons.each((polygon) => {
        const dataItem = polygon.dataItem
        const index = polygonSeries.dataItems.indexOf(dataItem)
        polygon.set('fill', am5.color(index % 2 === 0 ? 0x071526 : 0x091a2c))
      })
    })

    const networkNodes = [
      { title: 'Manila',           coordinates: [120.9842,  14.5995], color: 0x00e5ff },
      { title: 'Singapore',        coordinates: [103.8198,   1.3521], color: 0xeafcff },
      { title: 'Tokyo',            coordinates: [139.6917,  35.6895], color: 0x5b8cff },
      { title: 'Dubai',            coordinates: [ 55.2708,  25.2048], color: 0xa78bff },
      { title: 'London',           coordinates: [ -0.1276,  51.5072], color: 0xeafcff },
      { title: 'New York',         coordinates: [-74.0060,  40.7128], color: 0x00e5ff },
      { title: 'Sydney',           coordinates: [151.2093, -33.8688], color: 0x5b8cff },
      { title: 'Kuala Lumpur',     coordinates: [101.6869,   3.1390], color: 0xa78bff },
      { title: 'Bangkok',          coordinates: [100.5018,  13.7563], color: 0x00e5ff },
      { title: 'Ho Chi Minh City', coordinates: [106.6297,  10.8231], color: 0xeafcff },
      { title: 'Jakarta',          coordinates: [106.8456,  -6.2088], color: 0x5b8cff },
      { title: 'Cebu',             coordinates: [123.8854,  10.3157], color: 0xa78bff },
      { title: 'Davao',            coordinates: [125.6128,   7.0707], color: 0x00e5ff },
      { title: 'Paris',            coordinates: [  2.3522,  48.8566], color: 0xeafcff },
      { title: 'Mumbai',           coordinates: [ 72.8777,  19.0760], color: 0x5b8cff },
      { title: 'São Paulo',        coordinates: [-46.6333, -23.5505], color: 0xa78bff },
      { title: 'Lagos',            coordinates: [  3.3792,   6.5244], color: 0x00e5ff },
      { title: 'Riyadh',           coordinates: [ 46.6753,  24.7136], color: 0xeafcff },
      { title: 'Beijing',          coordinates: [116.4074,  39.9042], color: 0x5b8cff },
      { title: 'Toronto',          coordinates: [-79.3832,  43.6532], color: 0xa78bff },
      { title: 'Seoul',            coordinates: [126.9780,  37.5665], color: 0x00e5ff },
    ]

    const networkLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}))

    networkLineSeries.mapLines.template.setAll({
      interactive: false,
      stroke: am5.color(0x00e5ff),
      strokeOpacity: 0.74,
      strokeWidth: 1.2,
      strokeDasharray: [1000, 1000],
      strokeDashoffset: 1000,
    })

    networkLineSeries.data.setAll(
      networkNodes.slice(1).map((node) => ({
        geometry: {
          type: 'LineString',
          coordinates: [networkNodes[0].coordinates, node.coordinates],
        },
      })),
    )

    networkLineSeries.events.on('datavalidated', () => {
      let i = 0
      networkLineSeries.mapLines.each((line) => {
        line.animate({
          key: 'strokeDashoffset',
          from: 1000,
          to: 0,
          duration: 9000,
          loops: Infinity,
          easing: am5.ease.linear,
          delay: i * 500,
        })
        i++
      })
    })

    const networkPointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}))

    networkPointSeries.bullets.push((root, _series, dataItem) => {
      const color = am5.color(dataItem.dataContext.color)
      const node = am5.Container.new(root, {
        interactive: false,
      })

      const pulse = node.children.push(
        am5.Circle.new(root, {
          radius: 11,
          fill: color,
          fillOpacity: 0.16,
          stroke: color,
          strokeOpacity: 0.52,
          strokeWidth: 1,
        }),
      )

      node.children.push(
        am5.Circle.new(root, {
          radius: 3.2,
          fill: color,
          fillOpacity: 1,
          stroke: am5.color(0xffffff),
          strokeOpacity: 0.84,
          strokeWidth: 1.4,
        }),
      )

      pulse.animate({
        key: 'scale',
        from: 0.72,
        to: 1.55,
        duration: 2600,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.cubic),
      })

      pulse.animate({
        key: 'opacity',
        from: 0.82,
        to: 0.05,
        duration: 2600,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.cubic),
      })

      return am5.Bullet.new(root, {
        sprite: node,
      })
    })

    networkPointSeries.data.setAll(
      networkNodes.map((node) => ({
        title: node.title,
        color: node.color,
        geometry: {
          type: 'Point',
          coordinates: node.coordinates,
        },
      })),
    )

    const rotation = chart.animate({
      key: 'rotationX',
      from: chart.get('rotationX'),
      to: chart.get('rotationX') + 360,
      duration: 70000,
      loops: Infinity,
      easing: am5.ease.linear,
    })

    chart.appear(1200, 120)
    polygonSeries.appear(1000, 120)

    return () => {
      rotation.stop()
      root.dispose()
    }
  }, [])

  return (
    <div className="opening-globe-wrap">
      <div ref={globeRef} className="opening-globe" aria-label="Rotating global network globe" />
    </div>
  )
}

function App() {
  const canvasRef = useRef(null)
  const sectionRefs = useRef([])
  const titleRef = useRef(null)
  const copyRef = useRef(null)
  const deliveredRef = useRef(null)
  const secretSauceRef = useRef(null)
  const heroRef = useRef(null)
  const [isIntroOffWhite, setIsIntroOffWhite] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const state = {
      rotation: 0,
      orbit: 0,
      tilt: -0.1,
      pulse: 0,
    }
    let width = 0
    let height = 0
    let radius = 0
    let centerX = 0
    let centerY = 0
    let animationFrame = 0
    let stars = []
    let crawlers = []
    const startedAt = performance.now()

    const nodeCount = 92
    const nodes = Array.from({ length: nodeCount }, (_, index) => {
      const y = 1 - (index / (nodeCount - 1)) * 2
      const ring = Math.sqrt(1 - y * y)
      const phi = index * 2.399963229728653

      return {
        x: Math.cos(phi) * ring,
        y,
        z: Math.sin(phi) * ring,
        weight: 0.55 + ((index * 37) % 100) / 180,
      }
    })

    const links = nodes.flatMap((node, index) =>
      nodes
        .slice(index + 1)
        .map((target, offset) => ({ a: index, b: index + offset + 1, distance: distance3d(node, target) }))
        .filter((link) => link.distance < 0.44)
        .slice(0, 3),
    )

    function distance3d(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    }

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      centerX = width / 2
      centerY = height * (width < 720 ? 0.9 : 0.98)
      radius = Math.min(width, height) * (width < 720 ? 0.42 : 0.48)
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      stars = Array.from({ length: Math.floor(Math.max(width, height) / 10) }, (_, index) => ({
        x: ((index * 137.5) % 1000) / 1000 * width,
        y: ((index * 263.3) % 1000) / 1000 * height,
        size: 0.45 + ((index * 19) % 9) / 8,
        hue: index % 5 === 0 ? '255, 91, 205' : index % 3 === 0 ? '0, 229, 255' : '236, 244, 255',
        alpha: 0.18 + ((index * 23) % 70) / 100,
      }))
      crawlers = Array.from({ length: 42 }, (_, index) => ({
        linkIndex: (index * 7) % links.length,
        offset: ((index * 37) % 100) / 100,
        speed: 0.16 + ((index * 17) % 100) / 260,
        color: index % 4 === 0 ? '0, 245, 255' : index % 4 === 1 ? '255, 43, 214' : index % 4 === 2 ? '104, 92, 255' : '245, 252, 255',
        size: 2.4 + ((index * 11) % 8) / 4,
      }))
    }

    function project(node) {
      const cosRotation = Math.cos(state.rotation)
      const sinRotation = Math.sin(state.rotation)
      const cosTilt = Math.cos(state.tilt)
      const sinTilt = Math.sin(state.tilt)

      const rotatedX = node.x * cosRotation - node.z * sinRotation
      const rotatedZ = node.x * sinRotation + node.z * cosRotation
      const tiltedY = node.y * cosTilt - rotatedZ * sinTilt
      const tiltedZ = node.y * sinTilt + rotatedZ * cosTilt
      const depth = (tiltedZ + 1) / 2
      const scale = 0.82 + depth * 0.24

      return {
        x: centerX + rotatedX * radius * scale,
        y: centerY + tiltedY * radius * scale,
        depth,
        size: node.weight * (1.2 + depth * 2.6),
      }
    }

    function drawOrbit(angle, alpha, scaleY, color, sweepOffset) {
      const sweep = Math.PI * 1.72
      const orbitRadius = radius * 1.85
      const globeMaskRadius = radius * 1.08
      const cosAngle = Math.cos(angle)
      const sinAngle = Math.sin(angle)
      const segmentSteps = 132

      function orbitPoint(theta) {
        const localX = Math.cos(theta) * orbitRadius
        const localY = Math.sin(theta) * orbitRadius * scaleY

        return {
          x: centerX + localX * cosAngle - localY * sinAngle,
          y: centerY + localX * sinAngle + localY * cosAngle,
        }
      }

      function isOutsideGlobe(point) {
        return Math.hypot(point.x - centerX, point.y - centerY) > globeMaskRadius
      }

      function traceOrbitPath(start, end, steps) {
        let drawingSegment = false

        context.beginPath()
        for (let i = 0; i <= steps; i++) {
          const point = orbitPoint(start + ((end - start) * i) / steps)

          if (!isOutsideGlobe(point)) {
            drawingSegment = false
            continue
          }

          if (!drawingSegment) {
            context.moveTo(point.x, point.y)
            drawingSegment = true
          } else {
            context.lineTo(point.x, point.y)
          }
        }
      }

      context.save()

      context.shadowBlur = 7
      context.shadowColor = color
      traceOrbitPath(state.orbit + sweepOffset, state.orbit + sweepOffset + sweep, segmentSteps)
      context.strokeStyle = color.replace('1)', `${alpha})`)
      context.lineWidth = 1
      context.lineCap = 'round'
      context.stroke()

      context.shadowBlur = 0
      traceOrbitPath(0, Math.PI * 2, segmentSteps)
      context.strokeStyle = color.replace('1)', '0.1)')
      context.setLineDash([2, 7])
      context.lineWidth = 0.5
      context.stroke()
      context.setLineDash([])
      context.restore()
    }

    function draw() {
      const elapsed = (performance.now() - startedAt) / 1000
      state.rotation = elapsed * (Math.PI * 2 / 72)
      state.orbit = elapsed * (Math.PI * 2 / 54)
      state.pulse = elapsed * (Math.PI * 2 / 3.6)

      context.clearRect(0, 0, width, height)

      stars.forEach((star) => {
        context.beginPath()
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(${star.hue}, ${star.alpha})`
        context.fill()
      })

      const projected = nodes.map(project)
      const glow = context.createRadialGradient(centerX, centerY, radius * 0.08, centerX, centerY, radius * 1.32)
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.07)')
      glow.addColorStop(0.3, 'rgba(0, 245, 255, 0.28)')
      glow.addColorStop(0.58, 'rgba(255, 43, 214, 0.17)')
      glow.addColorStop(0.78, 'rgba(104, 92, 255, 0.12)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = glow
      context.beginPath()
      context.arc(centerX, centerY, radius * 1.36, 0, Math.PI * 2)
      context.fill()

      drawOrbit(state.orbit * 0.32, 0.28, 0.18, 'rgba(0, 245, 255, 1)', 0)
      drawOrbit(0.52 + state.orbit * 0.22, 0.24, 0.46, 'rgba(255, 43, 214, 1)', Math.PI * 0.72)

      links.forEach((link) => {
        const a = projected[link.a]
        const b = projected[link.b]
        const visibility = Math.min(a.depth, b.depth)

        if (visibility < 0.2) return

        context.beginPath()
        context.moveTo(a.x, a.y)
        context.lineTo(b.x, b.y)
        context.strokeStyle = indexColor(link.a, 0.12 + visibility * 0.42)
        context.lineWidth = 0.95
        context.stroke()
      })

      projected.forEach((point, index) => {
        const flicker = Math.sin(state.pulse + index * 0.72) * 0.45 + 0.55
        const alpha = 0.36 + point.depth * 0.6
        const color = index % 4 === 0 ? '0, 245, 255' : index % 4 === 1 ? '255, 43, 214' : index % 4 === 2 ? '104, 92, 255' : '245, 252, 255'

        context.beginPath()
        context.arc(point.x, point.y, point.size * 0.82 + flicker * 0.42, 0, Math.PI * 2)
        context.shadowBlur = 8 + flicker * 5
        context.shadowColor = `rgba(${color}, 0.95)`
        context.fillStyle = `rgba(${color}, ${alpha})`
        context.fill()
        context.shadowBlur = 0
      })

      crawlers.forEach((crawler) => {
        const link = links[crawler.linkIndex]
        const a = projected[link.a]
        const b = projected[link.b]
        const visibility = Math.min(a.depth, b.depth)

        if (visibility < 0.12) return

        const progress = (crawler.offset + elapsed * crawler.speed) % 1
        const x = a.x + (b.x - a.x) * progress
        const y = a.y + (b.y - a.y) * progress
        const alpha = 0.72 + visibility * 0.26

        context.beginPath()
        context.arc(x, y, crawler.size * 1.45, 0, Math.PI * 2)
        context.shadowBlur = 10
        context.shadowColor = `rgba(${crawler.color}, 0.9)`
        context.fillStyle = `rgba(${crawler.color}, ${alpha})`
        context.fill()

        context.beginPath()
        context.arc(x, y, crawler.size * 0.56, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${0.72 + visibility * 0.24})`
        context.fill()
        context.shadowBlur = 0
      })

      animationFrame = requestAnimationFrame(draw)
    }

    function indexColor(index, alpha) {
      if (index % 3 === 0) return `rgba(0, 245, 255, ${alpha})`
      if (index % 3 === 1) return `rgba(255, 43, 214, ${alpha})`

      return `rgba(104, 92, 255, ${alpha})`
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .fromTo(canvas, { opacity: 0, scale: 0.92, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.4 })
      .fromTo(titleRef.current, { opacity: 0, y: 92, rotateX: 22 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.15 }, '-=0.55')
      .fromTo(copyRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85 }, '-=0.58')

    const deliveredTitle = deliveredRef.current.querySelector('.delivered-title')
    const deliveredCards = deliveredRef.current.querySelectorAll('.flip-card')
    const secretSauceElements = secretSauceRef.current.querySelectorAll('.delivered-title, .flip-card')
    const deliveredObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        gsap.timeline()
          .to(deliveredTitle, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          })
          .to(deliveredCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 0.95,
            stagger: 0.18,
            ease: 'power3.out',
          }, '-=0.18')
        deliveredObserver.disconnect()
      },
      { threshold: 0.28 },
    )

    gsap.set(deliveredTitle, { opacity: 0, y: 34 })
    gsap.set(deliveredCards, {
      opacity: 0,
      y: 54,
      scale: 0.94,
      rotateX: 8,
      filter: 'blur(8px)',
      transformOrigin: '50% 70%',
    })
    deliveredObserver.observe(deliveredRef.current)

    const secretSauceObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        gsap.to(secretSauceElements, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
        })
        secretSauceObserver.disconnect()
      },
      { threshold: 0.24 },
    )

    gsap.set(secretSauceElements, { opacity: 0, y: 42 })
    secretSauceObserver.observe(secretSauceRef.current)

    function handlePageKeys(event) {
      if (!['PageDown', 'PageUp'].includes(event.key)) return

      event.preventDefault()
      const currentIndex = Math.round(window.scrollY / window.innerHeight)
      const direction = event.key === 'PageDown' ? 1 : -1
      const targetIndex = Math.min(
        sectionRefs.current.length - 1,
        Math.max(0, currentIndex + direction),
      )
      const targetSection = sectionRefs.current[targetIndex]

      targetSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.addEventListener('keydown', handlePageKeys)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', handlePageKeys)
      cancelAnimationFrame(animationFrame)
      intro.kill()
      deliveredObserver.disconnect()
      secretSauceObserver.disconnect()
    }
  }, [])

  return (
    <main className="hero-shell">
      {/* Page 01 begin: starfield */}
      <section
        id={PAGE_IDS.starfield}
        data-page-id={PAGE_IDS.starfield}
        ref={(section) => { sectionRefs.current[0] = section }}
        className="blank-section page-starfield"
        aria-label="Star field opening"
      >
        {starfieldDots.map((dot) => (
          <span
            key={dot.id}
            className={`sf-dot ${dot.tone}`}
            style={{
              '--sf-x': `${dot.x}%`,
              '--sf-y': `${dot.y}%`,
              '--sf-size': `${dot.size}px`,
              '--sf-delay': dot.delay,
              '--sf-dur': dot.duration,
            }}
          />
        ))}
        <CircuitBoardCanvas />
        <div className="starfield-hero-text">
          <p className="starfield-hero-title">
            <span>DME</span>
            <span>DataVerse</span>
          </p>
          <p className="starfield-hero-sub">Secured | Scalable | Reliable</p>
        </div>
        <p className="starfield-footer">DME-BI | Delivering Meaningful Experience</p>
        <NeonPillLayer pills={neonPills} />
      </section>
      {/* Page 01 end: starfield */}

      {/* Page 02 begin: intro */}
      <section
        id={PAGE_IDS.intro}
        data-page-id={PAGE_IDS.intro}
        ref={(section) => {
          sectionRefs.current[1] = section
          heroRef.current = section
        }}
        className={`welcome-hero page-intro${isIntroOffWhite ? ' is-off-white' : ''}`}
        aria-labelledby="welcome-title"
      >
        <button
          className="intro-theme-toggle"
          type="button"
          aria-pressed={isIntroOffWhite}
          onClick={() => setIsIntroOffWhite((currentState) => !currentState)}
        >
          {isIntroOffWhite ? 'Dark' : 'Off-white'}
        </button>
        <div className="hero-grid" aria-hidden="true"></div>
        <div className="hero-glow" aria-hidden="true"></div>
        <canvas ref={canvasRef} className="data-globe" aria-hidden="true"></canvas>

        <div className="hero-content">
          <p className="hero-kicker">DME-BI | Delivering Meaningful Experience</p>
          <h1 ref={titleRef} id="welcome-title">
            <span>Your dream tonight.</span>
            <span className="title-gradient">Our delivery tomorrow.</span>
          </h1>
          <div className="hero-rule" aria-hidden="true"></div>
          <p ref={copyRef} className="hero-copy">
            Modernizing reporting, analytics, and business intelligence through
            centralized data foundations, automation, and AI-ready solutions.
          </p>
        </div>
      </section>
      {/* Page 02 end: intro */}

      {/* Page 03 begin: what we've delivered */}
      <section
        id={PAGE_IDS.delivered}
        data-page-id={PAGE_IDS.delivered}
        ref={(section) => {
          sectionRefs.current[2] = section
          deliveredRef.current = section
        }}
        className="delivered-section delivered-cards-section page-delivered"
        aria-labelledby="delivered-title"
      >
        <RandomStars />
        <div className="delivered-inner">
          <h2 id="delivered-title" className="delivered-title">What we've delivered</h2>

          <div className="flip-card-grid">
            {deliveredCards.map((card) => (
              <FlipCard card={card} key={card.id} />
            ))}
          </div>

          <p className="slide-footer-mark">DME-BI | Delivering Meaningful Experience</p>
        </div>
      </section>
      {/* Page 03 end: what we've delivered */}

      {/* Page 04 begin: secret sauce */}
      <section
        id={PAGE_IDS.secretSauce}
        data-page-id={PAGE_IDS.secretSauce}
        ref={(section) => {
          sectionRefs.current[3] = section
          secretSauceRef.current = section
        }}
        className="delivered-section secret-sauce-section page-secret-sauce"
        aria-labelledby="secret-sauce-title"
      >
        <RandomStars />
        <div className="delivered-inner">
          <h2 id="secret-sauce-title" className="delivered-title secret-sauce-title">
            <span>The <span className="secret-sauce-gradient">Secret Sauce</span></span>
            <span>we are building steadily</span>
          </h2>

          <div className="flip-card-grid secret-card-grid">
            {secretSauceCards.map((card) => (
              <FlipCard card={card} key={card.id} />
            ))}
          </div>

          <p className="slide-footer-mark">DME-BI | Delivering Meaningful Experience</p>
        </div>
      </section>
      {/* Page 04 end: secret sauce */}

      {/* Page 05 begin: commitment */}
      <section
        id={PAGE_IDS.commitment}
        data-page-id={PAGE_IDS.commitment}
        ref={(section) => {
          sectionRefs.current[4] = section
        }}
        className="title-section page-commitment"
        aria-labelledby="commitment-title"
      >
        <RandomStars />
        <div className="commitment-inner">
          <div className="commitment-left">
            <h2 id="commitment-title">
              <span>Our </span>
              <span className="commitment-title-gradient">Commitment</span>
            </h2>
            <div className="commitment-cards" role="list">
            <article className="commitment-card commitment-card--cyan" role="listitem">
              <div className="commitment-card-header">
                <span className="commitment-card-number" aria-label="Priority one">01</span>
                <div className="commitment-card-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">storage</span>
                </div>
              </div>
              <div className="commitment-card-body">
                <h3>Strengthen Azure SQL as the core data layer.</h3>
                <p>Continue moving key datasets into Azure SQL to reduce dependency on manual Excel files and disconnected reporting processes.</p>
              </div>
            </article>
            <article className="commitment-card commitment-card--amber" role="listitem">
              <div className="commitment-card-header">
                <span className="commitment-card-number" aria-label="Priority two">02</span>
                <div className="commitment-card-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">bar_chart</span>
                </div>
              </div>
              <div className="commitment-card-body">
                <h3>Expand Power BI reporting.</h3>
                <p>Build more standardized dashboards across operations, workforce, billing, service performance, and leadership reporting.</p>
              </div>
            </article>
            <article className="commitment-card commitment-card--violet" role="listitem">
              <div className="commitment-card-header">
                <span className="commitment-card-number" aria-label="Priority three">03</span>
                <div className="commitment-card-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">web_asset</span>
                </div>
              </div>
              <div className="commitment-card-body">
                <h3>Build more custom web tools.</h3>
                <p>Focused internal applications for the workflows that need them most — entry, approval, validation, status, and direct business-user interaction.</p>
              </div>
            </article>
            <article className="commitment-card commitment-card--rose" role="listitem">
              <div className="commitment-card-header">
                <span className="commitment-card-number" aria-label="Priority four">04</span>
                <div className="commitment-card-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
              </div>
              <div className="commitment-card-body">
                <h3>Prepare for Machine Learning.</h3>
                <p>Identify business cases where ML can support forecasting, anomaly detection, prioritization, and operational recommendations.</p>
              </div>
            </article>
          </div>
          </div>
          <div className="commitment-right-panel" aria-hidden="true">
            <CommitmentNetworkCanvas />
          </div>
          <p className="slide-footer-mark">DME-BI | Delivering Meaningful Experience</p>
        </div>
      </section>
      {/* Page 05 end: commitment */}

      {/* Page 06 begin: what we need */}
      <section
        id={PAGE_IDS.needs}
        data-page-id={PAGE_IDS.needs}
        ref={(section) => {
          sectionRefs.current[5] = section
        }}
        className="title-section page-needs"
        aria-labelledby="need-title"
      >
        <RandomStars />
        <div className="needs-inner">
          <div className="needs-left">
            <h2 id="need-title">What we need</h2>
            <div className="needs-grid">
              <article className="need-card need-card--yellow">
                <span className="need-card-number">01</span>
                <div className="need-card-title">
                  <h3>Data Engineer – ML Specialization</h3>
                </div>
                <p>Our Azure SQL foundation is in place, but turning data into predictions requires a dedicated engineer who lives at the intersection of pipelines and models. We need someone who can build and maintain ML-ready datasets, own the feature engineering layer, deploy forecasting models into production, and ensure our data infrastructure scales alongside the intelligence we are building on top of it.</p>
              </article>
              <article className="need-card need-card--green">
                <span className="need-card-number">02</span>
                <div className="need-card-title">
                  <h3>Reserved Monthly Budget of $500</h3>
                </div>
                <p>We are requesting a $500 monthly strategic reserve to support timely execution as DME-BI continues to mature. This is not tied to a single project. Instead, it provides flexibility to act quickly when high-value opportunities or operational blockers arise, such as enabling a needed tool, securing API credits, or activating a cloud service that improves efficiency.</p>
              </article>
              <article className="need-card need-card--pink">
                <span className="need-card-number">03</span>
                <div className="need-card-title">
                  <h3>Better Laptops</h3>
                </div>
                <p></p>
              </article>
            </div>
          </div>
          <div className="needs-right-panel" aria-hidden="true">
            <CommitmentNetworkCanvas />
          </div>
          <p className="slide-footer-mark">DME-BI | Delivering Meaningful Experience</p>
        </div>
      </section>
      {/* Page 06 end: what we need */}

      {/* Page 07 begin: thank you */}
      <section
        id={PAGE_IDS.thankYou}
        data-page-id={PAGE_IDS.thankYou}
        ref={(section) => {
          sectionRefs.current[6] = section
        }}
        className="title-section page-thank-you"
        aria-labelledby="thank-you-title"
      >
        <RandomStars />
        <div className="thank-you-copy">
          <h2 id="thank-you-title">Thank you.</h2>
          <p>DME-BI | Delivering Meaningful Experience</p>
        </div>
      </section>
      {/* Page 07 end: thank you */}

      {/* Page 08 begin: TLDR */}
      <section
        id={PAGE_IDS.tldr}
        data-page-id={PAGE_IDS.tldr}
        ref={(section) => {
          sectionRefs.current[7] = section
        }}
        className="tldr-section page-tldr"
        aria-labelledby="tldr-title"
      >
        <h2 id="tldr-title">TLDR;</h2>
        <div className="tldr-column-grid" aria-label="TLDR summary columns">
          {tldrColumns.map((column, index) => (
            <article className={`tldr-column tldr-column--${column.id}`} key={column.id}>
              <div className="tldr-column-header">
                <div className="tldr-column-header-top">
                  <span className="tldr-column-number">{String.fromCharCode(65 + index) + '.'}</span>
                  <span className="material-symbols-outlined tldr-column-icon" aria-hidden="true">
                    {column.icon}
                  </span>
                </div>
                <h3>
                  {(Array.isArray(column.title) ? column.title : [column.title]).map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
              </div>
              <table className="tldr-column-table" aria-label={`${column.title} summary table`}>
                <tbody>
                  {Array.from({ length: 5 }, (_, rowIndex) => (
                    <tr
                      className={(column.id === 'needs' && [2, 3].includes(rowIndex)) || (column.id === 'delivered' && rowIndex === 4) ? 'is-muted-row' : undefined}
                      key={rowIndex}
                    >
                      <td>
                        {(Array.isArray(column.tableRows[rowIndex])
                          ? column.tableRows[rowIndex]
                          : [column.tableRows[rowIndex] || rowIndex + 1]
                        ).map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <footer className="tldr-column-footer">{column.footer}</footer>
            </article>
          ))}
        </div>
      </section>
      {/* Page 08 end: TLDR */}

      {/* Page 09 begin: closing globe */}
      <section
        id={PAGE_IDS.opening}
        data-page-id={PAGE_IDS.opening}
        ref={(section) => {
          sectionRefs.current[8] = section
        }}
        className="blank-section page-opening-globe"
        aria-label="Closing global network page"
      >
        <RandomStars />
        <OpeningGlobe />
        <div className="globe-vignette" aria-hidden="true" />
        <div className="globe-hero-text">
          <p className="globe-tagline">REAL-TIME • GLOBAL • CONNECTED</p>
          <p className="globe-sub-tagline">Secure • Scalable • Intelligent</p>
          <button className="globe-scroll-btn" aria-label="Closing section indicator">
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </section>
      {/* Page 09 end: closing globe */}
    </main>
  )
}

export default App
