"use client"

/**
 * トースト通知システム
 *
 * このファイルは、アプリケーション全体で使用されるトースト通知機能を提供します。
 * トースト通知は、画面上部に一時的に表示される小さな通知メッセージです。
 *
 * 主な機能:
 * - トースト通知の追加・更新・削除
 * - 自動的なタイムアウト処理
 * - 複数のトーストの管理
 * - グローバルな状態管理
 *
 * 使用例:
 * ```tsx
 * const { toast } = useToast()
 *
 * // 成功通知
 * toast({ title: "成功", description: "処理が完了しました" })
 *
 * // エラー通知
 * toast({ title: "エラー", description: "処理に失敗しました", variant: "destructive" })
 * ```
 */

// react-hot-toastライブラリを参考にした実装
import * as React from "react"

import type {
    ToastActionElement,
    ToastProps,
} from "@/components/ui/toast"

// 同時に表示できるトーストの最大数
const TOAST_LIMIT = 1
// トーストが自動的に削除されるまでの時間（ミリ秒）
const TOAST_REMOVE_DELAY = 1000000

/**
 * トースト通知の型定義
 * 基本的なToastPropsに加えて、IDとタイトル・説明・アクションを含む
 */
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * アクションタイプの定義
 * トーストの状態を変更するためのアクションを定義
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",      // トーストを追加
  UPDATE_TOAST: "UPDATE_TOAST", // トーストを更新
  DISMISS_TOAST: "DISMISS_TOAST", // トーストを非表示
  REMOVE_TOAST: "REMOVE_TOAST", // トーストを削除
} as const

// トーストIDを生成するためのカウンター
let count = 0

/**
 * ユニークなIDを生成する関数
 * 各トーストに一意のIDを割り当てるために使用
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

/**
 * アクションの型定義
 * どのようなアクションが実行されるかを定義
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"] | undefined
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"] | undefined
    }

/**
 * グローバル状態の型定義
 * 現在表示されているトーストのリストを管理
 */
interface State {
  toasts: ToasterToast[]
}

// トーストのタイムアウトを管理するMap
// キー: トーストID, 値: setTimeoutの戻り値
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * トーストを削除キューに追加する関数
 *
 * 指定された時間後にトーストを自動的に削除するための処理
 * 同じトーストが既にキューにある場合は何もしない
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  // 指定時間後にトーストを削除するタイマーを設定
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * 状態を更新するリデューサー関数
 *
 * アクションに応じてトーストの状態を更新する
 * これはReactのuseReducerで使用されるパターン
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // 新しいトーストをリストの先頭に追加
      // TOAST_LIMITを超える場合は古いトーストを削除
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      // 指定されたIDのトーストを更新
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // 副作用の処理 - トーストを削除キューに追加
      // 本来は別の関数に分離すべきだが、シンプルさのためにここに配置
      if (toastId) {
        // 特定のトーストを削除キューに追加
        addToRemoveQueue(toastId)
      } else {
        // 全てのトーストを削除キューに追加
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      // トーストを非表示状態に更新
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // 全てのトーストを削除
        return {
          ...state,
          toasts: [],
        }
      }
      // 指定されたIDのトーストを削除
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// 状態変更を監視するリスナーの配列
const listeners: Array<(state: State) => void> = []

// メモリ上の状態（グローバルな状態管理）
let memoryState: State = { toasts: [] }

/**
 * アクションをディスパッチする関数
 *
 * 状態を更新し、全てのリスナーに変更を通知する
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// トースト作成時に使用する型（IDを除く）
type Toast = Omit<ToasterToast, "id">

/**
 * トースト通知を作成・管理する関数
 *
 * この関数は、トーストの作成・更新・削除の機能を提供する
 */
function toast({ ...props }: Toast) {
  const id = genId()

  // トーストを更新する関数
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  // トーストを削除する関数
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // 新しいトーストを追加
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // トーストの管理機能を返す
  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * トースト通知フック
 *
 * コンポーネント内でトースト機能を使用するためのReactフック
 * グローバルな状態を監視し、トーストの表示・管理を行う
 */
function useToast() {
  // ローカル状態としてグローバル状態を管理
  const [state, setState] = React.useState<State>(memoryState)

  // コンポーネントマウント時にリスナーを追加、アンマウント時に削除
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // トースト機能と状態を返す
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId: toastId ?? undefined }),
  }
}

export { toast, useToast }

