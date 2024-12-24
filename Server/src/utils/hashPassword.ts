import bcrypt from 'bcrypt';

// for hashing password upoon saving into the prisma database
export function hashPassword() {
  return {
    async create({ model, operation, args, query }) {
      cleanData(args.data); // removes confirm_password part
      await hashPasswordIfPresent(args.data); // hashes the password
      return query(args);
    },
    async update({ model, operation, args, query }) {
      cleanData(args.data);
      await hashPasswordIfPresent(args.data);
      return query(args);
    },
    async createMany({ model, operation, args, query }) {
      cleanData(args.data); // removes confirm_password part
      await hashPasswordIfPresent(args.data); // hashes the password
      return query(args);
    },
  };
}

export const hashPasswordIfPresent = async (data: any) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
}

const cleanData = (data: any) => {
  if (data?.confirm_password) {
    delete data.confirm_password; // Remove `confirm_password`
  }
};



