import { useCallback, useSyncExternalStore } from 'react'
import {
  getArticleReadStateVersion,
  isArticleRead,
  markArticleOpened,
  subscribeArticleReadState,
} from '@/lib/articleReadState'

export function useArticleRead(itemId: string) {
  const storeVersion = useSyncExternalStore(
    subscribeArticleReadState,
    getArticleReadStateVersion,
    () => 0,
  )
  void storeVersion

  const read = isArticleRead(itemId)
  const markOpened = useCallback(() => {
    markArticleOpened(itemId)
  }, [itemId])

  return {
    isUnread: !read,
    markOpened,
  }
}
