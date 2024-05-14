export type Patient = {
  patientId: number
  name: string
  surname: string
  document: string
  contactPhone: string
  dateOfBirth: Date
  gender: "MALE" | "FEMALE" | "NOT_SPECIFIED" | "UNKNOWN"
}
