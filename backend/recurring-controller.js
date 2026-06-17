// // ============================================
// // Recurring Transaction Controller - Final Fix
// // ============================================
// import { RecurringTransaction, Transaction, User } from './models.js';
// import sendEmail from './mailer.js';

// // ============================================
// // CREATE RECURRING TRANSACTION
// // ============================================
// export async function createRecurring(req, res) {
//   try {
//     const { accountId, categoryId, type, amount, description, frequency, dayOfMonth, dayOfWeek, endDate } = req.body;
//     const userId = req.user.id;

//     if (!accountId || !categoryId || !type || !amount || !description || !frequency) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     if (amount <= 0) {
//       return res.status(400).json({ error: 'Amount must be greater than 0' });
//     }

//     const today = new Date();
//     let nextOccurrence = new Date(today);

//     if (frequency === 'daily') {
//       nextOccurrence.setDate(nextOccurrence.getDate() + 1);
//     } else if (frequency === 'weekly') {
//       nextOccurrence.setDate(nextOccurrence.getDate() + 7);
//     } else if (frequency === 'monthly') {
//       nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
//       if (dayOfMonth) nextOccurrence.setDate(dayOfMonth);
//     } else if (frequency === 'yearly') {
//       nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
//     }

//     const recurring = new RecurringTransaction({
//       userId,
//       accountId,
//       categoryId,
//       type,
//       amount,
//       description,
//       frequency,
//       dayOfMonth,
//       dayOfWeek,
//       nextOccurrence,
//       endDate: endDate || null,
//       isActive: true,
//     });

//     await recurring.save();

//     res.status(201).json({
//       message: 'Recurring transaction created successfully',
//       recurring,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // GET ALL RECURRING TRANSACTIONS
// // ============================================
// export async function getRecurringTransactions(req, res) {
//   try {
//     const userId = req.user.id;
//     const { active = true } = req.query;

//     const query = { userId };
//     if (active === 'true') query.isActive = true;

//     const recurring = await RecurringTransaction.find(query)
//       .populate('accountId', 'accountName')
//       .populate('categoryId', 'name')
//       .sort({ createdAt: -1 });

//     res.json({
//       count: recurring.length,
//       recurring,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // GET SINGLE RECURRING TRANSACTION
// // ============================================
// export async function getRecurring(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     const recurring = await RecurringTransaction.findOne({ _id: id, userId })
//       .populate('accountId')
//       .populate('categoryId');

//     if (!recurring) {
//       return res.status(404).json({ error: 'Recurring transaction not found' });
//     }

//     res.json(recurring);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // UPDATE RECURRING TRANSACTION
// // ============================================
// export async function updateRecurring(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const { amount, description, frequency, dayOfMonth, dayOfWeek, endDate, isActive } = req.body;

//     const recurring = await RecurringTransaction.findOne({ _id: id, userId });

//     if (!recurring) {
//       return res.status(404).json({ error: 'Recurring transaction not found' });
//     }

//     if (amount) {
//       if (amount <= 0) return res.status(400).json({ error: 'Amount must be greater than 0' });
//       recurring.amount = amount;
//     }

//     if (description) recurring.description = description;
//     if (frequency) recurring.frequency = frequency;
//     if (dayOfMonth !== undefined) recurring.dayOfMonth = dayOfMonth;
//     if (dayOfWeek !== undefined) recurring.dayOfWeek = dayOfWeek;
//     if (endDate !== undefined) recurring.endDate = endDate;
//     if (isActive !== undefined) recurring.isActive = isActive;

//     await recurring.save();

//     res.json({
//       message: 'Recurring transaction updated successfully',
//       recurring,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // DELETE RECURRING TRANSACTION
// // ============================================
// export async function deleteRecurring(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     const recurring = await RecurringTransaction.findOneAndDelete({ _id: id, userId });

//     if (!recurring) {
//       return res.status(404).json({ error: 'Recurring transaction not found' });
//     }

