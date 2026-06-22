import { useState, useRef, useEffect } from 'react'
import bg from './assets/IMG_0552.JPG'

const STORAGE_KEY = 'learning_tracker_v1'

function App() {
  // =========================
  // 💾 初始化（支持恢复）
  // =========================
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    return saved
      ? JSON.parse(saved)
      : [
          {
            name: '日语',
            color: '#3B82F6',
            time: 0,
            done: false,
            sessions: [] // 🆕 用于未来统计图
          },
          {
            name: '韩语',
            color: '#22C55E',
            time: 0,
            done: false,
            sessions: []
          },
          {
            name: '阅读',
            color: '#EAB308',
            time: 0,
            done: false,
            sessions: []
          },
          {
            name: '健身',
            color: '#EF4444',
            time: 0,
            done: false,
            sessions: []
          },
        ]
  })

  const [activeIndex, setActiveIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)

  const intervalRef = useRef(null)

  // =========================
  // 💾 自动保存（新增）
  // =========================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // =========================
  // ⏱ 计时（保留原逻辑 + 增强记录）
  // =========================
  const toggleTimer = (index) => {
    const now = Date.now()

    // stop
    if (activeIndex === index) {
      clearInterval(intervalRef.current)

      setTasks(prev => {
        const copy = [...prev]

        // 🆕 记录一次 session（用于未来折线图）
        copy[index].sessions.push({
          date: new Date().toISOString().slice(0, 10),
          duration: copy[index].time
        })

        return copy
      })

      setActiveIndex(null)
      return
    }

    // start
    clearInterval(intervalRef.current)
    setActiveIndex(index)

    intervalRef.current = setInterval(() => {
      setTasks(prev => {
        const copy = [...prev]
        copy[index].time += 1
        return copy
      })
    }, 1000)
  }

  // =========================
  // ➕ 新增任务（保留）
  // =========================
  const addTask = () => {
    setTasks([
      ...tasks,
      {
        name: '新任务',
        color: '#999',
        time: 0,
        done: false,
        sessions: []
      }
    ])
  }

  // =========================
  // ✔ 完成（保留）
  // =========================
  const toggleDone = (index) => {
    const copy = [...tasks]
    copy[index].done = !copy[index].done
    setTasks(copy)
  }

  // =========================
  // ✏️ 编辑（保留）
  // =========================
  const updateName = (index, value) => {
    const copy = [...tasks]
    copy[index].name = value
    setTasks(copy)
  }

  // =========================
  // 📊 总时间（新增统计基础）
  // =========================
  const totalTime = tasks.reduce((sum, t) => sum + t.time, 0)

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}m ${s}s`
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>

      {/* 🧊 毛玻璃（保持你喜欢的风格） */}
      <div style={{
        width: '460px',
        padding: '24px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        color: '#fff'
      }}>

        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>
          인절미
        </h1>

        <p style={{ opacity: 0.8 }}>
          总时间：{formatTime(totalTime)}
        </p>

        {/* ========================= */}
        {/* 任务列表（完全保留） */}
        {/* ========================= */}
        <div style={{
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {tasks.map((task, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.1)',
                opacity: task.done ? 0.5 : 1,
                textDecoration: task.done ? 'line-through' : 'none'
              }}
            >

              {/* 左侧 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                <span
                  onClick={() => toggleDone(index)}
                  style={{
                    color: task.color,
                    cursor: 'pointer'
                  }}
                >
                  ●
                </span>

                {/* hover编辑 */}
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
                      outline: 'none'
                    }}
                  />
                ) : (
                  <span onMouseEnter={() => setEditingIndex(index)}>
                    {task.name}
                  </span>
                )}
              </div>

              {/* 右侧计时 */}
              <div
                onClick={() => toggleTimer(index)}
                style={{
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {formatTime(task.time)}
              </div>

            </div>
          ))}
        </div>

        {/* ========================= */}
        {/* 新增任务（保留） */}
        {/* ========================= */}
        <button
          onClick={addTask}
          style={{
            marginTop: '18px',
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.9)',
            color: '#000',
            fontWeight: '600'
          }}
        >
          + 新增任务
        </button>

      </div>
    </div>
  )
}

export default App