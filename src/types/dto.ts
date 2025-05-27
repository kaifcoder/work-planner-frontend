// src/types/dto.ts

export interface UserDto {
  id: number;
  username: string;
  role: string;
  projectIds: number[];
  assignedTaskIds: number[];
  suggestedTaskIds: number[];
}

export interface ProjectDto {
  id: number;
  name: string;
  description: string;
  createdById: number;
  endDate: string | Date | null;
  memberIds: number[];
  taskIds: number[];
  createdBy: UserDto;
  memberDtos: UserDto[];
}

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  dueDate: string | Date;
  createdDate: string | Date;
  status: string;
  assignedToUser: UserDto | null;
  suggestedByUser: UserDto | null;
  project: ProjectDto;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  status: string;
  token: string;
}