//     res.json({
//       message: 'Recurring transaction deleted successfully',
//       recurring,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // TOGGLE RECURRING TRANSACTION STATUS
// // ============================================
// export async function toggleRecurring(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     const recurring = await RecurringTransaction.findOne({ _id: id, userId });

//     if (!recurring) {
//       return res.status(404).json({ error: 'Recurring transaction not found' });
//     }

//     recurring.isActive = !recurring.isActive;
//     await recurring.save();

//     res.json({
//       message: `Recurring transaction ${recurring.isActive ? 'activated' : 'deactivated'}`,
//       recurring,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // GET UPCOMING RECURRING TRANSACTIONS
// // ============================================
// export async function getUpcomingRecurring(req, res) {
//   try {
//     const userId = req.user.id;
//     const { days = 30 } = req.query;

//     const today = new Date();
//     const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

//     const recurring = await RecurringTransaction.find({
//       userId,
//       isActive: true,
//       nextOccurrence: { $gte: today, $lte: futureDate },
//     })
//       .populate('accountId', 'accountName')
//       .populate('categoryId', 'name')
//       .sort({ nextOccurrence: 1 });

//     res.json({
//       count: recurring.length,
//       recurring,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // EXECUTE RECURRING TRANSACTIONS (Manual Route Trigger)
// // ============================================
// export async function executeRecurring(req, res) {
//   try {
//     const userId = req.user.id;
//     const userEmail = req.user.email; 
//     const today = new Date();

//     const recurringList = await RecurringTransaction.find({
//       userId,
//       isActive: true,
//       nextOccurrence: { $lte: today },
//     }).populate('accountId', 'accountName');

//     const executed = [];

//     for (const recurring of recurringList) {
//       if (recurring.endDate && today > recurring.endDate) {
//         recurring.isActive = false;
//         await recurring.save();
//         continue;
//       }

//       try {
//         const transaction = new Transaction({
//           userId,
//           accountId: recurring.accountId?._id || recurring.accountId,
//           categoryId: recurring.categoryId,
//           type: recurring.type,
//           amount: recurring.amount,
//           currency: 'USD',
//           convertedAmount: recurring.amount,
//           description: recurring.description,
//           date: new Date(),
//         });

//         await transaction.save();

//         const next = new Date(recurring.nextOccurrence);
//         if (recurring.frequency === 'daily') next.setDate(next.getDate() + 1);
//         else if (recurring.frequency === 'weekly') next.setDate(next.getDate() + 7);
//         else if (recurring.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
//         else if (recurring.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

//         recurring.nextOccurrence = next;
//         recurring.lastExecuted = new Date();
//         await recurring.save();

//         if (userEmail) {
//           const emailSubject = `🔔 Recurring Transaction Processed: ${recurring.description}`;
//           const emailBody = `
//             <h3>Hello,</h3>
//             <p>Your scheduled recurring transaction has arrived and was processed successfully.</p>
//             <hr />
//             <ul>
//               <li><strong>Description:</strong> ${recurring.description}</li>
//               <li><strong>Amount:</strong> $${recurring.amount.toLocaleString()}</li>
//               <li><strong>Type:</strong> ${recurring.type.toUpperCase()}</li>
//               <li><strong>Account:</strong> ${recurring.accountId?.accountName || 'Primary Account'}</li>
//               <li><strong>Next Date:</strong> ${next.toLocaleDateString('en-US', { dateStyle: 'long' })}</li>
//             </ul>
//             <p>Thank you for managing your balance with Budget Tracker!</p>
//           `;
          
//           await sendEmail({
//             to: userEmail,
//             subject: emailSubject,
//             html: emailBody,
//             text: `Recurring transaction for ${recurring.description} of amount ${recurring.amount} has been processed.`
//           });
//         }

//         executed.push({
//           recurringId: recurring._id,
//           transactionId: transaction._id,
//           description: recurring.description,
//           amount: recurring.amount,
//         });
//       } catch (error) {
//         console.error(`Failed manual process iteration for ID ${recurring._id}:`, error);
//       }
//     }

