import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "/src/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-color1 data-[state=unchecked]:bg-color0 border-color5",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-[1px] bg-color5 "
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
