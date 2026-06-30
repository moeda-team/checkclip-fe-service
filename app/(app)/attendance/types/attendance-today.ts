export interface AttedanceToday {
  id: string;
  user_id: string;
  latitude: string;
  longitude: string;
  check_in_at?: Date | null;
  check_out_at?: Date | null;
  created_at: string;
  images: {
    id: string;
    path: string;
    url: string;
    type: "check_in" | "check_out";
    is_face_verification: boolean;
    is_photo_capture: boolean;
  }[];
}
