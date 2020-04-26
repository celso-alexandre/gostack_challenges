import React, { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import defaultCategory from '../../assets/transaction_icons/default.svg';
import foodCategory from '../../assets/transaction_icons/food.svg';
import homeCategory from '../../assets/transaction_icons/home.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('transactions');
      setBalance({
        income: formatValue(response.data.balance.income),
        outcome: formatValue(response.data.balance.outcome),
        total: formatValue(response.data.balance.total),
      });

      const formattedTransactionsResponse: Transaction[] = [];

      // eslint-disable-next-line array-callback-return
      response.data.transactions.map((transaction: Transaction) => {
        const valueWithSignal =
          transaction.type === 'outcome'
            ? transaction.value * -1
            : transaction.value;

        formattedTransactionsResponse.push({
          id: transaction.id,
          title: transaction.title,
          value: transaction.value,
          formattedValue: formatValue(valueWithSignal),
          formattedDate: formatDate(
            parseISO(transaction.created_at.toString()),
          ),
          type: transaction.type,
          category: { title: transaction.category.title },
          // eslint-disable-next-line @typescript-eslint/camelcase
          created_at: transaction.created_at,
        });
      });

      setTransactions(formattedTransactionsResponse);
    }

    loadTransactions();
  }, []);

  function returnIconCategory(categoryTitle: string): string {
    switch (categoryTitle) {
      case 'Home':
        return homeCategory;
      case 'Food':
        return foodCategory;
      default:
        return defaultCategory;
    }
  }

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>
                    <img
                      src={returnIconCategory(transaction.category.title)}
                      alt={transaction.category.title}
                    />
                    {transaction.category.title}
                  </td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