//     res.json({
//       message: `Executed ${executed.length} recurring transaction(s)`,
//       executed,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // ============================================
// // SYSTEM AUTOMATION WORKER (Runs globally on server interval loop)
// // ============================================
// export async function checkAndExecuteAllRecurringTransactions() {
//   try {
//     const today = new Date();

//     const globalDueList = await RecurringTransaction.find({
//       isActive: true,
//       nextOccurrence: { $lte: today }
//     })
//     .populate('userId') 
//     .populate('accountId', 'accountName');

//     if (globalDueList.length === 0) return;

//     console.log(`⏰ Found ${globalDueList.length} due recurring transactions. Executing batch...`);

//     for (const recurring of globalDueList) {
//       if (recurring.endDate && today > recurring.endDate) {
//         recurring.isActive = false;
//         await recurring.save();
//         continue;
//       }

//       let targetUserEmail = null;
//       if (recurring.userId && typeof recurring.userId === 'object') {
//         targetUserEmail = recurring.userId.email;
//       }

//       if (!targetUserEmail && recurring.userId) {
//         const fallbackUser = await User.findById(recurring.userId);
//         if (fallbackUser) {
//           targetUserEmail = fallbackUser.email;
//         }
//       }

//       if (!targetUserEmail) {
//         console.error(`⚠️ Skipping transaction ${recurring._id}: User or Email could not be linked.`);
//         continue;
//       }

//       try {
//         const transaction = new Transaction({
//           userId: recurring.userId?._id || recurring.userId,
//           accountId: recurring.accountId?._id || recurring.accountId,
//           categoryId: recurring.categoryId,
//           type: recurring.type,
//           amount: recurring.amount,
//           currency: 'USD',
//           convertedAmount: recurring.amount,
//           description: recurring.description,
//           date: new Date(),
//         });

//         await transaction.save();

//         const next = new Date(recurring.nextOccurrence);
//         if (recurring.frequency === 'daily') next.setDate(next.getDate() + 1);
//         else if (recurring.frequency === 'weekly') next.setDate(next.getDate() + 7);
//         else if (recurring.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
//         else if (recurring.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

//         recurring.nextOccurrence = next;
//         recurring.lastExecuted = new Date();
//         await recurring.save();

//         const emailSubject = `🔔 Auto-Billing Processed: ${recurring.description}`;
//         const emailBody = `
//           <h3>Hello,</h3>
//           <p>This is an automated message confirming that your recurring scheduled transaction has hit its date and was successfully processed.</p>
//           <hr />
//           <ul>
//             <li><strong>Item:</strong> ${recurring.description}</li>
//             <li><strong>Value:</strong> $${recurring.amount.toLocaleString()}</li>
//             <li><strong>Transaction Type:</strong> ${recurring.type.toUpperCase()}</li>
//             <li><strong>Target Ledger:</strong> ${recurring.accountId?.accountName || 'Primary Account'}</li>
//             <li><strong>Next Auto-run Date:</strong> ${next.toLocaleDateString('en-US', { dateStyle: 'long' })}</li>
//           </ul>
//           <hr />
//           <p>Log in anytime to see your updated dashboards.</p>
//         `;
        
//         // 🌟 Added 'await' here to force the script to log only when the email is actually processed
//         await sendEmail({
//           to: targetUserEmail,
//           subject: emailSubject,
//           html: emailBody,
//           text: `Automated message: Recurring transaction for ${recurring.description} was processed.`
//         });

//       } catch (err) {
//         console.error(`❌ Background processing failed for transaction field ${recurring._id}:`, err);
//       }
//     }
//     console.log('✓ Automated recurring transaction execution complete.');
//   } catch (error) {
//     console.error('System validation for global transaction logs failed:', error);
//   }
// }

// ============================================
// Recurring Transaction Controller - Final Fix
// ============================================
import { RecurringTransaction, Transaction, User } from './models.js';
import sendEmail from './mailer.js';

