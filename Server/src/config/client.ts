import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hashPassword';
import { convertToDate } from 'utils/convertToDate';

const prisma = new PrismaClient().$extends({
  query: {
    user: hashPassword(),
    book: convertToDate(),
    borrowing: convertToDate()
  },
});

export const userClient = prisma.user;
export const bookClient = prisma.book;
export const isbnClient = prisma.isbn;
export const borrowClient = prisma.borrowing;
export const reservationClient = prisma.reservation;
export const cartClient = prisma.cart;
export const notificationClient = prisma.notification;
export const paymentClient = prisma.finePayment;
export const booksReadClient = prisma.booksRead;
