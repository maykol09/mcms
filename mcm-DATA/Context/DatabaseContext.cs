using NBC_DATA.Extension;
using NBC_DATA.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
namespace NBC_DATA.Context
{
    public class DatabaseContext : IDatabaseContext
    {
        private readonly string _connectionString;
        private SqlConnection _connection;

        /// <summary>
        /// Get connection string inside constructor.
        /// So when the class will be initialized then connection string will be automatically get from web.config
        /// </summary>
        /// <param name="connectionStringName"></param>
        public DatabaseContext(string connectionStringName)
        {
            _connectionString = connectionStringName.Decrypt();
        }

        /// <summary>
        /// Gets the connection.
        /// </summary>
        public SqlConnection Connection
        {
            get
            {
                if (_connection == null)
                {
                    _connection = new SqlConnection(_connectionString);
                }
                if (_connection.State != ConnectionState.Open)
                {
                    _connection.Open();
                }
                return _connection;
            }
        }

        public void Dispose()
        {
            if (_connection != null)
            {
                _connection.Dispose();
            }
        }
    }
}
