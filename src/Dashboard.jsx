import { useState, useRef, useEffect } from 'react'
import bg from './assets/IMG_0552.JPG'
import Dashboard from './Dashboard'

const STORAGE_KEY = 'learning_tracker_v5'

function App() {
  const [showDash, setShowDash] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const intervalRef = useRef(null)

  // =========================
  // 💾 数据初始化（不丢）
  // =========================
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    return saved
      ? JSON.parse(saved)
      : [
          { name: '日语', color: '#3B82F6', done: false, sessions: [] },
          { name: '韩语', color: '#22C55E', done: false, sessions: [] },
          { name: '阅读', color: '#EAB308', done: false, sessions: [] },
          { name: '健身', color: '#EF4444', done: false, sessions: [] }
        ]
  })

  // =========================
  // 💾 自动保存
  // =========================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // =========================
  // ⏱ STAR / STOP（完整修复）
  // =========================
  const toggleTimer = (index) => {
    const now = Date.now()

    // STOP
    if (activeIndex === index) {
      clearInterval(intervalRef.current)

      setTasks(prev => {
        const copy = [...prev]
        const task = copy[index]

        const last = task.sessions[task.sessions.length - 1]

        if (last && !last.end) {
          last.end = now
          last.duration = Math.floor((now - last.start) / 1000)
        }

        return copy
      })

      setActiveIndex(null)
      return
    }

    // START
    clearInterval(intervalRef.current)
    setActiveIndex(index)

    setTasks(prev => {
      const copy = [...prev]

      if (!copy[index].sessions) {
        copy[index].sessions = []
      }

      copy[index].sessions.push({
        start: now,
        end: null,
        duration: 0,
        date: new Date().toISOString().slice(0, 10)
      })

      return copy
    })
  }

  // =========================
  // ➕ 新增任务
  // =========================
  const addTask = () => {
    setTasks([
      ...tasks,
      { name: '新任务', color: '#999', done: false, sessions: [] }
    ])
  }

  // =========================
  // ✏️ 修改名字
  // =========================
  const updateName = (i, value) => {
    const copy = [...tasks]
    copy[i].name = value
    setTasks(copy)
  }

  // =========================
  // ✔ 完成
  // =========================
  const toggleDone = (i) => {
    const copy = [...tasks]
    copy[i].done = !copy[i].done
    setTasks(copy)
  }

  // =========================
  // ⏱ 时间统计（sessions）
  // =========================
  const formatTime = (task) => {
    const total = task.sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}m ${s}s`
  }

  // =========================
  // 📊 Dashboard
  // =========================
  if (showDash) {
    return <Dashboard tasks={tasks} onBack={() => setShowDash(false)} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      <div style={{
        width: 480,
        padding: 24,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>

        {/* 📊 入口 */}
        <button
          onClick={() => setShowDash(true)}
          style={{ marginBottom: 12 }}
        >
          📊 详情 / 统计
        </button>

        {/* =========================
            TASK LIST（GRID修复居中）
        ========================= */}
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 1fr auto',
              alignItems: 'center',
              padding: 12,
              marginTop: 10,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.08)'
            }}
          >

            {/* ✔ 左：完成 */}
            <span
              onClick={() => toggleDone(index)}
              style={{
                color: task.color,
                cursor: 'pointer',
                fontSize: 18
              }}
            >
              ●
            </span>

            {/* ⏱ 中：时间（绝对居中列） */}
            <span style={{
              textAlign: 'center',
              justifySelf: 'center',
              fontWeight: '500'
            }}>
              {formatTime(task)}
            </span>

            {/* ✏️ 名字 */}
            {editingIndex === index ? (
              <input
                value={task.name}
                autoFocus
                onBlur={() => setEditingIndex(null)}
                onChange={(e) => updateName(index, e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
            ) : (
              <span onMouseEnter={() => setEditingIndex(index)}>
                {task.name}
              </span>
            )}

            {/* ⭐ STAR / STOP（终于明显了） */}
            <button
              onClick={() => toggleTimer(index)}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: activeIndex === index ? '#ef4444' : '#22c55e',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              {activeIndex === index ? 'STOP' : 'STAR'}
            </button>

          </div>
        ))}

        {/* ➕ 新增 */}
        <button
          onClick={addTask}
          style={{
            marginTop: 15,
            width: '100%',
            padding: 10,
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + 新增任务
        </button>

      </div>
    </div>
  )
}

export default App