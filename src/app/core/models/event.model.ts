export interface EventModel {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  date: string;
  end_date?: string | null;
  location?: string | null;
  image_url?: string;
  partner?: string;
  partners?: string[] | null;
  type?: 'workshop' | 'conference' | 'meetup' | 'coding' | null;
  status?: 'upcoming' | 'past' | null;
  video_url?: string | null;
  highlights?: string[] | null;
  created_at: string;
  updated_at: string;
}
