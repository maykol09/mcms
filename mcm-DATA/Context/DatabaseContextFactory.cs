using NBC_DATA.Interface;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Text;

namespace NBC_DATA.Context
{
    public class DatabaseContextFactory : IDatabaseContextFactory
    {
        private IDatabaseContext dataContext;
        private readonly string _connectionString;

        public DatabaseContextFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        /// <summary>
        /// If data context remain null then initialize new context 
        /// </summary>
        /// <returns>dataContext</returns>
        public IDatabaseContext Context()
        {
            return dataContext ?? (dataContext = new DatabaseContext(_connectionString));
        }

        /// <summary>
        /// Dispose existing context
        /// </summary>
        public void Dispose()
        {
            if (dataContext != null)
                dataContext.Dispose();
        }
    }
}
