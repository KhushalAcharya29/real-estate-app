import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ---------------------------
// 1️⃣ Define your Data Types
// ---------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'client';
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface PropertyLocation {
  address?: string;
  city: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface Property {
  _id: string;
  title: string;
  description?: string;
  price: number;
  location: PropertyLocation;
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  image?: string;
  images?: string[];
  amenities?: string[];
  status?: 'available' | 'sold' | 'pending';
  agentId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Interest {
  _id: string;
  propertyId: Property;
  clientId: User;
  message?: string;
  createdAt?: string;
}

// ---------------------------
// 2️⃣ Setup Base API
// ---------------------------
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/v1',
    credentials: 'include', // send cookies automatically
  }),
  tagTypes: ['Auth', 'Property', 'Interest'],

  endpoints: (builder) => ({
    // ---------------------------
    // AUTH ENDPOINTS
    // ---------------------------

    register: builder.mutation<AuthResponse, { name: string; email: string; password: string; role: 'agent' | 'client' }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    getMe: builder.query<{ user: User }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    // ---------------------------
    // PROPERTY ENDPOINTS
    // ---------------------------

    // Public property listing
    listProperties: builder.query<
  { data: Property[]; total?: number; page?: number },
  Record<string, string | number> | void
>({
  query: (params) => {
    return params
      ? { url: '/properties', params }
      : { url: '/properties' };
  },
  providesTags: ['Property'],
}),


    // Public single property
    getProperty: builder.query<{ data: Property }, string>({
      query: (id) => `/properties/${id}`,
      providesTags: ['Property'],
    }),

    // Agent's managed properties
    myProperties: builder.query<{ data: Property[] }, void>({
      query: () => '/properties/agent/my-properties',
      providesTags: ['Property'],
    }),

    // Agent creates a new property
    createProperty: builder.mutation<{ data: Property }, Partial<Property>>({
      query: (body) => ({
        url: '/properties/agent',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Property'],
    }),

    // ---------------------------
    // INTEREST ENDPOINTS
    // ---------------------------

    // Client expresses interest
    expressInterest: builder.mutation<{ data: Interest }, { propertyId: string; message?: string }>({
      query: (body) => ({
        url: '/interests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Interest'],
    }),

    // Client’s interests list
    myInterests: builder.query<{ data: Interest[] }, void>({
      query: () => '/interests',
      providesTags: ['Interest'],
    }),

    // Agent views clients interested in their property
    getInterestedClients: builder.query<{ data: Interest[] }, string>({
      query: (propertyId) => `/interests/property/${propertyId}/clients`,
      providesTags: ['Interest'],
    }),
  }),
});

// ---------------------------
// 3️⃣ Export hooks
// ---------------------------
export const {
  // Auth
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,

  // Property
  useListPropertiesQuery,
  useGetPropertyQuery,
  useMyPropertiesQuery,
  useCreatePropertyMutation,

  // Interests
  useExpressInterestMutation,
  useMyInterestsQuery,
  useGetInterestedClientsQuery,
} = api;
