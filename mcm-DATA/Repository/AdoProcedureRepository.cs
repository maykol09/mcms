using NBC_DATA.Interface;
using NBC_DATA.Interface.AdoProcedure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace NBC_DATA.Repository
{
    public class AdoProcedureRepository : IAdoProcedureRepository
    {
        private readonly IDatabaseContext _context;
        //private readonly IDatabaseContext _context_registry;
        private readonly IUnitOfWork _unitOfWork;

        public AdoProcedureRepository(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _context = _unitOfWork.DataContext;
        }

        public void ExecuteNonQuery(string sql, params object[] parameters)
        {
            using (var sqlCommand = new SqlCommand(sql, _context.Connection, _unitOfWork.Transaction))
            using (var sqlDataAdapter = new SqlDataAdapter(sqlCommand))
            {
                sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                sqlCommand.Parameters.AddRange(parameters);
                sqlCommand.ExecuteNonQuery();
            }
        }

        public void ExecuteNonQueryText(string sql, params object[] parameters)
        {
            using (var sqlCommand = new SqlCommand(sql, _context.Connection, _unitOfWork.Transaction))
            using (var sqlDataAdapter = new SqlDataAdapter(sqlCommand))
            {
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.Parameters.AddRange(parameters);
                sqlCommand.ExecuteNonQuery();
            }
        }

        public T ExecuteScalar<T>(string sql, params object[] parameters)
        {
            using (var sqlCommand = new SqlCommand(sql, _context.Connection, _unitOfWork.Transaction))
            using (var sqlDataAdapter = new SqlDataAdapter(sqlCommand))
            {
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddRange(parameters);
                var result = sqlCommand.ExecuteScalar();
                if (result != null) { return (T)Convert.ChangeType(result, typeof(T)); }
                return (default(T));
            }
        }

        public DataSet FillData(string sql, params object[] parameters)
        {
            using (var sqlCommand = new SqlCommand(sql, _context.Connection))
            using (var sqlDataAdapter = new SqlDataAdapter(sqlCommand))
            {
                sqlCommand.CommandType = CommandType.StoredProcedure;
                var ds = new DataSet();
                if (parameters.Length > 0) sqlCommand.Parameters.AddRange(parameters);
                sqlDataAdapter.Fill(ds);
                return ds;
            }
        }
        public DataSet FillData(string sql, DataSet ds, params object[] parameters)
        {
            using (var sqlCommand = new SqlCommand(sql, _context.Connection))
            using (var sqlDataAdapter = new SqlDataAdapter(sqlCommand))
            {
                sqlCommand.CommandType = CommandType.StoredProcedure;
                if (parameters.Length > 0) sqlCommand.Parameters.AddRange(parameters);
                sqlDataAdapter.FillSchema(ds, SchemaType.Mapped);
                sqlDataAdapter.Fill(ds);
                return ds;
            }
        }

        public void BatchBulkSave(string sql, DataTable dataTable, string destinationTbl, string tempText, params object[] parameters)
        {
            using (var sqlCommand = new SqlCommand(tempText, _context.Connection, _unitOfWork.Transaction))
            using (var sqlDataAdapter = new SqlDataAdapter(sqlCommand))
            {
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.ExecuteNonQuery();
            }

            using (var sbc = new SqlBulkCopy(_context.Connection))
            {
                sbc.DestinationTableName = destinationTbl;
                sbc.BatchSize = dataTable.Rows.Count;
                sbc.WriteToServer(dataTable);
            }

            using (var sqlCommand = new SqlCommand(sql, _context.Connection, _unitOfWork.Transaction))
            using (var sqlDataAdapter = new SqlDataAdapter(sqlCommand))
            {

                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddRange(parameters);
                sqlCommand.ExecuteNonQuery();
            }

        }
    }
}
