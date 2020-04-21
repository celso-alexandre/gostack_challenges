import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';
import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  transactionsCsvFilename: string;
}

class ImportTransactionsService {
  async execute({ transactionsCsvFilename }: Request): Promise<Transaction[]> {
    const usersRepository = getRepository(Transaction);

    const transactionsCsvFilePath = path.join(
      uploadConfig.directory,
      transactionsCsvFilename,
    );

    const createTransaction = new CreateTransactionService();
    // let parsedCsv: Transaction[];

    const parsedCsv = await csv()
      .fromFile(transactionsCsvFilePath)
      .then(jsonObj => {
        return jsonObj;
      });

    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < parsedCsv.length; index++) {
      const { title, type, value, category } = parsedCsv[index];

      // eslint-disable-next-line no-await-in-loop
      const newTransaction = await createTransaction.execute({
        title,
        type,
        value,
        category,
      });

      transactions.push(newTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
