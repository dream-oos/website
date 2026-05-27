---
title: 'React 开发中的实用技巧与最佳实践'
description: '总结日常 React 开发中常用的模式和技巧，涵盖 Hooks、性能优化和 TypeScript 类型体操。'
pubDate: 2026-05-20
tags:
  - React
  - TypeScript
  - 前端
---

## React 开发技巧合集

在日常的 React 开发中，我积累了一些实用的技巧和模式。这篇文章将分享其中最常用的几个，希望对你有所帮助。

### 1. 自定义 Hook：useLocalStorage

将状态持久化到 `localStorage` 是一个非常常见的需求。我们可以封装一个通用的 Hook：

```typescript
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// 使用示例
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

### 2. 使用 TypeScript 泛型约束组件 Props

TypeScript 的泛型可以让组件更加灵活且类型安全：

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = '暂无数据',
}: ListProps<T>) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// 完全类型安全的使用
interface User {
  id: string;
  name: string;
  email: string;
}

<List<User>
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <span>{user.name}</span>}
/>
```

### 3. 性能优化：合理使用 useMemo 和 useCallback

很多人会过度使用 `useMemo` 和 `useCallback`，但其实只有在以下情况才需要：

```typescript
import { useMemo, useCallback } from 'react';

interface DataTableProps {
  data: Record<string, unknown>[];
  filter: string;
  onRowClick: (id: string) => void;
}

function DataTable({ data, filter, onRowClick }: DataTableProps) {
  // ✅ 数据量大且过滤逻辑复杂时，使用 useMemo
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  // ✅ 作为 props 传给被 memo 包裹的子组件时，使用 useCallback
  const handleRowClick = useCallback(
    (id: string) => {
      onRowClick(id);
    },
    [onRowClick]
  );

  return (
    <table>
      <tbody>
        {filteredData.map((row) => (
          <TableRow
            key={String(row.id)}
            data={row}
            onClick={handleRowClick}
          />
        ))}
      </tbody>
    </table>
  );
}
```

### 4. 组合模式（Compound Components）

组合模式可以让组件 API 更加直观：

```typescript
interface CardContextType {
  variant: 'default' | 'outline';
}

const CardContext = React.createContext<CardContextType>({
  variant: 'default',
});

function Card({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div className="rounded-lg border p-4">{children}</div>
    </CardContext.Provider>
  );
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 font-semibold">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="text-muted-foreground">{children}</div>;
};

// 使用方式非常直观
<Card variant="outline">
  <Card.Header>标题</Card.Header>
  <Card.Body>内容</Card.Body>
</Card>
```

### 总结

这些技巧的核心思路其实都是一样的：

1. **类型安全** —— 充分利用 TypeScript 的类型系统
2. **关注分离** —— 将逻辑抽离到自定义 Hook 中
3. **适度优化** —— 不要过早优化，先量测再行动
4. **API 设计** —— 让组件的使用方式尽可能直观

希望这些技巧对你的日常开发有所帮助。如果你有更好的实践方式，欢迎在评论区交流！
