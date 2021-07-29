using NBC_DATA.Interface;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace NBC_DATA.Context
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDatabaseContextFactory _factory;
        private IDatabaseContext _context;
        public SqlTransaction Transaction { get; private set; }

        /// <summary>
        /// Constructor which will initialize the datacontext factory
        /// </summary>
        /// <param name="factory">datacontext factory</param>
        public UnitOfWork(IDatabaseContextFactory factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Following method will use to Commit or Rollback memory data into database
        /// </summary>
        public void Commit()
        {
            if (Transaction == null)
            {
                throw new NullReferenceException("Tryed commit not opened transaction");
            }

            try
            {
                Transaction.Commit();
            }
            catch (Exception)
            {
                Transaction.Rollback();
            }
            Transaction.Dispose();
            Transaction = null;
        }

        /// <summary>
        /// Define a property of context class
        /// </summary>
        public IDatabaseContext DataContext
        {
            get { return _context ?? (_context = _factory.Context()); }
        }

        /// <summary>
        /// Begin a database transaction
        /// </summary>
        /// <returns>Transaction</returns>
        public SqlTransaction BeginTransaction()
        {
            if (Transaction != null)
            {
                throw new InvalidOperationException("Previous transaction still not committed.");
            }
            Transaction = _context.Connection.BeginTransaction();
            return Transaction;
        }

        /// <summary>
        /// dispose a Transaction.
        /// </summary>
        public void Dispose()
        {
            if (Transaction != null)
            {
                Transaction.Dispose();
            }
            if (_context != null)
            {
                _context.Dispose();
            }
        }
    }
}

