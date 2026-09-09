import { Response } from "express";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Standard success envelope: { success, message?, data } */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string
): Response => {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    data,
  });
};

/** Success envelope for list endpoints: { success, data, pagination } */
export const sendPaginated = <T>(res: Response, data: T[], pagination: Pagination): Response => {
  return res.status(200).json({ success: true, data, pagination });
};

export const buildPagination = (page: number, limit: number, total: number): Pagination => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
