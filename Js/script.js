const ThemeManager = {
    switchTheme() {
  
      let COLOR_THEME = switchThemeButton.checked ? 'dark' : 'light';
  
      if (COLOR_THEME === 'dark') {
        document.querySelector("body").classList.add('dark');
      } else {
        document.querySelector("body").classList.remove('dark')
      }
  
    },
  
    initTheme() {
  
      let COLOR_THEME = window.matchMedia("(prefers-color-scheme: light)").matches ? 'light' : 'dark';
        console.log(COLOR_THEME)
      if (COLOR_THEME === "dark") {
        document.querySelector("body").classList.add('dark');
        switchThemeButton.checked = true
      } else {
        document.querySelector("body").classList.remove('dark')
        switchThemeButton.checked = false
      }
      return COLOR_THEME
    }
  }

const Modal = {
        open(){
            document.querySelector('.modal-overlay')
            .classList.add('active')
        },
        close(){
            document.querySelector('.modal-overlay')
            .classList.remove('active')
        }
    }

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactios'))|| []
    },
    set(transactions){
        localStorage.setItem
        ("dev.finances:transactios",
        JSON.stringify(transactions))
        }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index){
        Transaction.all.splice(index,1)
        App.reload();
    },
    incomes(){
        let income = 0;
        console.log(Transaction.all)
        Transaction.all.forEach((transaction)=>{
            if(transaction.amount > 0){
                
                console.log(transaction.amount)
                income += transaction.amount;
            }
        })
        return income ;

    },
    expenses(){
        let expense = 0;
        Transaction.all.forEach((transaction)=>{
            if(transaction.amount < 0){
                expense += transaction.amount;
               
            }
        })
        return expense;
    },
    total(){

        return Transaction.incomes() + Transaction.expenses();
    }
}
      
const DOM = {
    TransactionsContainer:document.querySelector('#data-table tbody'),
    addTransaction(transactions,index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transactions)
        tr.dataset.index = index;
        DOM.TransactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transactions,index ){
        const CSSclass = transactions.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transactions.amount)
        const HTML =`
                        <td class="description">${transactions.description}</td>
                        <td class="${CSSclass}">${amount}</td>
                        <td class="date">${transactions.date}</td>
                        <th>
                            <img  onclick ="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação" srcset="">
                        </th>
            `
            return HTML
    },
    updateBalance(){
        document
            .getElementById("incomeDisplay")
            .innerHTML =Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById("expenseDisplay")
            .innerHTML =Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total()) 
    },
    clearTransactions(){
        DOM.TransactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ?"-" : ""
        value = String(value).replace(/\D/g,"" )
        value = Number(value)/100
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
        return  signal+ value
    },
    formatAmount(value){
        value = Number(value)*100;
        return Math.round(value);
                
    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    formatValues(){
        let {description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date);
        return{
            description,
            amount,
            date,
        }
    },
    
    validateFiels(){  
        
        const {description, amount, date} = Form.getValues();
        if(description.trim()===""
            ||  amount.trim()===""
            ||date.trim()===""){
                throw new Error("Preencha todos os campos");
            }
    },
    clearFields(){
        Form.description.value =""
        Form.amount.value =""
        Form.date.value =""
    },
    submit(event){
        
        try{
            event.preventDefault()  
        
            Form.validateFiels();//Validar se todas os campos foram preenchidos
            
            const transaction = Form.formatValues();//formatar os dados para salvar
            
            Transaction.add(transaction)//salvar e atualiza a aplicacao
            
            Form.clearFields();//apagar os dados do formulario

            Modal.close(); //modal feche
            
        }catch(error){
            alert(error.message)
        }
        
    }
}

const App ={
    init(){
            Transaction.all.forEach((transaction,index)=>{
           DOM.addTransaction(transaction,index)
            })
            DOM.updateBalance()
        Storage.set(Transaction.all); 
        ThemeManager.initTheme()
 
    },
    reload(){
        DOM.clearTransactions();
        App.init();
    }
}

const switchThemeButton = document.querySelector(".checkbox");
console.log(switchThemeButton)
switchThemeButton.addEventListener("click", event => {
  ThemeManager.switchTheme()
})

App.init()


const body = document.querySelector('body')
console.log(body)