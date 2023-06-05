const itemCtrl = (function () {
  const Item = function (id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  };

  const data = {
    items: [],
  };

  return {
    logData: function () {
      return data;
    },
    addMoney: function (description, amount) {
      let ID = itemCtrl.createID();

      newMoney = new Item(ID, description, amount);

      data.items.push(newMoney);

      return newMoney;
    },
    createID: function () {
      const idNum = Math.floor(Math.random() * 10000);
      return idNum;
    },
    getIdNumber: function (item) {
      const amountId = item.parentElement.id;

      const itemArr = amountId.split("-");

      const id = parseInt(itemArr[1]);

      return id;
    },
    deleteAmountArr: function (id) {
      const ids = data.items.map(function (item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
  };
})();

const UICtrl = (function () {
  const UISelectors = {
    incomeBtn: "#add__income",
    expenseBtn: "#add__expense",
    description: "#description",
    amount: "#amount",
    moneyEarned: "#amount__earned",
    moneyAvailable: "#amount__available",
    moneySpent: "#amount__spent",
    incomeList: "#income__container",
    expensesList: "#expenses__container",
    incomeItem: ".income__amount",
    expenseItem: ".expense__amount",
    itemsContainer: ".items__container",
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },
    getDescriptionInput: function () {
      return {
        descriptionInput: document.querySelector(UISelectors.description).value,
      };
    },
    getValueInput: function () {
      return {
        amountInput: document.querySelector(UISelectors.amount).value,
      };
    },
    addIncomeItem: function (item) {
      const div = document.createElement("div");

      div.classList = "item income";

      div.id = `item-${item.id}`;

      div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__income">
                <p class="symbol">$</p>
                <span class="income__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;

      document
        .querySelector(UISelectors.incomeList)
        .insertAdjacentElement("beforeend", div);
    },
    clearInputs: function () {
      document.querySelector(UISelectors.description).value = "";
      document.querySelector(UISelectors.amount).value = "";
    },
    updateEarned: function () {
      const allIncome = document.querySelectorAll(UISelectors.incomeItem);

      const incomeCount = [...allIncome].map((item) => +item.innerHTML);

      const incomeSum = incomeCount.reduce(function (a, b) {
        return a + b;
      }, 0);

      const earnedTotal = (document.querySelector(
        UISelectors.moneyEarned
      ).innerHTML = incomeSum.toFixed(2));
    },
    addExpenseItem: function (item) {
      const div = document.createElement("div");

      div.classList = "item expense";

      div.id = `item-${item.id}`;

      div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__expense">
                <p class="symbol">$</p>
                <span class="expense__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;

      document
        .querySelector(UISelectors.expensesList)
        .insertAdjacentElement("beforeend", div);
    },
    updateSpent: function () {
      const allExpenses = document.querySelectorAll(UISelectors.expenseItem);

      const expenseCount = [...allExpenses].map((item) => +item.innerHTML);

      const expenseSum = expenseCount.reduce(function (a, b) {
        return a + b;
      }, 0);

      const expensesTotal = (document.querySelector(
        UISelectors.moneySpent
      ).innerHTML = expenseSum);
    },
    updateAvailable: function () {
      const earned = document.querySelector(UISelectors.moneyEarned);
      const spent = document.querySelector(UISelectors.moneySpent);
      const available = document.querySelector(UISelectors.moneyAvailable);
      available.innerHTML = (+earned.innerHTML - +spent.innerHTML).toFixed(2);
    },
    deleteAmount: function (id) {
      const amountId = `#item-${id}`;

      const amountDelete = document.querySelector(amountId);

      amountDelete.remove();
    },
  };
})();

const App = (function () {
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.incomeBtn)
      .addEventListener("click", addIncome);

    document
      .querySelector(UISelectors.expenseBtn)
      .addEventListener("click", addExpense);

    document
      .querySelector(UISelectors.itemsContainer)
      .addEventListener("click", deleteItem);
  };

  const addIncome = function () {
    const description = UICtrl.getDescriptionInput();
    const amount = UICtrl.getValueInput();

    if (description.descriptionInput !== "" && amount.amountInput !== "") {
      const newMoney = itemCtrl.addMoney(
        description.descriptionInput,
        amount.amountInput
      );

      UICtrl.addIncomeItem(newMoney);

      UICtrl.clearInputs();

      UICtrl.updateEarned();

      UICtrl.updateAvailable();
    }
  };

  const addExpense = function () {
    const description = UICtrl.getDescriptionInput();
    const amount = UICtrl.getValueInput();

    if (description.descriptionInput !== "" && amount.amountInput !== "") {
      const newMoney = itemCtrl.addMoney(
        description.descriptionInput,
        amount.amountInput
      );

      UICtrl.addExpenseItem(newMoney);

      UICtrl.clearInputs();

      UICtrl.updateSpent();

      UICtrl.updateAvailable();
    }
  };

  const deleteItem = function (e) {
    if (e.target.classList.contains("far")) {
      const id = itemCtrl.getIdNumber(e.target);

      UICtrl.deleteAmount(id);

      itemCtrl.deleteAmountArr(id);

      UICtrl.updateEarned();

      UICtrl.updateSpent();

      UICtrl.updateAvailable();
    }

    e.preventDefault();
  };

  return {
    init: function () {
      loadEventListeners();
    },
  };
})(itemCtrl, UICtrl);

App.init();
