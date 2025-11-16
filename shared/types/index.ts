// shared/types/index.ts
export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

export interface Project {
  id: string
  user_id: string
  title: string
  canvas_json: any
  thumbnail_url: string
  width: number
  height: number
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  name: string
  aspect: '16:9' | '9:16'
  preview_url: string
  file_path: string
  category: string
}

export interface CreditBalance {
  user_id: string
  balance: number
  updated_at: string
}
