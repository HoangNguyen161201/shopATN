const managerProducts = require('./managerProducts');
const managerCategories = require('./managerCategories');
const managerSuppliers = require('./managerSuppliers');
const managerCustomers = require('./managerCustomers');
const managerInvoices = require('./managerInvoices');
const managerAccount = require('./managerAccount');
const controllerHome = require('../app/controllers/controllerHome');
const controllerExcel = require('../app/controllers/controllerExcel');
const login = require('./login');

function mainroute(app){
    app.get('/',controllerHome.show);
    app.use('/managerProduct',managerProducts);
    app.use('/managerCategories',managerCategories);
    app.use('/managerSuppliers',managerSuppliers);
    app.use('/managerCustomers',managerCustomers);
    app.use('/managerInvoices',managerInvoices);
    app.use('/managerAccounts',managerAccount);
    app.use('/login',login);
    app.get('/exportData1',controllerExcel.exportData);
    app.get('/exportData',controllerExcel.show);
}

module.exports = mainroute;