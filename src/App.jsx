import { useState, useRef, useEffect, useMemo } from 'react'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lt_data')
    return saved
      ? JSON.parse(saved)
      : [
          { name: '日语', color: '#3B82F6', records: [], done: false },
          { name: '韩语', color: '#22C55E', records: [], done: false },
          { name: '阅读', color: '#EAB308', records: [], done: false },
          { name: '健身', color: '#EF4444', records: [], done: false },
        ]
  })

  const [active, setActive] = useState(null)
  const startRef = useRef(null)
  const [tab, setTab] = useState('day')

  // ================= 保存 =================
  useEffect(() => {
    localStorage.setItem('lt_data', JSON.stringify(tasks))
  }, [tasks])

  // ================= 计时 =================
  const start = (i) => {
    if (tasks[i].done) return
    setActive(i)
    startRef.current = Date.now()
  }

  const stop = () => {
    if (active === null) return

    const duration = Math.floor((Date.now() - startRef.current) / 1000)

    setTasks((prev) =>
      prev.map((t, i) =>
        i === active
          ? {
              ...t,
              records: [...t.records, { time: Date.now(), duration }],
            }
          : t
      )
    )

    setActive(null)
    startRef.current = null
  }

  // ================= 新增任务 =================
  const addTask = () => {
    const name = prompt('任务名称')
    if (!name) return

    setTasks([
      ...tasks,
      {
        name,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        records: [],
        done: false,
      },
    ])
  }

  // ================= 时间范围 =================
  const getRange = () => {
    if (tab === 'day') return 86400000
    if (tab === 'week') return 86400000 * 7
    if (tab === 'month') return 86400000 * 30
    return 86400000
  }

  // ================= 核心统计（已修复） =================
  const stats = useMemo(() => {
    const now = Date.now()
    const range = getRange()

    return tasks.map((t) => {
      const total = t.records
        .filter((r) => r.time > now - range)
        .reduce((s, r) => s + r.duration, 0)

      return { ...t, total }
    })
  }, [tasks, tab])

  const totalAll = stats.reduce((s, t) => s + t.total, 0)

  // ================= UI =================
  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>📊 Learning Tracker</h1>

      {/* tab */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setTab('day')}>日</button>
        <button onClick={() => setTab('week')}>周</button>
        <button onClick={() => setTab('month')}>月</button>
      </div>

      {/* 总计 */}
      <h3>总学习时间：{totalAll} 秒</h3>

      {/* 📊 柱状图 */}
      <div style={{ marginTop: 20 }}>
        {stats.map((t) => {
          const percent = totalAll ? (t.total / totalAll) * 100 : 0

          return (
            <div key={t.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.color }}>{t.name}</span>
                <span>{t.total}s</span>
              </div>

              <div
                style={{
                  height: 12,
                  width: '100%',
                  background: '#eee',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: t.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* 任务列表 */}
      <div style={{ marginTop: 20 }}>
        {tasks.map((t, i) => (
          <div
            key={t.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 12,
              marginTop: 10,
              borderRadius: 10,
              background: t.done ? '#f0f0f0' : '#f9fafc',
              opacity: t.done ? 0.5 : 1,
              alignItems: 'center',
            }}
          >
            <span style={{ color: t.color }}>● {t.name}</span>

            <div style={{ display: 'flex', gap: 8 }}>
              {active === i ? (
                <button onClick={stop}>停止</button>
              ) : (
                <button onClick={() => start(i)}>开始</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addTask} style={{ marginTop: 10 }}>
        + 新增任务
      </button>
    </div>
  )
}