// ============================================
// CREATE RECURRING TRANSACTION
// ============================================
export async function createRecurring(req, res) {
  try {
    const { accountId, categoryId, type, amount, description, frequency, dayOfMonth, dayOfWeek, endDate } = req.body;
    const userId = req.user.id;

    if (!accountId || !categoryId || !type || !amount || !description || !frequency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const today = new Date();
    let nextOccurrence = new Date(today);

    if (frequency === 'daily') {
      nextOccurrence.setDate(nextOccurrence.getDate() + 1);
    } else if (frequency === 'weekly') {
      nextOccurrence.setDate(nextOccurrence.getDate() + 7);
    } else if (frequency === 'monthly') {
      nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
      if (dayOfMonth) nextOccurrence.setDate(dayOfMonth);
    } else if (frequency === 'yearly') {
      nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
    }

    const recurring = new RecurringTransaction({
      userId,
      accountId,
      categoryId,
      type,
      amount,
      description,
      frequency,
      dayOfMonth,
      dayOfWeek,
      nextOccurrence,
      endDate: endDate || null,
      isActive: true,
    });

    await recurring.save();

    res.status(201).json({
      message: 'Recurring transaction created successfully',
      recurring,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET ALL RECURRING TRANSACTIONS
// ============================================
export async function getRecurringTransactions(req, res) {
  try {
    const userId = req.user.id;
    const { active = true } = req.query;

    const query = { userId };
    if (active === 'true') query.isActive = true;

    const recurring = await RecurringTransaction.find(query)
      .populate('accountId', 'accountName')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      count: recurring.length,
      recurring,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET SINGLE RECURRING TRANSACTION
// ============================================
export async function getRecurring(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recurring = await RecurringTransaction.findOne({ _id: id, userId })
      .populate('accountId')
      .populate('categoryId');

    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    res.json(recurring);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// UPDATE RECURRING TRANSACTION
// ============================================
export async function updateRecurring(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, description, frequency, dayOfMonth, dayOfWeek, endDate, isActive } = req.body;

    const recurring = await RecurringTransaction.findOne({ _id: id, userId });

    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    if (amount) {
      if (amount <= 0) return res.status(400).json({ error: 'Amount must be greater than 0' });
      recurring.amount = amount;
    }

    if (description) recurring.description = description;
    if (frequency) recurring.frequency = frequency;
    if (dayOfMonth !== undefined) recurring.dayOfMonth = dayOfMonth;
    if (dayOfWeek !== undefined) recurring.dayOfWeek = dayOfWeek;
    if (endDate !== undefined) recurring.endDate = endDate;
    if (isActive !== undefined) recurring.isActive = isActive;

    await recurring.save();

    res.json({
      message: 'Recurring transaction updated successfully',
      recurring,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// DELETE RECURRING TRANSACTION
// ============================================
export async function deleteRecurring(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recurring = await RecurringTransaction.findOneAndDelete({ _id: id, userId });

    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    res.json({
      message: 'Recurring transaction deleted successfully',
      recurring,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// TOGGLE RECURRING TRANSACTION STATUS
// ============================================
export async function toggleRecurring(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recurring = await RecurringTransaction.findOne({ _id: id, userId });

    if (!recurring) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    recurring.isActive = !recurring.isActive;
    await recurring.save();

    res.json({
      message: `Recurring transaction ${recurring.isActive ? 'activated' : 'deactivated'}`,
      recurring,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET UPCOMING RECURRING TRANSACTIONS
// ============================================
export async function getUpcomingRecurring(req, res) {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const recurring = await RecurringTransaction.find({
      userId,
      isActive: true,
      nextOccurrence: { $gte: today, $lte: futureDate },
    })
      .populate('accountId', 'accountName')
      .populate('categoryId', 'name')
      .sort({ nextOccurrence: 1 });

    res.json({
      count: recurring.length,
      recurring,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// EXECUTE RECURRING TRANSACTIONS (Manual Route Trigger)
// ============================================
export async function executeRecurring(req, res) {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email; 
    const today = new Date();

    const recurringList = await RecurringTransaction.find({
      userId,
      isActive: true,
      nextOccurrence: { $lte: today },
    }).populate('accountId', 'accountName');

    const executed = [];

    for (const recurring of recurringList) {
      // 🌟 FIXED: If the transaction has hit its end date on manual execution
      if (recurring.endDate && today > recurring.endDate) {
        recurring.isActive = false;
        await recurring.save();

        if (userEmail) {
          try {
            await sendEmail({
              to: userEmail,
              subject: `🛑 Cycle Finished: ${recurring.description}`,
              html: `
                <h3>Hello,</h3>
                <p>Your recurring item <strong>"${recurring.description}"</strong> has reached its configured final date (${new Date(recurring.endDate).toLocaleDateString()}).</p>
                <p>This tracking loop has been marked <strong>Inactive</strong> and will no longer bill or log automatically.</p>
              `,
              text: `Your recurring item "${recurring.description}" has hit its final end date and is now disabled.`
            });
          } catch (mailErr) {
            console.error(`Email delivery failed on manual termination for ${recurring._id}:`, mailErr.message);
          }
        }
        continue;
      }

      try {
        const transaction = new Transaction({
          userId,
          accountId: recurring.accountId?._id || recurring.accountId,
          categoryId: recurring.categoryId,
          type: recurring.type,
          amount: recurring.amount,
          currency: 'USD',
          convertedAmount: recurring.amount,
          description: recurring.description,
          date: new Date(),
        });

        await transaction.save();

        const next = new Date(recurring.nextOccurrence);
        if (recurring.frequency === 'daily') next.setDate(next.getDate() + 1);
        else if (recurring.frequency === 'weekly') next.setDate(next.getDate() + 7);
        else if (recurring.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
        else if (recurring.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

        recurring.nextOccurrence = next;
        recurring.lastExecuted = new Date();
        await recurring.save();

        if (userEmail) {
          const emailSubject = `🔔 Recurring Transaction Processed: ${recurring.description}`;
          const emailBody = `
            <h3>Hello,</h3>
            <p>Your scheduled recurring transaction has arrived and was processed successfully.</p>
            <hr />
            <ul>
              <li><strong>Description:</strong> ${recurring.description}</li>
              <li><strong>Amount:</strong> $${recurring.amount.toLocaleString()}</li>
              <li><strong>Type:</strong> ${recurring.type.toUpperCase()}</li>
              <li><strong>Account:</strong> ${recurring.accountId?.accountName || 'Primary Account'}</li>
              <li><strong>Next Date:</strong> ${next.toLocaleDateString('en-US', { dateStyle: 'long' })}</li>
            </ul>
            <p>Thank you for managing your balance with Budget Tracker!</p>
          `;
          
          await sendEmail({
            to: userEmail,
            subject: emailSubject,
            html: emailBody,
            text: `Recurring transaction for ${recurring.description} of amount ${recurring.amount} has been processed.`
          });
        }

        executed.push({
          recurringId: recurring._id,
          transactionId: transaction._id,
          description: recurring.description,
          amount: recurring.amount,
        });
      } catch (error) {
        console.error(`Failed manual process iteration for ID ${recurring._id}:`, error);
      }
    }

    res.json({
      message: `Executed ${executed.length} recurring transaction(s)`,
      executed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// SYSTEM AUTOMATION WORKER (Runs globally on server interval loop)
// ============================================
export async function checkAndExecuteAllRecurringTransactions() {
  try {
    const today = new Date();

    // Look for entries that are active AND have either a due nextOccurrence OR have passed their absolute endDate
    const globalDueList = await RecurringTransaction.find({
      isActive: true,
      $or: [
        { nextOccurrence: { $lte: today } },
        { endDate: { $ne: null, $lt: today } }
      ]
    })
    .populate('userId') 
    .populate('accountId', 'accountName');

    if (globalDueList.length === 0) return;

    console.log(`⏰ Found ${globalDueList.length} recurring items to review. Processing batch...`);

    for (const recurring of globalDueList) {
      let targetUserEmail = null;
      if (recurring.userId && typeof recurring.userId === 'object') {
        targetUserEmail = recurring.userId.email;
      }

      if (!targetUserEmail && recurring.userId) {
        const fallbackUser = await User.findById(recurring.userId);
        if (fallbackUser) {
          targetUserEmail = fallbackUser.email;
        }
      }

      if (!targetUserEmail) {
        console.error(`⚠️ Skipping transaction ${recurring._id}: User or Email could not be linked.`);
        continue;
      }

      // 🌟 FIXED: If the transaction has hit its end date on system automation loop run
      if (recurring.endDate && today > recurring.endDate) {
        console.log(`🔒 End date reached for "${recurring.description}". Turning loop off and sending notification.`);
        recurring.isActive = false;
        await recurring.save();

        try {
          await sendEmail({
            to: targetUserEmail,
            subject: `🛑 Cycle Finished: ${recurring.description}`,
            html: `
              <h3>Hello,</h3>
              <p>Your scheduled tracking cycle for <strong>"${recurring.description}"</strong> has officially reached its final end date (${new Date(recurring.endDate).toLocaleDateString()}).</p>
              <p>This entry has been set to <strong>Inactive</strong>. No further ledger operations will be compiled automatically for this schedule.</p>
              <br/>
              <p>Best regards,<br/>Budget Tracker Core Automation Engine</p>
            `,
            text: `Your tracking cycle for "${recurring.description}" has finished and is now disabled.`
          });
          console.log(`📬 Expiration announcement delivered successfully for item ID: ${recurring._id}`);
        } catch (mailErr) {
          console.error(`❌ Background terminal termination email delivery failed for ${recurring._id}:`, mailErr.message);
        }
        continue;
      }

      // If it hasn't expired but is due, run the normal logging cycle:
      try {
        const transaction = new Transaction({
          userId: recurring.userId?._id || recurring.userId,
          accountId: recurring.accountId?._id || recurring.accountId,
          categoryId: recurring.categoryId,
          type: recurring.type,
          amount: recurring.amount,
          currency: 'USD',
          convertedAmount: recurring.amount,
          description: recurring.description,
          date: new Date(),
        });

        await transaction.save();

        const next = new Date(recurring.nextOccurrence);
        if (recurring.frequency === 'daily') next.setDate(next.getDate() + 1);
        else if (recurring.frequency === 'weekly') next.setDate(next.getDate() + 7);
        else if (recurring.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
        else if (recurring.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

        recurring.nextOccurrence = next;
        recurring.lastExecuted = new Date();
        await recurring.save();

        const emailSubject = `🔔 Auto-Billing Processed: ${recurring.description}`;
        const emailBody = `
          <h3>Hello,</h3>
          <p>This is an automated message confirming that your recurring scheduled transaction has hit its date and was successfully processed.</p>
          <hr />
          <ul>
            <li><strong>Item:</strong> ${recurring.description}</li>
            <li><strong>Value:</strong> $${recurring.amount.toLocaleString()}</li>
            <li><strong>Transaction Type:</strong> ${recurring.type.toUpperCase()}</li>
            <li><strong>Target Ledger:</strong> ${recurring.accountId?.accountName || 'Primary Account'}</li>
            <li><strong>Next Auto-run Date:</strong> ${next.toLocaleDateString('en-US', { dateStyle: 'long' })}</li>
          </ul>
          <hr />
          <p>Log in anytime to see your updated dashboards.</p>
        `;
        
        await sendEmail({
          to: targetUserEmail,
          subject: emailSubject,
          html: emailBody,
          text: `Automated message: Recurring transaction for ${recurring.description} was processed.`
        });

      } catch (err) {
        console.error(`❌ Background processing failed for transaction field ${recurring._id}:`, err);
      }
    }
    console.log('✓ Automated recurring transaction execution complete.');
  } catch (error) {
    console.error('System validation for global transaction logs failed:', error);
  }
}