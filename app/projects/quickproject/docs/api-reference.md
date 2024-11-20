# QuickProject API Reference

## Authentication

### POST /api/auth/login

Login with email and password.

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

### POST /api/auth/register

Register a new user.

```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

## Projects

### GET /api/projects

Get all projects for the authenticated user.

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type GetProjectsResponse = Project[];
```

### POST /api/projects

Create a new project.

```typescript
interface CreateProjectRequest {
  name: string;
  description: string;
}

interface CreateProjectResponse extends Project {}
```
