// Shapes shared by every endpoint: the response envelope, paging info and the error body.

/** Paging info the backend adds to the three paginated lists. */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

/** Every successful response looks like this; `meta` only exists on paginated lists. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PageMeta;
}

/** Every failed response looks like this. */
export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details: { field: string; message: string }[];
  };
}

/** A list plus its paging info, which is what our paginated API functions return. */
export interface Paged<T> {
  items: T[];
  meta: PageMeta;
}
