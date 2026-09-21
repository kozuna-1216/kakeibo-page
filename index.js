const STORAGE_KEY = 'kakeibo-expenses';

const form = document.getElementById('expense-form');
const totalAmount = document.getElementById('total-amount');
const expenseList = document.getElementById('expense-list');

// localStorageに保存されている登録データを取得する（無ければ空配列）
function loadExpenses() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// 登録データをlocalStorageへ保存する
function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// 登録データを元に一覧表と合計金額を再描画する
function render(expenses) {
  expenseList.innerHTML = '';

  if (expenses.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.id = 'empty-message';
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = '登録されたデータはありません。';
    emptyRow.appendChild(cell);
    expenseList.appendChild(emptyRow);
  } else {
    expenses.forEach((expense) => {
      const row = document.createElement('tr');
      const values = [
        expense.date,
        expense.item,
        expense.type === 'expense' ? '支出' : '収入',
        `${expense.amount.toLocaleString('ja-JP')}円`
      ];

      values.forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });

      expenseList.appendChild(row);
    });
  }

  const total = expenses.reduce((sum, expense) => {
    return sum + (expense.type === 'expense' ? -expense.amount : expense.amount);
  }, 0);
  totalAmount.textContent = `${total.toLocaleString('ja-JP')}円`;
}

// ページ読み込み時：localStorageから読み込んで表示する
document.addEventListener('DOMContentLoaded', () => {
  const expenses = loadExpenses();
  render(expenses);
});

// フォーム送信時：データを追加保存し、表示を更新する
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const expense = {
    date: formData.get('date'),
    item: formData.get('item'),
    type: formData.get('type'),
    amount: Number(formData.get('amount'))
  };

  const expenses = loadExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
  render(expenses);

  form.reset();
});
