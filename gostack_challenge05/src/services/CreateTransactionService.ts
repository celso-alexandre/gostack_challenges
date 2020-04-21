import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const transactions = await transactionRepository.find();
      let funds = 0;
      // eslint-disable-next-line array-callback-return
      transactions.map(transaction => {
        if (transaction.type === 'outcome') {
          funds -= transaction.value;
        } else {
          funds += transaction.value;
        }
      });

      if (value > funds) {
        throw new AppError(`Not enough funds. Actual funds: ${funds}`);
      }
    }

    const findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let categoryId: string;

    if (findCategory) {
      categoryId = findCategory.id;
    } else {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      categoryId = newCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
