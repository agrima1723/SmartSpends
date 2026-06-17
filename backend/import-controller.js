import { CSVImport, Transaction, Account, Category } from './models.js';

export const uploadCSV = async (req, res) => {
  try {
    const { accountId, csvData } = req.body;
    
    const account = await Account.findOne({ _id: accountId, userId: req.user.id });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    
    const rows = csvData.trim().split('\n');
    const importLog = new CSVImport({
      userId: req.user.id,
      fileName: req.body.fileName || 'import.csv',
      accountId,
      totalRows: rows.length - 1,
      status: 'processing',
    });
    
    let successCount = 0;
    let failedRows = [];
    let importedTransactions = [];
    
    for (let i = 1; i < rows.length; i++) {
      try {
        const [date, description, category, amount, type] = rows[i].split(',').map(s => s.trim());
        
        if (!date || !description || !amount) {
          failedRows.push({ rowNumber: i + 1, reason: 'Missing required fields' });
          continue;
        }
        
        const categoryDoc = await Category.findOne({ userId: req.user.id, name: category });
        const categoryId = categoryDoc?._id || null;
        
        const transaction = new Transaction({
          accountId,
          userId: req.user.id,
          description,
          amount: parseFloat(amount),
          type: type || 'expense',
          category: categoryId,
          date: new Date(date),
          source: 'csv_import',
        });
        
        await transaction.save();
        importedTransactions.push(transaction._id);
        successCount++;
      } catch (error) {
        failedRows.push({ rowNumber: i + 1, reason: error.message });
      }
    }
    
    importLog.successfulImports = successCount;
    importLog.failedRows = failedRows;
    importLog.importedTransactions = importedTransactions;
    importLog.status = successCount > 0 ? 'completed' : 'failed';
    
    await importLog.save();
    
    res.status(201).json({
      message: 'CSV import processed',
      importLog: {
        id: importLog._id,
        totalRows: importLog.totalRows,
        successfulImports: successCount,
        failedRows: failedRows.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getImportHistory = async (req, res) => {
  try {
    const imports = await CSVImport.find({ userId: req.user.id })
      .populate('accountId', 'accountName')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ imports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getImportDetails = async (req, res) => {
  try {
    const importLog = await CSVImport.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('accountId', 'accountName')
      .populate('importedTransactions');
    if (!importLog) return res.status(404).json({ error: 'Import not found' });
    res.json(importLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTemplateCSV = (req, res) => {
  const template = `Date,Description,Category,Amount,Type
2024-01-15,Grocery Shopping,Groceries,50.00,expense
2024-01-16,Salary,Income,2000.00,income
2024-01-17,Gas,Transportation,30.00,expense`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="budget-tracker-template.csv"');
  res.send(template);
};
