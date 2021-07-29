using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace NBC_DATA.Interface.AdoProcedure
{
    public interface IAdoProcedureRepository
    {
        void ExecuteNonQuery(string sql, params object[] parameters);
        void ExecuteNonQueryText(string sql, params object[] parameters);
        T ExecuteScalar<T>(string sql, params object[] parameters);
        DataSet FillData(string sql, params object[] parameters);
        DataSet FillData(string sql, DataSet ds, params object[] parameters);
        void BatchBulkSave(string sql, DataTable dataTable, string destinationTbl, string tempText, params object[] parameters);
    }
}
