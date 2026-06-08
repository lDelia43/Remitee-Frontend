export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface DoctorsApiResponse {
  doctors: Doctor[];
}
