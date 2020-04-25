import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Response> {
    const transactions = await this.find();

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

    return allTransactionsAndBalance;
  }
}

export default TransactionsRepository;
