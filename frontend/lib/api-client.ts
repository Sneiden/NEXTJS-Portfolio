// The base URL of our NestJS backend.
// In development this is http://localhost:3333
// In production it will be replaced by the BACKEND_URL environment variable
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3333"

// Defines the shape of options we can pass to every request.
// This is a reusable type so we don't repeat ourselves across all API calls.
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" // HTTP verb
  body?: unknown      // Data to send in the request body (for POST, PATCH, etc.)
  token?: string      // JWT access token for protected routes
}

// A generic reusable function that handles ALL HTTP requests to the backend.
// <T> is a TypeScript generic — it means "whatever type the caller expects back".
// For example: request<Project[]>("/projects") tells TypeScript to expect an array of Projects.
async function request<T>(
  endpoint: string,           // The API path e.g. "/projects" or "/auth/login"
  options: RequestOptions = {} // Optional config — defaults to empty object
): Promise<T> {
  const { method = "GET", body, token } = options

  // Every request sends JSON — we tell the backend this via Content-Type header
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  // If a token is provided, attach it as a Bearer token in the Authorization header.
  // This is how our NestJS backend knows the request is from an authenticated admin user.
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Make the actual HTTP request to the backend
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers,
    // Only include a body if data was provided — GET requests never have a body
    body: body ? JSON.stringify(body) : undefined,
  })

  // If the server returned an error status (4xx or 5xx), throw an error
  // so the calling component can handle it (show an error message, etc.)
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }))
    throw new Error(error.message ?? `HTTP error ${response.status}`)
  }

  // Parse and return the JSON response, typed as whatever T the caller expects
  return response.json() as Promise<T>
}

// The apiClient object is what we import in our components and pages.
// Instead of writing raw fetch() calls everywhere, we call clean named methods
// like apiClient.getProjects() or apiClient.createProject(data, token).
export const apiClient = {

  // ─── AUTH ─────────────────────────────────────────────────────────────────
  // Called when an admin logs in — returns a JWT access token and user info
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: object }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  // ─── PROJECTS ─────────────────────────────────────────────────────────────
  // Public — fetch all published projects for the portfolio page
  getProjects: () => request<object[]>("/projects"),

  // Public — fetch a single project by its URL slug (e.g. "my-portfolio-app")
  getProject: (slug: string) => request<object>(`/projects/${slug}`),

  // Protected — create a new project (requires admin token)
  createProject: (data: unknown, token: string) =>
    request<object>("/projects", { method: "POST", body: data, token }),

  // Protected — update an existing project by ID (requires admin token)
  updateProject: (id: string, data: unknown, token: string) =>
    request<object>(`/projects/${id}`, { method: "PATCH", body: data, token }),

  // Protected — delete a project by ID (requires admin token)
  deleteProject: (id: string, token: string) =>
    request<void>(`/projects/${id}`, { method: "DELETE", token }),

  // ─── POSTS ────────────────────────────────────────────────────────────────
  // Public — fetch all published blog posts
  getPosts: () => request<object[]>("/posts"),

  // Public — fetch a single post by its URL slug
  getPost: (slug: string) => request<object>(`/posts/${slug}`),

  // Protected — create a new blog post (requires admin token)
  createPost: (data: unknown, token: string) =>
    request<object>("/posts", { method: "POST", body: data, token }),

  // Protected — update an existing post by ID (requires admin token)
  updatePost: (id: string, data: unknown, token: string) =>
    request<object>(`/posts/${id}`, { method: "PATCH", body: data, token }),

  // Protected — delete a post by ID (requires admin token)
  deletePost: (id: string, token: string) =>
    request<void>(`/posts/${id}`, { method: "DELETE", token }),

  // ─── REFERENCES ───────────────────────────────────────────────────────────
  // Public — fetch all published testimonials/references
  getReferences: () => request<object[]>("/references"),

  // Protected — create a new reference (requires admin token)
  createReference: (data: unknown, token: string) =>
    request<object>("/references", { method: "POST", body: data, token }),

  // Protected — update an existing reference by ID (requires admin token)
  updateReference: (id: string, data: unknown, token: string) =>
    request<object>(`/references/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  // Protected — delete a reference by ID (requires admin token)
  deleteReference: (id: string, token: string) =>
    request<void>(`/references/${id}`, { method: "DELETE", token }),

  // ─── CONTACT ──────────────────────────────────────────────────────────────
  // Protected — fetch all contact messages from the inbox (requires admin token)
  getMessages: (token: string) =>
    request<object[]>("/contact", { token }),

  // Public — send a contact message from the portfolio contact form
  sendMessage: (data: unknown) =>
    request<object>("/contact", { method: "POST", body: data }),

  // Protected — mark a message as read in the admin inbox (requires admin token)
  markAsRead: (id: string, token: string) =>
    request<object>(`/contact/${id}/read`, { method: "PATCH", token }),
}