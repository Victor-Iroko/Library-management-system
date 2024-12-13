
export function convertToDate() {
    return {async create({ args, query }) {
        // Check if publication_year exists and is an integer
        if (args.data.publication_year) {
            args.data.publication_year = new Date(args.data.publication_year);
        }

        if (args.data.due_date) {
            args.data.due_date = new Date(args.data.due_date);
        }

        if (args.data.return_date) {
            args.data.return_date = new Date(args.data.return_date);
        }

        // Proceed with the modified args
        return query(args);
    },
    async update({ args, query }) {
        // Handle updates where publication_year is provided
        if (args.data.publication_year) {
            args.data.publication_year = new Date(args.data.publication_year);
        }

        if (args.data.due_date) {
            args.data.due_date = new Date(args.data.due_date);
        }

        if (args.data.return_date) {
            args.data.return_date = new Date(args.data.return_date);
        }
        
        return query(args);
    }
}
}