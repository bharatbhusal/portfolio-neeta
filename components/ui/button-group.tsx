import * as React from "react"

import { cn } from "@/lib/utils"

function ButtonGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group"
      className={cn(
        "inline-flex items-center gap-0 -space-x-px [&>[data-slot=button]:first-child]:rounded-r-none [&>[data-slot=button]:last-child]:rounded-l-none [&>[data-slot=button]:not(:first-child):not(:last-child)]:rounded-none",
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
