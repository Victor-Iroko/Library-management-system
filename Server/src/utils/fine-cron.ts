import { borrowClient } from "config/client"


export const addFine = async () => {
    await borrowClient.updateMany({
        where: {
            due_date: {lte: new Date()},
            returned: false,
        },
        data: {
            fine_amount: {
                increment: 1000
            }
        }
    })
}