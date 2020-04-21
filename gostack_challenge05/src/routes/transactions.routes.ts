import { getCustomRepository } from 'typeorm';
import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // const transactionsRepository = new TransactionsRepository();

  // const transactions = transactionsRepository.getBalance();

  // console.log(transactions);
  // response.json(transactions);

  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();

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

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
