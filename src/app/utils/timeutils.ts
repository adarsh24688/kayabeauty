// Utility functions for time conversion
export function convertMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`
}

export function convertTimeToMinutes(timeString: string): number {
  const [time, period] = timeString.split(" ")
  const [hours, minutes] = time.split(":").map(Number)
  let totalMinutes = minutes

  if (period === "PM" && hours !== 12) {
    totalMinutes += (hours + 12) * 60
  } else if (period === "AM" && hours === 12) {
    totalMinutes += 0
  } else {
    totalMinutes += hours * 60
  }

  return totalMinutes
}

export function getTimePeriod(minutes: number): "morning" | "afternoon" | "evening" {
  const hours = Math.floor(minutes / 60)
  if (hours < 12) return "morning"
  if (hours < 17) return "afternoon"
  return "evening"
}
