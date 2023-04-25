import {
  PostgrestResponse as PostgrestCollectionResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js'

export type EntityResponse<T> = PostgrestSingleResponse<T>
export type CollectionResponse<T> = PostgrestCollectionResponse<T>

export type AsyncEntityResponse<T> = EntityResponse<T>
export type AsyncCollectionResponse<T> = CollectionResponse<T>
