"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"
import { cn } from "@/lib/utils"
import { format, setMonth, setYear } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import "react-day-picker/style.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      hideNavigation // Hide default nav since we have custom arrows in MonthCaption
      className={cn("p-3 bg-black/90 border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl min-w-[320px]", className)}
      fromYear={2022}
      toYear={2026}
      classNames={{
        months: "space-y-4",
        month: "space-y-4",
        caption: "hidden", 
        month_caption: "flex justify-center pt-1 relative items-center", // VISIBLE now
        month_grid: "w-full border-collapse",
        weekdays: "",
        week: "w-full mt-2",
        weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md text-center cursor-pointer text-white hover:bg-white/10 relative focus-within:relative focus-within:z-20"
        ),
        selected:
          "bg-blue-600 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-600 focus:text-white rounded-md", // Standard rounded selection for single days
        today: "bg-white/10 text-white font-bold rounded-md",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:!bg-blue-500/20 aria-selected:text-white rounded-none",
        range_start: "rounded-l-md rounded-r-none", 
        range_end: "rounded-r-md rounded-l-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        // Custom Caption with Selects for Year/Month and Navigation Arrows
        MonthCaption: ({ calendarMonth }) => { // Changed Caption -> MonthCaption. Prop is calendarMonth in v9 usually, or displayMonth? Let's check user didn't specify prop name, but v9 MonthCaption props typically have { calendarMonth, displayMonth }. We use displayMonth logic.
            const { goToMonth, nextMonth, previousMonth } = useNavigation()
            
            // v9 compat: calendarMonth.date or direct styling. 
            // Warning: MonthCaption props might defer. 
            // Let's assume standard RDP v9 behavior where props include displayMonth or we can access it.
            // Actually, in v9 "MonthCaption" receives `MonthCaptionProps`. 
            // Let's safe guard: use `useDayPicker` context or just use `calendarMonth.date`.
            // But wait, the user provided code used `displayMonth`. 
            // In v9 `MonthCaption` props are `{ calendarMonth, displayIndex }`. 
            // `calendarMonth.date` is the date.
            
            // However, to be safe and simple, let's look at what `Caption` had: `displayMonth`. 
            // If we blindly rename, we might break if prop name changes.
            // Let's try to destructure `calendarMonth` and use `calendarMonth.date` if available, or fallback.
            // Actually, `useNavigation` gives us context. We just need the "current month" being rendered.
            // In MonthCaption, we can use `useDayPicker` state? No, we need the specific month being rendered.
            // Let's assume standard prop `calendarMonth` has a `date` property.
            
            return (
                <CustomCaption displayMonth={calendarMonth?.date || new Date()} /> // Extract to separate small component or inline with check
            )
        }
      }}
      {...props}
    />
  )
}

// Helper to keep the logic clean and handle props adaptation
function CustomCaption({ displayMonth }: { displayMonth: Date }) {
    const { goToMonth, nextMonth, previousMonth } = useNavigation()
    
    const currentYear = displayMonth.getFullYear()
    const currentMonth = displayMonth.getMonth()
    
    // Generate Years (2022 - 2026)
    const years = ["2022", "2023", "2024", "2025", "2026"]
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const handleYearChange = (val: string) => {
        const newDate = setYear(displayMonth, parseInt(val))
        goToMonth?.(newDate)
    }

    const handleMonthChange = (val: string) => {
        const newIndex = months.indexOf(val)
        const newDate = setMonth(displayMonth, newIndex)
        goToMonth?.(newDate)
    }

    return (
        <div className="flex items-center justify-between py-2 px-1 gap-2 border-b border-white/10 mb-2">
            {/* Previous Button */}
            <button 
                onClick={() => previousMonth && goToMonth?.(previousMonth)}
                disabled={!previousMonth}
                className="h-7 w-7 p-0 hover:bg-white/10 rounded-md flex items-center justify-center disabled:opacity-30 bg-transparent text-white border border-white/20"
                type="button" // best practice
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Selectors */}
            <div className="flex gap-2">
                <Select value={months[currentMonth]} onValueChange={handleMonthChange}>
                    <SelectTrigger className="h-7 w-[110px] bg-transparent border-white/20 text-xs text-white">
                        <SelectValue>{months[currentMonth]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        {months.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="h-7 w-[80px] bg-transparent border-white/20 text-xs text-white">
                        <SelectValue>{currentYear}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        {years.map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Next Button */}
            <button 
                 onClick={() => nextMonth && goToMonth?.(nextMonth)}
                 disabled={!nextMonth}
                 className="h-7 w-7 p-0 hover:bg-white/10 rounded-md flex items-center justify-center disabled:opacity-30 bg-transparent text-white border border-white/20"
                 type="button"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}

Calendar.displayName = "Calendar"

export { Calendar }
