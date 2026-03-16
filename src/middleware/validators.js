export const isNonEmptyString = (value) => (
  typeof value === "string" && value.trim() !== ""
)

export const parsePositiveInteger = (value) => {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null
  }

  return parsedValue
}
