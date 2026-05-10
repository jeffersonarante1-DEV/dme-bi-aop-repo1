import { memo, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import * as am5 from '@amcharts/amcharts5'
import * as am5map from '@amcharts/amcharts5/map'
import am5geodataWorldLow from '@amcharts/amcharts5-geodata/worldLow.js'
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated'
import './App.css'

// Stable page IDs keep scroll targets, CSS scopes, and future navigation isolated per slide.
const PAGE_IDS = Object.freeze({
  opening: 'page-opening-globe',
  intro: 'page-intro',
  delivered: 'page-delivered',
  secretSauce: 'page-secret-sauce',
  commitment: 'page-commitment',
  needs: 'page-needs',
  thankYou: 'page-thank-you',
})

// Page 03 card data: What we've delivered.
const deliveredCards = [
  {
    id: 'andromeda',
    label: 'andromeda',
    backTitle: '01. People Development',
    backIcon: 'groups',
    backBody:
      'DME-BI team members are now trained in Azure SQL data loading, data updates, and modern ETL processes - building internal capability alongside the platform.',
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
          <span className="constellation-name">{card.label}</span>
          <span className="face-label">front</span>
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
  const orbitCanvasRef = useRef(null)

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
        rotationX: -20,
        rotationY: -18,
        maxZoomLevel: 1,
        minZoomLevel: 1,
        homeGeoPoint: { longitude: 0, latitude: 0 },
      }),
    )

    const oceanSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}))
    oceanSeries.mapPolygons.template.setAll({
      fill: am5.color(0x000000),
      stroke: am5.color(0x000000),
      strokeOpacity: 0,
    })
    oceanSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    })

    chart.series.push(
      am5map.GraticuleSeries.new(root, {
        step: 10,
        stroke: am5.color(0x0088ff),
      }),
    ).mapLines.template.setAll({
      strokeOpacity: 0.10,
      strokeWidth: 0.5,
    })

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodataWorldLow,
        exclude: ['AQ'],
      }),
    )

    polygonSeries.mapPolygons.template.setAll({
      interactive: false,
      fill: am5.color(0x0a0e1a),
      stroke: am5.color(0x1a2a4a),
      strokeOpacity: 0.85,
      strokeWidth: 0.9,
    })

    polygonSeries.events.on('datavalidated', () => {
      polygonSeries.mapPolygons.each((polygon) => {
        const dataItem = polygon.dataItem
        const index = polygonSeries.dataItems.indexOf(dataItem)
        polygon.set('fill', am5.color(index % 2 === 0 ? 0x0a0e1a : 0x0e1525))
      })
    })

    const networkNodes = [
      { title: 'Manila',           coordinates: [120.9842,  14.5995], color: 0xffb347 },
      { title: 'Singapore',        coordinates: [103.8198,   1.3521], color: 0xffd27f },
      { title: 'Tokyo',            coordinates: [139.6917,  35.6895], color: 0xff8c00 },
      { title: 'Dubai',            coordinates: [ 55.2708,  25.2048], color: 0xffa500 },
      { title: 'London',           coordinates: [ -0.1276,  51.5072], color: 0xffcc44 },
      { title: 'New York',         coordinates: [-74.0060,  40.7128], color: 0xe8901a },
      { title: 'Sydney',           coordinates: [151.2093, -33.8688], color: 0xf5c842 },
      { title: 'Kuala Lumpur',     coordinates: [101.6869,   3.1390], color: 0xffaa33 },
      { title: 'Bangkok',          coordinates: [100.5018,  13.7563], color: 0xffb84d },
      { title: 'Ho Chi Minh City', coordinates: [106.6297,  10.8231], color: 0xffc966 },
      { title: 'Jakarta',          coordinates: [106.8456,  -6.2088], color: 0xe89520 },
      { title: 'Cebu',             coordinates: [123.8854,  10.3157], color: 0xf0a830 },
      { title: 'Davao',            coordinates: [125.6128,   7.0707], color: 0xffd060 },
      { title: 'Paris',            coordinates: [  2.3522,  48.8566], color: 0xffa040 },
      { title: 'Mumbai',           coordinates: [ 72.8777,  19.0760], color: 0xffb347 },
      { title: 'São Paulo',        coordinates: [-46.6333, -23.5505], color: 0xffd27f },
      { title: 'Lagos',            coordinates: [  3.3792,   6.5244], color: 0xff8c00 },
      { title: 'Riyadh',           coordinates: [ 46.6753,  24.7136], color: 0xffa500 },
      { title: 'Beijing',          coordinates: [116.4074,  39.9042], color: 0xffcc44 },
      { title: 'Toronto',          coordinates: [-79.3832,  43.6532], color: 0xe8901a },
      { title: 'Seoul',            coordinates: [126.9780,  37.5665], color: 0xf5c842 },
    ]

    const networkLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}))

    networkLineSeries.mapLines.template.setAll({
      interactive: false,
      stroke: am5.color(0x00e5ff),
      strokeOpacity: 0.9,
      strokeWidth: 1.6,
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
          fillOpacity: 0.12,
          stroke: color,
          strokeOpacity: 0.36,
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
          strokeWidth: 1.2,
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

    const randomPoints = Array.from({ length: 60 }, () => [
      -180 + Math.random() * 360,
        -60 + Math.random() * 140,
    ])

    const randomLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}))
    randomLineSeries.mapLines.template.setAll({
      interactive: false,
      stroke: am5.color(0x00ccff),
      strokeOpacity: 0.18,
      strokeWidth: 0.7,
      strokeDasharray: [1000, 1000],
      strokeDashoffset: 1000,
    })
    randomLineSeries.data.setAll(
      Array.from({ length: 40 }, () => {
        const a = randomPoints[Math.floor(Math.random() * randomPoints.length)]
        const b = randomPoints[Math.floor(Math.random() * randomPoints.length)]
        return { geometry: { type: 'LineString', coordinates: [a, b] } }
      }),
    )
    randomLineSeries.events.on('datavalidated', () => {
      let i = 0
      randomLineSeries.mapLines.each((line) => {
        line.animate({
          key: 'strokeDashoffset',
          from: 1000,
          to: 0,
          duration: 7000 + Math.random() * 6000,
          loops: Infinity,
          easing: am5.ease.linear,
          delay: i * 300,
        })
        i++
      })
    })

    const randomNodeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}))
    randomNodeSeries.bullets.push(() => {
      const size = 1.2 + Math.random() * 2.2
      const opacity = 0.3 + Math.random() * 0.5
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: size,
          fill: am5.color(0x00ccff),
          fillOpacity: opacity,
          strokeOpacity: 0,
        }),
      })
    })
    randomNodeSeries.data.setAll(
      Array.from({ length: 80 }, () => ({
        geometry: {
          type: 'Point',
          coordinates: [
            -180 + Math.random() * 360,
             -60 + Math.random() * 140,
          ],
        },
      })),
    )

    chart.appear(1200, 120)
    polygonSeries.appear(1000, 120)

    const oc = orbitCanvasRef.current
    const ctx = oc.getContext('2d')
    let orbitFrame = 0
    const orbitStart = performance.now()

    function resizeOrbit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = oc.parentElement.getBoundingClientRect()
      oc.width = rect.width * dpr
      oc.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawOrbit(cx, cy, r, angle, scaleY, alpha, color, sweepOffset, label) {
      const sweep = Math.PI * 1.65
      const endAngle = sweepOffset + sweep

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.scale(1, scaleY)
      ctx.beginPath()
      ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${color}, 0.12)`
      ctx.setLineDash([3, 8])
      ctx.lineWidth = 0.7
      ctx.stroke()
      ctx.setLineDash([])
      ctx.shadowBlur = 28
      ctx.shadowColor = `rgba(${color}, 1)`
      ctx.beginPath()
      ctx.ellipse(0, 0, r, r, 0, sweepOffset, endAngle)
      ctx.strokeStyle = `rgba(${color}, ${alpha})`
      ctx.lineWidth = 1.4
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.restore()

      const lx = r * Math.cos(endAngle)
      const ly = r * scaleY * Math.sin(endAngle)
      const sx = cx + lx * Math.cos(angle) - ly * Math.sin(angle)
      const sy = cy + lx * Math.sin(angle) + ly * Math.cos(angle)
      ctx.save()
      ctx.font = '500 10px "Courier New", monospace'
      ctx.letterSpacing = '0.12em'
      ctx.fillStyle = `rgba(${color}, 0.72)`
      ctx.shadowBlur = 8
      ctx.shadowColor = `rgba(${color}, 0.9)`
      ctx.fillText(label, sx + 6, sy + 4)
      ctx.shadowBlur = 0
      ctx.restore()
    }

    function animateOrbits() {
      const elapsed = (performance.now() - orbitStart) / 1000
      const orbitAngle = elapsed * (Math.PI * 2 / 54)
      const rect = oc.parentElement.getBoundingClientRect()
      const cx = rect.width / 2
      const cy = rect.height / 2
      const r = Math.min(rect.width, rect.height) * 0.62

      ctx.clearRect(0, 0, rect.width, rect.height)

      const globeR = Math.min(rect.width, rect.height) * 0.47
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, rect.width, rect.height)
      ctx.arc(cx, cy, globeR, 0, Math.PI * 2, true)
      ctx.clip('evenodd')

      drawOrbit(cx, cy, r, -0.5 - orbitAngle * 0.22,         0.26, 0.55, '0, 180, 255', Math.PI * 0.4, 'ORBIT #2')

      ctx.restore()

      orbitFrame = requestAnimationFrame(animateOrbits)
    }

    resizeOrbit()
    window.addEventListener('resize', resizeOrbit)
    animateOrbits()

    return () => {
      rotation.stop()
      root.dispose()
      cancelAnimationFrame(orbitFrame)
      window.removeEventListener('resize', resizeOrbit)
    }
  }, [])

  return (
    <div className="opening-globe-wrap">
      <div className="opening-globe-halo" aria-hidden="true" />
      <div className="opening-globe-flare" aria-hidden="true" />
      <div ref={globeRef} className="opening-globe" aria-label="Rotating global network globe" />
      <canvas ref={orbitCanvasRef} className="opening-globe-orbits" aria-hidden="true" />
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
      centerY = height * (width < 720 ? 0.42 : 0.43)
      radius = Math.min(width, height) * (width < 720 ? 0.3 : 0.315)
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

      context.save()
      context.translate(centerX, centerY)
      context.rotate(angle)
      context.scale(1, scaleY)

      context.shadowBlur = 20
      context.shadowColor = color
      context.beginPath()
      context.ellipse(0, 0, radius * 1.85, radius * 1.85, 0, state.orbit + sweepOffset, state.orbit + sweepOffset + sweep)
      context.strokeStyle = color.replace('1)', `${alpha})`)
      context.lineWidth = 1.3
      context.lineCap = 'round'
      context.stroke()

      context.shadowBlur = 0
      context.beginPath()
      context.ellipse(0, 0, radius * 1.85, radius * 1.85, 0, 0, Math.PI * 2)
      context.strokeStyle = color.replace('1)', '0.16)')
      context.setLineDash([2, 7])
      context.lineWidth = 0.7
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
      const glow = context.createRadialGradient(centerX, centerY, radius * 0.05, centerX, centerY, radius * 1.45)
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
      glow.addColorStop(0.34, 'rgba(0, 229, 255, 0.18)')
      glow.addColorStop(0.68, 'rgba(182, 91, 255, 0.12)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = glow
      context.beginPath()
      context.arc(centerX, centerY, radius * 1.46, 0, Math.PI * 2)
      context.fill()

      drawOrbit(state.orbit * 0.32, 0.38, 0.18, 'rgba(0, 229, 255, 1)', 0)
      drawOrbit(-0.48 - state.orbit * 0.26, 0.24, 0.3, 'rgba(236, 244, 255, 1)', Math.PI * 0.3)
      drawOrbit(0.52 + state.orbit * 0.22, 0.3, 0.46, 'rgba(255, 91, 205, 1)', Math.PI * 0.72)
      drawOrbit(Math.PI / 2 + state.orbit * 0.16, 0.2, 0.62, 'rgba(0, 229, 255, 1)', Math.PI * 1.1)

      links.forEach((link) => {
        const a = projected[link.a]
        const b = projected[link.b]
        const visibility = Math.min(a.depth, b.depth)

        if (visibility < 0.2) return

        context.beginPath()
        context.moveTo(a.x, a.y)
        context.lineTo(b.x, b.y)
        context.strokeStyle = indexColor(link.a, 0.06 + visibility * 0.28)
        context.lineWidth = 0.7
        context.stroke()
      })

      projected.forEach((point, index) => {
        const flicker = Math.sin(state.pulse + index * 0.72) * 0.45 + 0.55
        const alpha = 0.24 + point.depth * 0.72
        const color = index % 3 === 0 ? '0, 229, 255' : index % 3 === 1 ? '255, 43, 214' : '245, 252, 255'

        context.beginPath()
        context.arc(point.x, point.y, point.size * 0.72 + flicker * 0.55, 0, Math.PI * 2)
        context.shadowBlur = 13 + flicker * 8
        context.shadowColor = `rgba(${color}, 0.95)`
        context.fillStyle = `rgba(${color}, ${alpha})`
        context.fill()
        context.shadowBlur = 0
      })

      animationFrame = requestAnimationFrame(draw)
    }

    function indexColor(index, alpha) {
      return index % 2 === 0 ? `rgba(0, 229, 255, ${alpha})` : `rgba(255, 43, 214, ${alpha})`
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .fromTo(canvas, { opacity: 0, scale: 0.92, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.4 })
      .fromTo(titleRef.current, { opacity: 0, y: 92, rotateX: 22 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.15 }, '-=0.55')
      .fromTo(copyRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85 }, '-=0.58')

    const deliveredElements = deliveredRef.current.querySelectorAll('.delivered-title, .flip-card')
    const secretSauceElements = secretSauceRef.current.querySelectorAll('.delivered-title, .flip-card')
    const deliveredObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        gsap.to(deliveredElements, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
        })
        deliveredObserver.disconnect()
      },
      { threshold: 0.28 },
    )

    gsap.set(deliveredElements, { opacity: 0, y: 42 })
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
      {/* Page 01 begin: opening globe */}
      <section
        id={PAGE_IDS.opening}
        data-page-id={PAGE_IDS.opening}
        ref={(section) => {
          sectionRefs.current[0] = section
        }}
        className="blank-section page-opening-globe"
        aria-label="Blank opening page"
      >
        <RandomStars />
        <OpeningGlobe />
        <div className="globe-vignette" aria-hidden="true" />
        <div className="globe-hero-text">
          <p className="globe-tagline">REAL-TIME • GLOBAL • CONNECTED</p>
          <p className="globe-sub-tagline">Secure • Scalable • Intelligent</p>
          <button className="globe-scroll-btn" aria-label="Scroll to next section">
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </section>
      {/* Page 01 end: opening globe */}

      {/* Page 02 begin: intro */}
      <section
        id={PAGE_IDS.intro}
        data-page-id={PAGE_IDS.intro}
        ref={(section) => {
          sectionRefs.current[1] = section
          heroRef.current = section
        }}
        className="welcome-hero page-intro"
        aria-labelledby="welcome-title"
      >
        <div className="hero-grid" aria-hidden="true"></div>
        <div className="hero-glow" aria-hidden="true"></div>
        <canvas ref={canvasRef} className="data-globe" aria-hidden="true"></canvas>

        <div className="hero-content">
          <h1 ref={titleRef} id="welcome-title">
            <span>Centralized</span>
            <span className="title-gradient">Transformation</span>
            <span>Ecosystem.</span>
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
            <span>The Secret Sauce</span>
            <span>we are building steadily</span>
          </h2>

          <div className="flip-card-grid secret-card-grid">
            {secretSauceCards.map((card) => (
              <FlipCard card={card} key={card.id} />
            ))}
          </div>
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
            <h2 id="commitment-title">The commitment</h2>
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
        <h2 id="thank-you-title">Thank you.</h2>
      </section>
      {/* Page 07 end: thank you */}
    </main>
  )
}

export default App
