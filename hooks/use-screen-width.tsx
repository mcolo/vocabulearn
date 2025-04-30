import * as React from "react"

const BREAK = 1536

export function useScreenWidth() {
  const [isSmaller, setIsSmaller] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAK - 1}px)`)
    const onChange = () => {
      setIsSmaller(window.innerWidth < BREAK)
    }
    mql.addEventListener("change", onChange)
    setIsSmaller(window.innerWidth < BREAK)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isSmaller
}
