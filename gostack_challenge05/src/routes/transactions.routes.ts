import { getCustomRepository } from 'typeorm';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = {
    income: 0,
    outcome: 0,
    total: 0,
  };

  // eslint-disable-next-line array-callback-return
  transactions.map(transaction => {
    if (transaction.type === 'income') {
      balance.income += transaction.value;
      balance.total += transaction.value;
    }

    if (transaction.type === 'outcome') {
      balance.outcome += transaction.value;
      balance.total -= transaction.value;
    }
  });

  const allTransactionsAndBalance = {
    transactions,
    balance,
  };

  return response.json(allTransactionsAndBalance);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();
  const transaction = await deleteTransaction.execute(id);

  return response.json(transaction);
});

transactionsRouter.post(
  '/import',
  upload.single('csv'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions: Transaction[] = await importTransactions.execute({
      transactionsCsvFilename: request.file.filename,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;
