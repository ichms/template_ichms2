---
title: Split Components by UI Responsibility
impact: LOW-MEDIUM
impactDescription: reduces avoidable re-renders and review complexity
tags: advanced, components, architecture, rerender, maintainability
---

## Split Components by UI Responsibility

Do not keep unrelated UI responsibilities in one large component. When input state updates trigger unnecessary re-renders in other sections (list, summary, detail), split by responsibility and pass domain values instead of DOM events.

**Incorrect (single component mixes form/list/detail responsibilities):**

```tsx
function TodoPanel() {
  const [title, setTitle] = useState('')
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null)
  const { data } = useDomainBTodoListQuery({ page: 1, pageSize: 10 })
  const createTodoMutation = useCreateDomainBTodoMutation()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return
    createTodoMutation.mutate({ title })
    setTitle('')
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
      </form>

      <ul>
        {data?.items.map((item) => (
          <li key={item.id}>
            <button value={item.id} onClick={(event) => setSelectedTodoId(event.currentTarget.value)}>
              {item.title}
            </button>
          </li>
        ))}
      </ul>

      {selectedTodoId && <div>Selected: {selectedTodoId}</div>}
    </section>
  )
}
```

**Correct (split by responsibility, pass domain values):**

```tsx
interface TodoCreateFormProps {
  title: string
  onChangeTitle: (nextTitle: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

const TodoCreateForm = ({ title, onChangeTitle, onSubmit, isSubmitting }: TodoCreateFormProps) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <input
        value={title}
        onChange={(event) => onChangeTitle(event.currentTarget.value)}
      />
      <button type="submit" disabled={isSubmitting}>Add</button>
    </form>
  )
}

interface TodoListProps  {
  items: Array<{ id: string; title: string }>
  onSelectTodo: (todoId: string) => void
}

const TodoList = ({ items, onSelectTodo }: TodoListProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={() => onSelectTodo(item.id)}>{item.title}</button>
        </li>
      ))}
    </ul>
  )
}
```

Split when any of these signals appear:
- State changes in one area cause unrelated UI to re-render.
- Validation/branching logic grows and harms readability.
- A section is reusable in another route/domain.
- File size and review cost keep increasing.
