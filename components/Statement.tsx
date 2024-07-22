import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useBalanceStore } from '@/store/balanceStore';
import { format } from 'date-fns';

export const generatePDF = async () => {
  const { balance, transactions } = useBalanceStore.getState();

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .header {
            background-color: #FF6600;
            color: white;
            padding: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .account-info {
            margin-bottom: 20px;
          }
          .account-summary {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: right;
          }
          th {
            background-color: #f2f2f2;
          }
          .left-align {
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Business Account Statement</h1>
        </div>
        <div class="content">
          <div class="account-info">
            <p><strong>Account Number:</strong> 000000</p>
            <p><strong>Statement Period:</strong> All</p>
          </div>
          <div class="account-summary">
            <h2>Account Summary</h2>
            <p><strong>Opening Balance:</strong> £ ${transactions[0].amount.toFixed(2)}</p>
            <p><strong>Closing Balance:</strong> £ ${balance().toFixed(2)}</p>
          </div>
          <h2>Transaction Details</h2>
          <table>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
            ${transactions
              .map(
                (transaction) => `
              <tr>
                <td class="left-align">${format(transaction.date, 'dd/MM/yyyy HH:mm')}</td>
                <td class="left-align">${transaction.title}</td>
                <td>$${transaction.amount.toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </table>
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};
