import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = { income: 0, outcome: 0, total: 0 };
    this.transactions.filter((transaction: Transaction): null => {
      if (transaction.type === 'outcome') {
        balance.outcome += transaction.value;
        balance.total -= transaction.value;
      } else {
        balance.income += transaction.value;
        balance.total += transaction.value;
      }
      return null;
    });

    return balance;
  }

  public create({ title, value, type }: Transaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome') {
      const { total } = this.getBalance();

      if (value > total) {
        throw Error('No sufficient funds');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
