import { borrowClient, userClient, reservationClient, notificationClient, bookClient } from 'config/client';
import { sendEmailNotification, sendSmsNotification } from './notification';
import { createNotificationSchema } from "./body-validation-schemas";
import { validator } from './validator';
import { bookStatusEnum, notificationType, reservationStatusEnum } from '@prisma/client';

// Utility function to handle sending notifications and creating database entries
const sendNotification = async (user, subject, text) => {
    try {
        await sendEmailNotification(user.email, subject, text);
        const value = { user_id: user.id, type: subject, content: text };
        const data = await validator(value, createNotificationSchema);
        await notificationClient.create({ data: { ...data } });
    } catch (error) {
        console.error(`Error sending notification to user ${user.id}:`, error);
    }
};

// Check overdue borrowings and send notifications
export const checkOverdueBorrowings = async () => {
    try {
        const overdueBorrowings = await borrowClient.findMany({
            where: {
                due_date: { lte: new Date() },
                returned: false,
            },
            include: {
                book: true,
                user: true,
            },
        });

        for (const borrowing of overdueBorrowings) {
            const subject = notificationType.DUE_DATE;
            const text = `${borrowing.user.name}, you have not returned the book "${borrowing.book.title}" which was due on ${borrowing.due_date.toLocaleDateString()}.`;
            await sendNotification(borrowing.user, subject, text);
        }

        console.log(`${overdueBorrowings.length} overdue notifications sent.`);
    } catch (error) {
        console.error('Error checking overdue borrowings:', error);
    }
};

// Check fines and send notifications
export const checkFines = async () => {
    try {
        const usersWithFines = await borrowClient.groupBy({
            by: ['user_id'],
            _sum: { fine_amount: true },
            where: {
                fine_amount: { gt: 0 },
            },
        });

        const userIds = usersWithFines.map(user => user.user_id);
        const userDetails = await userClient.findMany({
            where: { id: { in: userIds } },
        });

        for (const user of usersWithFines) {
            const userInfo = userDetails.find(u => u.id === user.user_id);
            if (userInfo) {
                const subject = notificationType.FINE;
                const text = `${userInfo.name}, you have an unpaid fine of ${user._sum.fine_amount} USD.`;
                await sendNotification(userInfo, subject, text);
            }
        }

        console.log(`${usersWithFines.length} fine notifications sent.`);
    } catch (error) {
        console.error('Error checking fines:', error);
    }
};

// Check reservations and send notifications
export const reservationsAvailable = async () => {
    try {
        const unsatisfiedReservations = await reservationClient.findMany({
            where: {
                reservation_status: reservationStatusEnum.Not_collected,
                book: {
                    status: bookStatusEnum.Available,
                },
            },
            include: {
                user: true,
                book: true,
            },
        });

        for (const reservation of unsatisfiedReservations) {
            const { user, book } = reservation;
            const subject = notificationType.RESERVATION;
            const text = `${user.name}, the book "${book.title}" you reserved is now available for collection.`;
            await sendNotification(user, subject, text);
        }

        console.log(`${unsatisfiedReservations.length} reservation notifications sent.`);
    } catch (error) {
        console.error('Error checking reservations:', error);
    }
};

